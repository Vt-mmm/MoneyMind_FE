import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "redux/config";
import {
  Card, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress,
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { getDataDefault, updateDataDefault } from "redux/dataDefault/dataDefaultSlice";
import { getAllWalletTypes } from "redux/wallettype/manageWalletTypeSlice";
import { WalletCategory, GoalItem, MonthlyGoal } from "../../../common/models/datadefault";
import { listImages } from "../../../firebase/firebasesystem";

export interface FormDataDefault {
  walletCategories: WalletCategory[];
  monthlyGoal: MonthlyGoal;
  goalItem: GoalItem;
}

const ManageDataDefaultPage = () => {
  const dispatch = useDispatch();
  const { dataDefault } = useAppSelector((state) => state.dataDefault);
  const { walletTypes } = useAppSelector((state) => state.wallet);
  const [iconUrlList, setIconUrlList] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Khởi tạo state form chỉnh sửa
  const [form, setForm] = useState<FormDataDefault>({
    walletCategories: [],
    monthlyGoal: { totalAmount: 0 },
    goalItem: {
      description: "",
      minTargetPercentage: 0,
      maxTargetPercentage: 0,
      minAmount: 0,
      maxAmount: 0,
    },
  });
  const fetchIcons = async () => {
    try {
      const urls = await listImages("Icons");
      
      setIconUrlList(urls);
    } catch (err) {
      console.error("Error fetching icons:", err);
      setError("Đã xảy ra lỗi khi lấy danh sách icon");
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu ban đầu
  useEffect(() => {
    dispatch(getDataDefault());
    dispatch(
      getAllWalletTypes({
        optionParams: {
          itemsPerPage: 100,
          currentPage: 1,
          searchValue: "",
          sortBy: "name",
        },
      })
    );
    fetchIcons();
  }, [dispatch]);

  // Cập nhật form khi dữ liệu từ Redux thay đổi
  useEffect(() => {
    if (dataDefault) {
      setForm(dataDefault);
    }
  }, [dataDefault]);

  // Handler chung cho TextField (Input)
  const handleInputChange = (
    section: string,
    field: string,
    index?: number
  ) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    if (section === "walletCategories" && typeof index === "number") {
      const updatedCategories = [...form.walletCategories];
      updatedCategories[index] = {
        ...updatedCategories[index],
        [field]: event.target.value,
      };
      setForm((prev) => ({ ...prev, walletCategories: updatedCategories }));
    } else {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: event.target.value,
        },
      }));
    }
  };

  // Handler riêng cho Select
  const handleSelectChange = (
    section: string,
    field: string,
    index: number
  ) => (event: SelectChangeEvent<string>) => {
    if (section === "walletCategories") {
      const updatedCategories = [...form.walletCategories];
      updatedCategories[index] = {
        ...updatedCategories[index],
        [field]: event.target.value,
      };
      setForm((prev) => ({ ...prev, walletCategories: updatedCategories }));
    } else {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: event.target.value,
        },
      }));
    }
  };

  // Handler cho sự thay đổi của activities
  const handleActivityChange = (
    catIndex: number,
    activityIndex: number,
    field: string
  ) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCategories = [...form.walletCategories];
    const updatedActivities = [...updatedCategories[catIndex].activities];
    updatedActivities[activityIndex] = {
      ...updatedActivities[activityIndex],
      [field]: event.target.value,
    };
    updatedCategories[catIndex] = {
      ...updatedCategories[catIndex],
      activities: updatedActivities,
    };
    setForm((prev) => ({ ...prev, walletCategories: updatedCategories }));
  };  

  // Thêm một wallet category mới
  const addWalletCategory = () => {
    const newCategory: WalletCategory = {
      name: "",
      description: "",
      iconPath: "",
      color: "#000000",
      walletTypeId: "",
      activities: [],
    };
    setForm((prev) => ({
      ...prev,
      walletCategories: [...prev.walletCategories, newCategory],
    }));
  };

  // Xóa wallet category theo index
  const removeWalletCategory = (index: number) => {
    const updatedCategories = [...form.walletCategories];
    updatedCategories.splice(index, 1);
    setForm((prev) => ({ ...prev, walletCategories: updatedCategories }));
  };

  // Thêm một activity vào wallet category
  const addActivity = (catIndex: number) => {
    const newActivity = { name: "", description: "" };
    const updatedCategories = [...form.walletCategories];
    updatedCategories[catIndex] = {
      ...updatedCategories[catIndex],
      activities: [...updatedCategories[catIndex].activities, newActivity],
    };
    setForm((prev) => ({ ...prev, walletCategories: updatedCategories }));
  };
  
  // Xóa activity khỏi wallet category
  const removeActivity = (catIndex: number, activityIndex: number) => {
    const updatedCategories = [...form.walletCategories];
    const updatedActivities = [...updatedCategories[catIndex].activities];
    updatedActivities.splice(activityIndex, 1);
    updatedCategories[catIndex] = {
      ...updatedCategories[catIndex],
      activities: updatedActivities,
    };
    setForm((prev) => ({ ...prev, walletCategories: updatedCategories }));
  };
  // Mở dialog preview JSON
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

    // Xác nhận cập nhật: dispatch action update và đóng dialog
  const handleConfirmUpdate = () => {
    dispatch(updateDataDefault({ data: form }));
    setOpenDialog(false);
  };

  return (
    <Box className="flex h-screen bg-blue-50">
      <main className="flex-1 overflow-y-auto p-8">
        <Typography variant="h3" color="primary" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {/* Wallet Categories */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Wallet Categories"
                action={
                  <IconButton onClick={addWalletCategory} color="primary">
                    <AddCircleOutlineIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  {form.walletCategories.map((category, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <Box
                        border={1}
                        borderColor={category.color}
                        borderRadius={2}
                        p={2}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="h6">
                            Category {index + 1}
                          </Typography>
                          <IconButton
                            onClick={() => removeWalletCategory(index)}
                            color="secondary"
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </Box>
                        <TextField
                          label="Name"
                          value={category.name}
                          onChange={handleInputChange(
                            "walletCategories",
                            "name",
                            index
                          )}
                          fullWidth
                          margin="normal"
                        />
                        <TextField
                          label="Description"
                          value={category.description}
                          onChange={handleInputChange(
                            "walletCategories",
                            "description",
                            index
                          )}
                          fullWidth
                          margin="normal"
                        />
                        <Box display="flex" alignItems="center">
                          <FormControl fullWidth margin="normal">
                            <InputLabel id={`iconPath-label-${index}`}>Icon Path</InputLabel>
                            <Select
                              labelId={`iconPath-label-${index}`}
                              value={category.iconPath}
                              label="Icon Path"
                              onChange={handleSelectChange("walletCategories", "iconPath", index)}
                            >
                              {iconUrlList.map((url) => (
                                <MenuItem key={url} value={url}>
                                  {url}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => window.open(category.iconPath, "_blank")}
                            style={{ marginLeft: 8, marginTop: 16 }}
                          >
                            Preview
                          </Button>
                        </Box>
                        <FormControl fullWidth margin="normal">
                          <InputLabel id={`walletType-label-${index}`}>
                            Wallet Type
                          </InputLabel>
                          <Select
                            labelId={`walletType-label-${index}`}
                            value={category.walletTypeId}
                            label="Wallet Type"
                            onChange={handleSelectChange(
                              "walletCategories",
                              "walletTypeId",
                              index
                            )}
                          >
                            {walletTypes?.map((wt: any) => (
                              <MenuItem key={wt.id} value={wt.id}>
                                {wt.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Box mt={2}>
                          <Typography variant="subtitle1">
                            Activities
                          </Typography>
                          {category.activities &&
                            category.activities.map((activity, aIndex) => (
                              <Box
                                key={aIndex}
                                mt={1}
                                p={1}
                                border={1}
                                borderColor="grey.300"
                                borderRadius={1}
                              >
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Typography variant="body1">
                                    Activity {aIndex + 1}
                                  </Typography>
                                  <IconButton
                                    onClick={() =>
                                      removeActivity(index, aIndex)
                                    }
                                    color="secondary"
                                  >
                                    <RemoveCircleOutlineIcon />
                                  </IconButton>
                                </Box>
                                <TextField
                                  label="Activity Name"
                                  value={activity.name}
                                  onChange={handleActivityChange(
                                    index,
                                    aIndex,
                                    "name"
                                  )}
                                  fullWidth
                                  margin="dense"
                                />
                                <TextField
                                  label="Activity Description"
                                  value={activity.description}
                                  onChange={handleActivityChange(
                                    index,
                                    aIndex,
                                    "description"
                                  )}
                                  fullWidth
                                  margin="dense"
                                />
                              </Box>
                            ))}
                          <Box display="flex" justifyContent="flex-end" mt={1}>
                            <IconButton
                              onClick={() => addActivity(index)}
                              color="primary"
                            >
                              <AddCircleOutlineIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Monthly Goal */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Monthly Goal" />
              <CardContent>
                <TextField
                  label="Total Amount"
                  type="number"
                  value={form.monthlyGoal.totalAmount}
                  onChange={handleInputChange("monthlyGoal", "totalAmount")}
                  fullWidth
                  margin="normal"
                />
                <LinearProgress
                  variant="determinate"
                  value={form.monthlyGoal.totalAmount > 0 ? 100 : 0}
                  className="mt-4"
                />
              </CardContent>
            </Card>
          </Grid>
          {/* Goal Item */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Goal Item" />
              <CardContent>
                <TextField
                  label="Description"
                  value={form.goalItem.description}
                  onChange={handleInputChange("goalItem", "description")}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Min Target Percentage"
                  type="number"
                  value={form.goalItem.minTargetPercentage}
                  onChange={handleInputChange("goalItem", "minTargetPercentage")}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Max Target Percentage"
                  type="number"
                  value={form.goalItem.maxTargetPercentage}
                  onChange={handleInputChange("goalItem", "maxTargetPercentage")}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Min Amount"
                  type="number"
                  value={form.goalItem.minAmount}
                  onChange={handleInputChange("goalItem", "minAmount")}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Max Amount"
                  type="number"
                  value={form.goalItem.maxAmount}
                  onChange={handleInputChange("goalItem", "maxAmount")}
                  fullWidth
                  margin="normal"
                />
              </CardContent>
            </Card>
          </Grid>
          {/* Nút Update */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={4}>
              <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Update Data Default
              </Button>
            </Box>
          </Grid>
        </Grid>
      </main>
      {/* Dialog Preview JSON */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Preview Update JSON</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please review the following JSON update before confirming:
          </DialogContentText>
          <Box
            component="pre"
            p={2}
            bgcolor="#f5f5f5"
            borderRadius={2}
            overflow="auto"
            mt={2}
          >
            {JSON.stringify(form, null, 2)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageDataDefaultPage;
