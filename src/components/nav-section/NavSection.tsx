import { useLocation, useNavigate } from "react-router-dom";
// @mui
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// redux
import { useAppDispatch } from "redux/config";
import { setStatus } from "redux/auth/authSlice";
//
import { NavItem as NavItemInterface } from "common/@types";
import { Breadcrumb } from "common/enums";
import { StorageKeys } from "constants/storageKeys";
import { removeLocalStorage } from "utils";

const StyledNavItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

interface NavItemProps {
  item: NavItemInterface;
}

function NavItem({ item }: NavItemProps) {
  const { title, path, icon } = item;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { pathname: location } = useLocation();

  const pathItems = path.split("/").filter((x) => x);
  const locationItems = location.split("/").filter((x) => x);

  const pathModel = pathItems[1] === Breadcrumb.BRANDS ? Breadcrumb.BRAND : "";
  const active =
    locationItems[1] === pathModel || locationItems[1] === pathItems[1];

  return (
<ListItemButton
  disableGutters
  sx={(theme) => ({
    ...theme.typography.body2,
    height: 48,
    borderRadius: "6px",
    position: "relative",
    textTransform: "capitalize",
    color: active ? "#FFFFFF" : "#FFFFFF", // Màu trắng khi không active
    fontWeight: active
      ? theme.typography.fontWeightBold
      : theme.typography.fontWeightLight,
      bgcolor: active ? "rgba(0, 128, 0, 0.1)" : "#E8F5E9", // Màu hover khi active và khi không active
    "&:hover": {
      bgcolor: "#13A671", // Màu khi hover
      color: "#FFFFFF", // Màu chữ khi hover
    },
  })}
  onClick={() => {
    navigate(path);
    dispatch(setStatus());
    removeLocalStorage(StorageKeys.PAGE);
    removeLocalStorage(StorageKeys.ROW_PER_PAGE);
  }}
>
  <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
  <ListItemText disableTypography primary={title} />
</ListItemButton>
  );
}

interface NavSectionProps {
  data: NavItemInterface[];
}

function NavSection({ data = [], ...other }: NavSectionProps) {
  return (
    <Box {...other}>
      <Stack spacing={1}>
        {data.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </Stack>
    </Box>
  );
}

export default NavSection;
