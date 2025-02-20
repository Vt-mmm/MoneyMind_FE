import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardHeader,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { useAppSelector } from "redux/config";
import { getAllTags } from "redux/tag/manageTagSlice";

const ManageTagPage = () => {
  const dispatch = useDispatch();

  // Lấy danh sách tag từ Redux store
  const { tags, isLoading, totalRecord } = useAppSelector((state) => state.tag);

  // State phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Gọi API lấy danh sách tags khi component mount hoặc khi thay đổi trang
  useEffect(() => {
    dispatch(
      getAllTags({
        optionParams: {
          itemsPerPage: rowsPerPage,
          currentPage: page + 1, // API sử dụng chỉ mục trang 1-based
          searchValue: "",
          sortBy: "name", // Sắp xếp theo tên tag
        },
      })
    );
  }, [page, rowsPerPage, dispatch]);

  // Xử lý thay đổi trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng trên mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Quản lý Tags</Typography>
      </Stack>

      <Card>
        <CardHeader title="Danh sách Tags" />
        <Box p={2}>
          {isLoading ? (
            <Stack alignItems="center" mt={2}>
              <CircularProgress />
            </Stack>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Tên Tag</TableCell>
                      <TableCell>Mô Tả</TableCell>
                      <TableCell>Màu Sắc</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tags.map((tag, index) => (
                      <TableRow key={tag.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{tag.name}</TableCell>
                        <TableCell>{tag.description}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: tag.color,
                              borderRadius: "50%",
                              display: "inline-block",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Phân trang */}
              <TablePagination
                component="div"
                count={totalRecord || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50]}
              />
            </>
          )}
        </Box>
      </Card>
    </Container>
  );
};

export default ManageTagPage;
