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
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { useAppSelector } from "redux/config";
import { getAllTags } from "redux/tag/manageTagSlice";

const fadeInSlideUp = { "0%": { opacity: 0, transform: "translateY(10px)" }, "100%": { opacity: 1, transform: "translateY(0)" } };
const AnimatedTableRow = styled(TableRow)({ animation: `fadeInSlideUp 0.4s ease-out forwards`, "@keyframes fadeInSlideUp": fadeInSlideUp });
const StyledTableCell = styled(TableCell)(({ theme }) => ({ padding: theme.spacing(1.5), verticalAlign: "middle" }));

const ManageTagPage = () => {
  const dispatch = useDispatch();
  const { tags, isLoading, totalRecord } = useAppSelector((state) => state.tag);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(
      getAllTags({
        optionParams: {
          itemsPerPage: rowsPerPage,
          currentPage: page + 1,
          searchValue: "",
          sortBy: "name",
        },
      })
    );
  }, [page, rowsPerPage, dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Manage Tags
        </Typography>
      </Stack>

      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardHeader
          title="Tag List"
          titleTypographyProps={{ variant: "h6", fontWeight: "medium" }}
          sx={{ bgcolor: "#f5f5f5", py: 1.5 }}
        />
        <Box p={3}>
          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" minHeight={200}>
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary" mt={2}>
                Loading data...
              </Typography>
            </Stack>
          ) : tags.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" minHeight={200}>
              <Typography variant="body1" color="text.secondary">
                No tags found.
              </Typography>
            </Stack>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#fafafa" }}>
                      <StyledTableCell sx={{ fontWeight: "bold" }}>No.</StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold" }}>Tag Name</StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold" }}>Description</StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold" }}>Color</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tags.map((tag, index) => (
                      <AnimatedTableRow key={tag.id} sx={{ "&:hover": { bgcolor: "#f9fafb" }, transition: "background-color 0.2s" }}>
                        <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                        <StyledTableCell>{tag.name}</StyledTableCell>
                        <StyledTableCell>
                          {tag.description || (
                            <Typography variant="body2" color="text.secondary">
                              No description
                            </Typography>
                          )}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Tooltip title={tag.color}>
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                backgroundColor: tag.color,
                                borderRadius: "4px",
                                border: "1px solid #e0e0e0",
                                display: "inline-block",
                                transition: "transform 0.2s",
                                "&:hover": { transform: "scale(1.1)" },
                              }}
                            />
                          </Tooltip>
                        </StyledTableCell>
                      </AnimatedTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={totalRecord || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50]}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </Box>
      </Card>
    </Container>
  );
};

export default ManageTagPage;