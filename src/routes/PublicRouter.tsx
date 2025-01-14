import { Role } from "common/enums";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "redux/config";
import { getAccessToken } from "utils";
import { PATH_AUTH, PATH_ADMIN_APP,PATH_MANAGER_APP } from "./paths";

export default function PublicRouter() {
  const accessToken = getAccessToken();

  const { isAuthenticated, userAuth } = useAppSelector((state) => state.auth);

  const navigateRouter = userAuth?.roles?.includes(Role.MONEYMIND_ADMIN)
    ? PATH_ADMIN_APP.root
    : userAuth?.roles?.includes(Role.MONEYMIND_MANAGER)
    ? PATH_MANAGER_APP.root
    : PATH_AUTH.login;

  return isAuthenticated && accessToken ? (
    <Navigate to={navigateRouter} />
  ) : (
    <Outlet />
  );
}
