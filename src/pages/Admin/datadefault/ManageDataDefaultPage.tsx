import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getDataDefault } from 'redux/dataDefault/dataDefaultSlice';
import { useAppSelector } from 'redux/config';
import { WalletCategory, Activity } from 'common/models/datadefault'; // Đường dẫn import có thể thay đổi

const ManageDataDefaultPage: React.FC = () => {
  const dispatch = useDispatch();
  const { dataDefault, isLoading, isError, message, errorMessage } = useAppSelector(
    (state) => state.dataDefault
  );

  useEffect(() => {
    // Gọi thunk bằng cách dispatch(getDataDefault())
    dispatch(getDataDefault);
  }, [dispatch]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Data Default
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Typography variant="h6" color="error">
          {errorMessage}
        </Typography>
      ) : (
        <Box>
          <Typography variant="h6" color="green" gutterBottom>
            {message}
          </Typography>

          <Box mb={4}>
            <Typography variant="h5">Monthly Goal</Typography>
            <Typography variant="body1">
              Total Amount: {dataDefault.monthlyGoal.totalAmount}
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h5">Goal Item</Typography>
            <Typography variant="body1">
              Description: {dataDefault.goalItem.description}
            </Typography>
            <Typography variant="body2">
              Target: {dataDefault.goalItem.minTargetPercentage}% - {dataDefault.goalItem.maxTargetPercentage}%
            </Typography>
            <Typography variant="body2">
              Amount: {dataDefault.goalItem.minAmount} - {dataDefault.goalItem.maxAmount}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom>
              Wallet Categories
            </Typography>
            {dataDefault.walletCategories.map((category: WalletCategory, index: number) => (
              <Box
                key={index}
                mb={2}
                p={2}
                border="1px solid #ccc"
                borderRadius={2}
              >
                <Typography variant="h6">{category.name}</Typography>
                <Typography variant="body1">{category.description}</Typography>
                <Typography variant="body2">Icon: {category.iconPath}</Typography>
                <Typography variant="body2">Color: {category.color}</Typography>
                <Typography variant="body2">
                  Wallet Type ID: {category.walletTypeId}
                </Typography>
                <Box mt={1}>
                  <Typography variant="subtitle1">Activities:</Typography>
                  {category.activities.map((activity: Activity, idx: number) => (
                    <Typography key={idx} variant="body2" ml={2}>
                      {activity.name}: {activity.description}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ManageDataDefaultPage;
