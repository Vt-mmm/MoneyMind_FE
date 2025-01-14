import { Navigate, Route, Routes } from "react-router-dom";
//layout
import DashboardLayout from "layout/dashboard/DashboardLayout";
import SimpleLayout from "layout/simple/SimpleLayout";

//router
import AdminRouter from "./adminRouter";
import ManagerRouter from "./manageRouter";

//routes
import { Role } from "common/enums";
import { useAppSelector } from "redux/config";
import PublicRouter from "./PublicRouter";
import { errorRoutes, publicRoutes, adminRoutes, manageRoutes } from "./config";
import { PATH_ADMIN_APP, PATH_AUTH, PATH_ERROR, PATH_MANAGER_APP } from "./paths";

function AppRouter() {
  const { userAuth, isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRouter />}>
        {/* Chỉ điều hướng đến login nếu người dùng chưa đăng nhập */}
        <Route
          element={
            isAuthenticated ? (
              <Navigate to={PATH_ADMIN_APP.root} />
            ) : (
              <Navigate to={PATH_AUTH.login} />
            )
          }
          index={true}
        />

        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Route>
      <Route element={<SimpleLayout />}>
        {userAuth?.roles?.includes(Role.MONEYMIND_ADMIN) ? (
          <Route element={<Navigate to={PATH_ADMIN_APP.root} />} />
        ) : (
          <></>
        )}
        <Route path="*" element={<Navigate to={PATH_ERROR.notFound} />} />
        {errorRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Route>

      <Route path="*" element={<Navigate to={PATH_ERROR.notFound} replace />} />

      {/* brand routes */}
      <Route element={<ManagerRouter />}>
        <Route element={<DashboardLayout />}>
          <Route element={<Navigate to={PATH_MANAGER_APP.root} />} index={true} />
          {manageRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.component} />
          ))}
        </Route>
      </Route>
      {/* MBKC admin routes */}
      <Route path="/" element={<AdminRouter />}>
        <Route element={<DashboardLayout />}>
          <Route element={<Navigate to={PATH_ADMIN_APP.root} />} index={true} />
          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;
