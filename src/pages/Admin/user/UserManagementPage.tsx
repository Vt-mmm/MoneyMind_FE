import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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
  Avatar,
  Paper,
  InputAdornment,
  Chip,
  Tooltip,
  Badge,
  Divider,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  VpnKey as VpnKeyIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "redux/config";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "redux/userAccount/manageAccountSlice";

// Constants
const PRIMARY_COLOR = '#4caf50';
const DANGER_COLOR = '#d32f2f';
const VERIFIED_COLOR = '#00c853';
const UNVERIFIED_COLOR = '#ff9800';

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.04)}`,
  maxHeight: 'calc(100vh - 300px)',
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(PRIMARY_COLOR, 0.2),
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: alpha(theme.palette.common.black, 0.05),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  whiteSpace: 'nowrap',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&.MuiTableCell-head': {
    backgroundColor: alpha(PRIMARY_COLOR, 0.04),
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: '0.875rem',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(PRIMARY_COLOR, 0.02),
  },
  '&:hover': {
    backgroundColor: alpha(PRIMARY_COLOR, 0.05),
  },
  transition: 'background-color 0.2s',
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: '#fff',
    transition: 'all 0.2s ease-in-out',
    '& fieldset': {
      borderColor: alpha(PRIMARY_COLOR, 0.2),
    },
    '&:hover fieldset': {
      borderColor: PRIMARY_COLOR,
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 2px ${alpha(PRIMARY_COLOR, 0.2)}`,
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  padding: '8px 16px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: `0 4px 12px ${alpha(PRIMARY_COLOR, 0.2)}`,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: VERIFIED_COLOR,
    color: '#fff',
    width: 16,
    height: 16,
    borderRadius: '50%',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': {
    padding: '0 8px',
  },
}));

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { users, isLoading, totalCount } = useAppSelector(
    (state) => state.userAccount
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState({
    accountId: "",
    email: "",
    fullName: "",
    roleName: "",
    status: "",
  });

  const sortedUsers = [...users].sort((a, b) =>
    a.fullName.localeCompare(b.fullName)
  );

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
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between" 
          mb={4}
          sx={{
            backgroundColor: '#fff',
            borderRadius: 3,
            p: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: alpha(PRIMARY_COLOR, 0.1),
                color: PRIMARY_COLOR,
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} color="primary">
                User Management
              </Typography>
            </Box>
          </Stack>

          <ActionButton
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => dispatch(getAllUsers({ optionParams: {}, navigate }))}
            sx={{
              bgcolor: PRIMARY_COLOR,
              '&:hover': {
                bgcolor: alpha(PRIMARY_COLOR, 0.9),
              }
            }}
          >
            Refresh List
          </ActionButton>
        </Stack>

        {/* Search & Stats Section */}
        <Paper 
          sx={{ 
            mb: 3, 
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }}
        >
          <Stack spacing={2} p={3}>
            <SearchTextField
              fullWidth
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: PRIMARY_COLOR }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <Stack 
              direction="row" 
              spacing={3} 
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: alpha(VERIFIED_COLOR, 0.1),
                    color: VERIFIED_COLOR,
                  }}
                >
                  <CheckCircleOutlineIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Verified Users
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {filteredUsers.filter(user => user.emailConfirmed).length}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: alpha(UNVERIFIED_COLOR, 0.1),
                    color: UNVERIFIED_COLOR,
                  }}
                >
                  <HighlightOffIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending Verification
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {filteredUsers.filter(user => !user.emailConfirmed).length}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        {/* Main Content */}
        <Paper sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>No.</StyledTableCell>
                  <StyledTableCell>User Information</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <StyledTableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <CircularProgress size={40} sx={{ color: PRIMARY_COLOR }} />
                    </StyledTableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <StyledTableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Stack alignItems="center" spacing={2}>
                        <Avatar sx={{ 
                          width: 56, 
                          height: 56, 
                          bgcolor: alpha(PRIMARY_COLOR, 0.1),
                          color: PRIMARY_COLOR 
                        }}>
                          <PersonIcon />
                        </Avatar>
                        <Box textAlign="center">
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No users found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Try adjusting your search criteria
                          </Typography>
                        </Box>
                      </Stack>
                    </StyledTableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, index) => (
                    <StyledTableRow key={user.accountId}>
                      <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                      <StyledTableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: user.emailConfirmed ? VERIFIED_COLOR : UNVERIFIED_COLOR,
                              },
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                bgcolor: alpha(PRIMARY_COLOR, 0.9),
                                fontSize: 16,
                                fontWeight: 600,
                              }}
                            >
                              {user.fullName.charAt(0)}
                            </Avatar>
                          </StyledBadge>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {user.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <StyledChip
                          icon={user.emailConfirmed ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
                          label={user.emailConfirmed ? "Verified" : "Pending"}
                          sx={{
                            bgcolor: user.emailConfirmed 
                              ? alpha(VERIFIED_COLOR, 0.1)
                              : alpha(UNVERIFIED_COLOR, 0.1),
                            color: user.emailConfirmed ? VERIFIED_COLOR : UNVERIFIED_COLOR,
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <StyledChip
                          icon={<VpnKeyIcon sx={{ fontSize: 16 }} />}
                          label={user.roles && user.roles.length > 0 ? user.roles[0] : ""}
                          sx={{ 
                            bgcolor: alpha(PRIMARY_COLOR, 0.1),
                            color: PRIMARY_COLOR,
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit User">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenUpdate(user)}
                              sx={{ 
                                color: PRIMARY_COLOR,
                                '&:hover': { 
                                  bgcolor: alpha(PRIMARY_COLOR, 0.1),
                                  transform: 'scale(1.1)',
                                },
                                transition: 'transform 0.2s',
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              size="small"
                              onClick={() => handleConfirmDelete(user)}
                              sx={{ 
                                color: DANGER_COLOR,
                                '&:hover': { 
                                  bgcolor: alpha(DANGER_COLOR, 0.1),
                                  transform: 'scale(1.1)',
                                },
                                transition: 'transform 0.2s',
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>

          {filteredUsers.length > 0 && (
            <Box sx={{ p: 2, borderTop: `1px solid ${alpha('#000', 0.1)}` }}>
              <TablePagination
                component="div"
                count={totalCount || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50]}
                sx={{
                  '.MuiTablePagination-select': {
                    borderRadius: 1,
                    '&:focus': {
                      bgcolor: alpha(PRIMARY_COLOR, 0.1),
                    },
                  },
                }}
              />
            </Box>
          )}
        </Paper>

        {/* Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              p: 3,
              bgcolor: PRIMARY_COLOR, 
              color: 'white',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <EditIcon />
              <Typography variant="h6">Update User Information</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                value={currentUser.email}
                InputProps={{ 
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: alpha('#000', 0.5) }} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: alpha('#000', 0.02),
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: PRIMARY_COLOR }} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={currentUser.roleName}
                  onChange={(e) =>
                    setCurrentUser((prev) => ({
                      ...prev,
                      roleName: e.target.value,
                    }))
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <VpnKeyIcon sx={{ color: PRIMARY_COLOR, ml: 1 }} />
                    </InputAdornment>
                  }
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                      pl: 4,
                    },
                  }}
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenDialog(false)}
              sx={{ 
                borderRadius: 2,
                borderColor: alpha(PRIMARY_COLOR, 0.5),
                color: PRIMARY_COLOR,
                '&:hover': {
                  borderColor: PRIMARY_COLOR,
                  bgcolor: alpha(PRIMARY_COLOR, 0.1),
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ 
                borderRadius: 2,
                bgcolor: PRIMARY_COLOR,
                '&:hover': {
                  bgcolor: alpha(PRIMARY_COLOR, 0.9),
                }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              p: 3,
              bgcolor: DANGER_COLOR, 
              color: 'white',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <DeleteIcon />
              <Typography variant="h6">Confirm Deletion</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent sx={{ p: 3, mt: 2 }}>
            <Stack spacing={2}>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to delete this user?
              </Typography>
              {userToDelete && (
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(DANGER_COLOR, 0.1),
                        color: DANGER_COLOR,
                      }}
                    >
                      {userToDelete.fullName?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {userToDelete.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {userToDelete.email}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              )}
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                This action cannot be undone.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenDeleteDialog(false)}
              sx={{ 
                borderRadius: 2,
                borderColor: alpha(DANGER_COLOR, 0.5),
                color: DANGER_COLOR,
                '&:hover': {
                  borderColor: DANGER_COLOR,
                  bgcolor: alpha(DANGER_COLOR, 0.1),
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              sx={{ 
                borderRadius: 2,
                bgcolor: DANGER_COLOR,
                '&:hover': {
                  bgcolor: alpha(DANGER_COLOR, 0.9),
                }
              }}
            >
              Delete User
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default UserManagementPage;