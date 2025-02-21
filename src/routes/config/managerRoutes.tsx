import { Route } from 'common/@types';
import {
  ManagerDashboard,
  UserManagementPage,
} from 'pages/Manager';
import { PATH_MANAGER_APP } from 'routes/paths';

export const manageRoutes: Route[] = [
  {
    path: PATH_MANAGER_APP.root,
    component: <ManagerDashboard />,
    index: true,
  },
  {
    path: PATH_MANAGER_APP.userManagement.list,
    component: <UserManagementPage />,
    index: true,
  },

];
