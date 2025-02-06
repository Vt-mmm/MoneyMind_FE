import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  TablePagination,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "redux/config";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "redux/userAccount/manageAccountSlice";

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy danh sách user, trạng thái và tổng số bản ghi từ Redux
  const { users, isLoading, totalCount } = useAppSelector(
    (state) => state.userAccount
  );

  // State phân trang: page là index (0-based) của MUI, currentPage của API có thể là 1-based
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Tạo mảng sortedUsers dựa trên users
  const sortedUsers = [...users].sort((a, b) =>
    a.userName.localeCompare(b.userName)
  );

  // Các state cho Dialog cập nhật và xóa user
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    accountId: 0,
    email: "",
    userName: "",
    roleName: "",
    status: "",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  useEffect(() => {
    dispatch(
      getAllUsers({
        optionParams: {
          itemsPerPage: rowsPerPage,
          currentPage: page + 1, // API dùng 1-based page
          searchValue: "",
          sortBy: "userName"  // Thêm tham số sortBy để sắp xếp theo userName
        },
        navigate,
      })
    );
  }, [page, rowsPerPage, dispatch, navigate]);

  // Mở dialog cập nhật user
  const handleOpenUpdate = (user: any) => {
    setCurrentUser({
      accountId: user.id, // Sử dụng user.id nếu API trả về id
      email: user.email,
      userName: user.userName,
      roleName: user.roleName,
      status: user.status,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    await dispatch(
      updateUser({
        data: {
          email: currentUser.email,
          userName: currentUser.userName, // update userName
        },
        accountId: currentUser.accountId, // giá trị này bây giờ đã là user.id
        navigate,
      })
    );
    setOpenDialog(false);
  };

  // Mở dialog xác nhận xóa user
  const handleConfirmDelete = (user: any) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  // Thực hiện xóa user
  const handleDelete = async () => {
    if (userToDelete) {
      await dispatch(
        deleteUser({
          accountId: userToDelete.accountId, // hoặc userToDelete.id nếu dữ liệu trả về khác
          optionParams: { itemsPerPage: rowsPerPage, currentPage: page + 1 },
          navigate,
        })
      );
    }
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  // Xử lý thay đổi page (MUI truyền newPage là 0-based)
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng trên mỗi trang
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset page về 0 khi thay đổi số dòng
  };

  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Quản lý người dùng</Typography>
        {/* Nút thêm người dùng đã bị loại bỏ theo yêu cầu trước */}
      </Stack>

      <Card>
        <CardHeader title="Danh sách người dùng" />
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
                      <TableCell>Email</TableCell>
                      <TableCell>User Name</TableCell>
                      <TableCell>Trạng Thái</TableCell>
                      <TableCell>Hành Động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedUsers.map((user, index) => (
                      <TableRow key={user.accountId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.userName}</TableCell>
                        <TableCell>
                          {user.emailConfirmed ? (
                            <CheckCircleOutlineIcon sx={{ color: "green" }} />
                          ) : (
                            <HighlightOffIcon sx={{ color: "red" }} />
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenUpdate(user)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleConfirmDelete(user)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Thêm TablePagination */}
              <TablePagination
                component="div"
                count={totalCount || 0}
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

      {/* Dialog cập nhật user */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật người dùng</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Email (không thể thay đổi)"
              value={currentUser.email}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="User Name"
              value={currentUser.userName}
              onChange={(e) =>
                setCurrentUser((prev) => ({
                  ...prev,
                  userName: e.target.value,
                }))
              }
            />

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa user */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <strong>{userToDelete?.email}</strong> không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagementPage;
