import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  CircularProgress,
  TablePagination,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { useAppSelector } from "redux/config";
import { getAllTags } from "redux/tag/manageTagSlice";
import SearchIcon from '@mui/icons-material/Search';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from "react-router-dom";

const fadeInSlideUp = {
  "0%": { opacity: 0, transform: "translateY(10px)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
};

const AnimatedTableRow = styled(TableRow)({
  animation: `fadeInSlideUp 0.4s ease-out forwards`,
  "@keyframes fadeInSlideUp": fadeInSlideUp
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  verticalAlign: "middle",
  fontSize: "0.875rem",
}));

const SearchTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
  },
});

const ManageTagPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { tags, isLoading, totalRecord } = useAppSelector((state) => state.tag);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    dispatch(
      getAllTags({
        optionParams: {
          itemsPerPage: rowsPerPage,
          currentPage: page + 1,
          searchValue,
          sortBy: "name",
        },
      })
    );
  }, [page, rowsPerPage, searchValue, dispatch, refreshKey]);

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Box sx={{ 
          p: 3, 
          borderRadius: 3, 
          bgcolor: theme.palette.background.paper,
          boxShadow: '0 0 20px rgba(0,0,0,0.05)'
        }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
            mb={3}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Manage Tags
              </Typography>
              <Chip 
                label={`${totalRecord || 0} tags`} 
                size="small" 
                sx={{ 
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 500
                }} 
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                }}
              >
                Refresh
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <SearchTextField
            fullWidth
            placeholder="Search tags by name..."
            value={searchValue}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400, mb: 3 }}
          />

          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" minHeight={300}>
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary" mt={2}>
                Loading tags...
              </Typography>
            </Stack>
          ) : tags.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" minHeight={300} spacing={2}>
              <InboxOutlinedIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.7 }} />
              <Typography variant="body1" color="text.secondary">
                No tags found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search
              </Typography>
            </Stack>
          ) : (
            <>
              <TableContainer sx={{ 
                borderRadius: 2, 
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                    <TableRow>
                      <StyledTableCell sx={{ fontWeight: 600 }}>No.</StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 600 }}>Tag Name</StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 600 }}>Description</StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 600 }}>Color</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tags.map((tag, index) => (
                      <AnimatedTableRow
                        key={tag.id}
                        sx={{
                          '&:hover': {
                            bgcolor: 'rgba(145, 158, 171, 0.08)',
                          },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                        <StyledTableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {tag.name}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          {tag.description || (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                              No description
                            </Typography>
                          )}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Tooltip title={tag.color} arrow>
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  backgroundColor: tag.color,
                                  borderRadius: '8px',
                                  border: '2px solid #fff',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                  display: 'inline-block',
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                  },
                                }}
                              />
                            </Tooltip>
                            <Typography variant="body2" color="text.secondary">
                              {tag.color}
                            </Typography>
                          </Stack>
                        </StyledTableCell>
                      </AnimatedTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <TablePagination
                  component="div"
                  count={totalRecord || 0}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 20, 50]}
                />
              </Box>
            </>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default ManageTagPage;