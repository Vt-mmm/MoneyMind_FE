import React, { useEffect, useState } from "react";
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
import { getDataDefault } from "redux/dataDefault/dataDefaultSlice";

const ManageDataDefaultPage = () => {
  const dispatch = useDispatch();
  const { dataDefault, isLoading } = useAppSelector(
    (state) => state.dataDefault
  );

  // State phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(
      getDataDefault()
    );
    console.log(dataDefault);
  }, [page, rowsPerPage, dispatch]);

  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Quản lý Data Default</Typography>
      </Stack>

      <Card>
        <CardHeader title="Danh sách Data Default" />
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
                      <TableCell>Tên Danh Mục</TableCell>
                      <TableCell>Mô Tả</TableCell>
                      <TableCell>Màu Sắc</TableCell>
                      <TableCell>Hoạt Động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataDefault.walletCategories.map((category, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: category.color,
                              borderRadius: "50%",
                              display: "inline-block",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {category.activities.map((activity, idx) => (
                            <Typography key={idx} variant="body2">
                              {activity.name}: {activity.description}
                            </Typography>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                </Table>
              </TableContainer>


            </>
          )}
        </Box>
      </Card>
    </Container>
  );
};

export default ManageDataDefaultPage;