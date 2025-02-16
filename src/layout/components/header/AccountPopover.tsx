/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
// @mui icon
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
// @mui
import { Avatar, Button, MenuItem, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
// redux
import { logout } from "redux/auth/authSlice";
//
import images from "assets";
import { useNavigate, usePopover } from "hooks";
import { useAppDispatch, useAppSelector } from "redux/config";
import { PATH_AUTH } from "routes/paths";
import { MenuPopover } from "components";
import { Role } from "common/enums";
import { setIsLogout } from "redux/auth/authSlice";
import { removeAccessToken, removeRefreshToken } from "utils";

function AccountPopover() {
  const { navigate } = useNavigate();
  const dispatch = useAppDispatch();
  const { open, handleOpenMenu, handleCloseMenu } = usePopover();

  const { userAuth, isLogout } = useAppSelector((state) => state.auth);
  const handleLogout = async () => {
    document.title = "Đăng nhập - MoneyMind";

    removeAccessToken();
    removeRefreshToken();
    localStorage.removeItem("userAuth");
    sessionStorage.clear();

    try {
      await dispatch(logout(navigate)).unwrap();
      navigate(PATH_AUTH.login, { replace: true });
    } catch (error) {
      console.error("❌ Lỗi khi logout:", error);
    }
  };

  useEffect(() => {
    if (isLogout) {
      setTimeout(() => {
        dispatch(setIsLogout(false));
        navigate(PATH_AUTH.login);
      }, 100);
    }
  }, [isLogout, navigate, dispatch]);

  return (
    <>
      <Button
        onClick={handleOpenMenu}
        sx={{
          px: 1,
          py: 0.2,
          color: (theme) => theme.palette.grey[800],
          bgcolor: (theme) => alpha(theme.palette.grey[300], 0.5),
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "6px",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <Avatar src={images.common.moneymind_loginlogo} alt="avatar" />
        <Stack alignItems="start" sx={{ ml: 1, my: 0.5 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {userAuth?.roles?.includes(Role.MONEYMIND_ADMIN)
              ? "Quản Trị Viên"
              : userAuth?.roles?.includes(Role.MONEYMIND_MANAGER)
              ? "Quản Lý"
              : "header.account"}
          </Typography>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{ textTransform: "none", width: 150 }}
          >
            {userAuth?.email}
          </Typography>
        </Stack>
      </Button>
      <MenuPopover
        open={open}
        handleCloseMenu={handleCloseMenu}
        sx={{ width: 180 }}
      >
        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          <LogoutIcon sx={{ mr: 1 }} />
          {"Đăng xuất"}
        </MenuItem>
      </MenuPopover>
    </>
  );
}

export default AccountPopover;
