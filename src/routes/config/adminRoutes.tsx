import { Route } from 'common/@types';
import {
  MoneyMindDashboardPage,
  UserManagementPage,
} from 'pages/Admin';
import { PATH_ADMIN_APP } from 'routes/paths';

export const adminRoutes: Route[] = [
  {
    path: PATH_ADMIN_APP.root,
    component: <MoneyMindDashboardPage />,
    index: true,
  },
  {
    path: PATH_ADMIN_APP.userManagement.list,
    component: <UserManagementPage />,
    index: true,
  },

];
