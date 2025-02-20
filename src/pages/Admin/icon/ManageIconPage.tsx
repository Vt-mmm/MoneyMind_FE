import React, { useEffect, useState, ChangeEvent } from "react";
import { Box, Button, Card, CardContent, Grid, Typography, Input } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { listImages, deleteImage, uploadImage } from "../../../firebase/firebasesystem";

interface IconItem {
  id: string;
  name: string;
  url: string;
}

// Hàm trích xuất tên file từ URL Firebase Storage
const getFileNameFromUrl = (url: string): string => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const withoutQuery = decodedUrl.split('?')[0];
    const fileName = withoutQuery.split('/').pop() || "";
    return fileName;
  } catch (err) {
    console.error("Error decoding URL:", err);
    return "";
  }
};

const ManageIcon: React.FC = () => {
  const [iconList, setIconList] = useState<IconItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const urls = await listImages("Icons");
        const icons: IconItem[] = urls.map(url => {
          const fileName = getFileNameFromUrl(url);
          return { id: url, name: fileName, url };
        });
        setIconList(icons);
      } catch (err) {
        console.error("Error fetching icons:", err);
        setError("Đã xảy ra lỗi khi lấy danh sách icon");
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  // Handler chọn file từ máy tính
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Đặt tên file mặc định từ file được chọn
      setNewFileName(file.name);
      setError(""); // Clear lỗi nếu có trước đó
    }
  };

  // Hàm upload file với kiểm tra tên file đã tồn tại
  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!newFileName.trim()) {
      setError("Tên file không được để trống");
      return;
    }
    // Kiểm tra tên file đã tồn tại (không phân biệt chữ hoa chữ thường)
    const exists = iconList.some(
      (icon) => icon.name.toLowerCase() === newFileName.trim().toLowerCase()
    );
    if (exists) {
      setError("Tên file đã tồn tại");
      return;
    }

    setError(""); // Clear lỗi nếu không có
    setUploading(true);
    try {
      // Upload file với tên mới được chỉ định
      const url = await uploadImage(selectedFile, "Icons", newFileName.trim());
      const newIcon: IconItem = {
        id: url,
        name: newFileName.trim(),
        url
      };
      setIconList((prev) => [...prev, newIcon]);
      // Reset lại state sau upload
      setSelectedFile(null);
      setNewFileName("");
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
      setError("Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  // Hàm xóa icon
  const deleteIcon = async (id: string) => {
    const iconToDelete = iconList.find((icon) => icon.id === id);
    if (!iconToDelete) {
      console.error("Không tìm thấy icon để xóa");
      return;
    }
    try {
      await deleteImage(iconToDelete.url);
      setIconList((prev) => prev.filter((icon) => icon.id !== id));
    } catch (error) {
      console.error("Lỗi xóa icon:", error);
    }
  };

  // Hàm clear file chọn và tên file
  const handleClear = () => {
    setSelectedFile(null);
    setNewFileName("");
    setError("");
  };

  if (loading)
    return (
      <Box p={4}>
        <Typography variant="h6">Đang tải...</Typography>
      </Box>
    );
  return (
    <Box p={4}>
      <Typography variant="h4" component="h1" gutterBottom color="green">
        Icon Management
      </Typography>

      {/* Khu vực chọn file */}
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="upload-file"
        />
        <label htmlFor="upload-file">
          <Button variant="contained" color="primary" component="span">
            Choose File
          </Button>
        </label>
        {selectedFile && (
          <Typography variant="body1">Selected: {selectedFile.name}</Typography>
        )}
        <Button variant="outlined" color="warning" onClick={handleClear}>
          Clear
        </Button>
      </Box>

      {/* Khu vực nhập tên file mới, upload và clear */}
      <Box mb={4} display="flex" alignItems="center" gap={2}>
        <Input
          placeholder="Enter new file name"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          sx={{
            border: "1px solid #4caf50",
            padding: "8px",
            borderRadius: "4px",
            flex: 1,
          }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleUpload}
          startIcon={<Plus size={16} />}
          disabled={!selectedFile || uploading}
        >
          {uploading ? "Uploading..." : "Upload Icon"}
        </Button>
      </Box>

      {error && (
        <Box mb={2}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {iconList.map((icon) => (
          <Grid item xs={6} sm={4} md={3} key={icon.id}>
            <Card sx={{ backgroundColor: "#e8f5e9" }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <Box
                  component="img"
                  src={icon.url}
                  alt={icon.name}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: "8px",
                    mb: 1
                  }}
                />
                <Typography variant="subtitle1" gutterBottom color="green">
                  {icon.name}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => deleteIcon(icon.id)}
                  startIcon={<Trash2 size={16} />}
                  sx={{ mt: 1 }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ManageIcon;
