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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  styled,
} from "@mui/material";
import { keyframes } from '@emotion/react';

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "redux/config";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "redux/userAccount/manageAccountSlice";

// Animation cho table row
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components với màu xanh lá
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha('#e8f5e9', 0.1),
    transition: 'background-color 0.2s ease-in-out',
  },
  animation: `${fadeIn} 0.3s ease-in-out`,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  textTransform: 'none',
}));

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { users, isLoading, totalCount } = useAppSelector(
    (state) => state.userAccount
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const sortedUsers = [...users].sort((a, b) =>
    a.fullName.localeCompare(b.fullName)
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = sortedUsers.filter((user) => {
    const isNotAdmin =
      user.roles && Array.isArray(user.roles)
        ? !user.roles.some((role) => role.toLowerCase() === "admin")
        : true;
    const matchesSearch =
      searchTerm === "" ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return isNotAdmin && matchesSearch;
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    accountId: "",
    email: "",
    fullName: "",
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
          currentPage: page + 1,
          searchValue: searchTerm,
          sortBy: "fullName",
        },
        navigate,
      })
    );
  }, [page, rowsPerPage, searchTerm, dispatch, navigate]);

  const handleOpenUpdate = (user: any) => {
    setCurrentUser({
      accountId: user.id,
      email: user.email,
      fullName: user.fullName,
      roleName: user.roles && user.roles.length > 0 ? user.roles[0] : "",
      status: user.status,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    await dispatch(
      updateUser({
        data: {
          email: currentUser.email,
          fullName: currentUser.fullName,
          role: currentUser.roleName,
        },
        accountId: currentUser.accountId,
        navigate,
      })
    );
    setOpenDialog(false);
  };

  const handleConfirmDelete = (user: any) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (userToDelete) {
      await dispatch(
        deleteUser({
          accountId: userToDelete.id,
          navigate,
        })
      );
    }
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4caf50, #81c784)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          User Management
        </Typography>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#4caf50' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: 'white',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              '& fieldset': {
                borderColor: '#81c784',
              },
              '&:hover fieldset': {
                borderColor: '#4caf50',
              },
            },
          }}
        />
      </Stack>

      <StyledCard>
        <CardHeader 
          title="User List"
          titleTypographyProps={{ 
            variant: 'h6',
            fontWeight: 600,
            color: '#4caf50'
          }}
          sx={{ bgcolor: '#e8f5e9', borderBottom: '1px solid #81c784' }}
        />
        <Box p={3}>
          {isLoading ? (
            <Stack alignItems="center" mt={2}>
              <CircularProgress size={40} thickness={4} sx={{ color: '#4caf50' }} />
            </Stack>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
                      {["No.", "Email", "Full Name", "Status", "Role", "Actions"].map((header) => (
                        <TableCell 
                          key={header}
                          sx={{ 
                            fontWeight: 600, 
                            color: '#2e7d32',
                            py: 2,
                            borderBottom: '2px solid #81c784'
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <StyledTableRow key={user.accountId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.primary">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {user.fullName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {user.emailConfirmed ? (
                            <CheckCircleOutlineIcon 
                              sx={{ color: '#4caf50', fontSize: 24 }}
                            />
                          ) : (
                            <HighlightOffIcon 
                              sx={{ color: '#d32f2f', fontSize: 24 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              bgcolor: '#c8e6c9',
                              color: '#2e7d32',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: 'inline-block'
                            }}
                          >
                            {user.roles && user.roles.length > 0 ? user.roles[0] : ""}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              sx={{ 
                                color: '#4caf50',
                                '&:hover': { bgcolor: '#c8e6c9' }
                              }}
                              onClick={() => handleOpenUpdate(user)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              sx={{ 
                                color: '#d32f2f',
                                '&:hover': { bgcolor: '#ffcdd2' }
                              }}
                              onClick={() => handleConfirmDelete(user)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={totalCount || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50]}
                sx={{
                  '& .MuiTablePagination-toolbar': {
                    py: 1,
                  },
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    color: '#2e7d32',
                  },
                }}
              />
            </>
          )}
        </Box>
      </StyledCard>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white', py: 2 }}>
          Update User
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Stack spacing={3} mt={2}>
            <TextField
              label="Email (cannot be changed)"
              value={currentUser.email}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              fullWidth
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 1,
                  '& fieldset': { borderColor: '#81c784' },
                } 
              }}
            />
            <TextField
              label="Full Name"
              value={currentUser.fullName}
              onChange={(e) =>
                setCurrentUser((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              variant="outlined"
              fullWidth
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 1,
                  '& fieldset': { borderColor: '#81c784' },
                  '&:hover fieldset': { borderColor: '#4caf50' },
                } 
              }}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: '#2e7d32' }}>Role</InputLabel>
              <Select
                label="Role"
                value={currentUser.roleName}
                onChange={(e) =>
                  setCurrentUser((prev) => ({
                    ...prev,
                    roleName: e.target.value,
                  }))
                }
                sx={{ 
                  borderRadius: 1,
                  '& fieldset': { borderColor: '#81c784' },
                  '&:hover fieldset': { borderColor: '#4caf50' },
                }}
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <StyledButton 
            onClick={() => setOpenDialog(false)}
            sx={{ color: '#2e7d32' }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            sx={{ 
              bgcolor: '#4caf50',
              '&:hover': { bgcolor: '#388e3c' }
            }}
          >
            Save Changes
          </StyledButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#d32f2f', color: 'white', py: 2 }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Typography variant="body1">
            Are you sure you want to delete the user{" "}
            <strong>{userToDelete?.email}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <StyledButton 
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ color: '#2e7d32' }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleDelete}
            sx={{ 
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' }
            }}
          >
            Delete
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagementPage;