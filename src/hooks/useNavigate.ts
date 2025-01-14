import { Role } from "common/enums";
import { useNavigate as useNavigateRouter } from "react-router-dom";
import { useAppSelector } from "redux/config";
import { PATH_ADMIN_APP, PATH_AUTH } from "routes/paths";

function useNavigate() {
  const navigate = useNavigateRouter();
  const { userAuth, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleNavigateDashboard = () => {
    if (isAuthenticated) {
      if (userAuth?.roles?.includes(Role.MONEYMIND_ADMIN)) {
        navigate(PATH_ADMIN_APP.root);
      } else {
        navigate(PATH_AUTH.login);
      }
    }
  };

  return { navigate, handleNavigateDashboard };
}

export default useNavigate;
