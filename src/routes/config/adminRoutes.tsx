import { Route } from 'common/@types';
import {
  MoneyMindDashboardPage,
} from 'pages/Admin';
import { PATH_ADMIN_APP } from 'routes/paths';

export const adminRoutes: Route[] = [
  {
    path: PATH_ADMIN_APP.root,
    component: <MoneyMindDashboardPage />,
    index: true,
  },

];
