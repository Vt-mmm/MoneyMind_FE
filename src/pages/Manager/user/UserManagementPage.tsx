import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardHeader,
  Container,
  Grid,
  Typography,
  CircularProgress,
  TablePagination,
  Paper,
  Stack,
  Avatar,
  Chip,
  TextField,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "redux/config";
import { getAllUsers } from "redux/userAccount/manageAccountSlice";

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isLoading, totalCount } = useAppSelector(
    (state) => state.userAccount
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc user không có role "Admin" và "Manager"
  const filteredUsers = users
    .filter(
      (user) =>
        Array.isArray(user.roles) &&
        !user.roles.some((role: string) =>
          ["admin", "manager"].includes(role.toLowerCase())
        )
    )
    .filter(
      (user) =>
        searchTerm === "" ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  useEffect(() => {
    dispatch(
      getAllUsers({
        optionParams: {
          itemsPerPage: rowsPerPage,
          currentPage: page + 1,
          searchValue: searchTerm,
          sortBy: "fullName",
        },
        navigate,
      })
    );
  }, [page, rowsPerPage, searchTerm, dispatch, navigate]);

  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Quản lý người dùng</Typography>
      </Stack>

      {/* Thanh tìm kiếm */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Tìm kiếm người dùng"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Card>
        <CardHeader title="Danh sách người dùng" />
        <Box p={2}>
          {isLoading ? (
            <Stack alignItems="center" mt={2}>
              <CircularProgress />
            </Stack>
          ) : (
            <Grid container spacing={2}>
              {filteredUsers.map((user, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={user.accountId}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      transition: "0.3s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <Stack spacing={1} alignItems="center">
                      <Avatar
                        sx={{ bgcolor: "primary.main", width: 56, height: 56 }}
                      >
                        {user.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="h6">{user.fullName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                      <Chip
                        icon={
                          user.emailConfirmed ? (
                            <CheckCircleOutlineIcon />
                          ) : (
                            <HighlightOffIcon />
                          )
                        }
                        label={
                          user.emailConfirmed ? "Đã xác nhận" : "Chưa xác nhận"
                        }
                        color={user.emailConfirmed ? "success" : "error"}
                        variant="outlined"
                      />
                      <Chip
                        label={user.roles[0] || "Không có vai trò"}
                        color="primary"
                      />
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
          <TablePagination
            component="div"
            count={totalCount || 0}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) =>
              setRowsPerPage(parseInt(event.target.value, 10))
            }
            rowsPerPageOptions={[10, 20, 50]}
          />
        </Box>
      </Card>
    </Container>
  );
};

export default UserManagementPage;
