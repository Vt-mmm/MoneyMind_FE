import { Route } from 'common/@types';
import {
  MoneyMindDashboardPage,
  UserManagementPage,
  ManageIconPage,
  ManageTagPage,
  ManageWalletTypePage,
  ManageDataDefault,
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
  {
    path: PATH_ADMIN_APP.icon,
    component: <ManageIconPage />,
    index: true,
  },
  {
    path: PATH_ADMIN_APP.tag,
    component: <ManageTagPage />,
    index: true,
  },
  {
    path: PATH_ADMIN_APP.wallettype,
    component: <ManageWalletTypePage />,
    index: true,
  },
  {
    path: PATH_ADMIN_APP.datadefault,
    component: <ManageDataDefault />,
    index: true,
  },
];
