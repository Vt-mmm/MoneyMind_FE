// @mui icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptIcon from '@mui/icons-material/Receipt';

import { PATH_ADMIN_APP, PATH_MANAGER_APP } from 'routes/paths';

function useConfigSidebar() {
  const navAdmin = [
    {
      missions: 'Overview',
      listNav: [
        {
          title: 'Dashboard',
          path: PATH_ADMIN_APP.root,
          icon: <DashboardIcon fontSize="medium" />,
        },
      ],
    },
    {
      missions: 'Management',
      listNav: [
        {
          title: 'Users',
          path: PATH_ADMIN_APP.userManagement.list,
          icon: <PeopleIcon fontSize="medium" />,
        },
        {
          title: 'Transactions',
          path: PATH_ADMIN_APP.transaction,
          icon: <ReceiptIcon fontSize="medium" />,
        },
        {
          title: 'Tags',
          path: PATH_ADMIN_APP.tag,
          icon: <LabelIcon fontSize="medium" />,
        },
        {
          title: 'Wallet Type',
          path: PATH_ADMIN_APP.wallettype,
          icon: <AccountBalanceWalletIcon fontSize="medium" />,
        },
        {
          title: 'Icons',
          path: PATH_ADMIN_APP.icon,
          icon: <InsertEmoticonIcon fontSize="medium" />,
        },
        {
          title: 'Default Data',
          path: PATH_ADMIN_APP.datadefault,
          icon: <SettingsApplicationsIcon fontSize="medium" />,
        },
      ],
    },
  ];

  const navManager = [
    {
      missions: 'Overview',
      listNav: [
        {
          title: 'Report',
          path: PATH_MANAGER_APP.root,
          icon: <BarChartIcon fontSize="medium" />,
        },
      ],
    },
    {
      missions: 'Management',
      listNav: [
        {
          title: 'Users',
          path: PATH_MANAGER_APP.userManagement.list,
          icon: <PeopleIcon fontSize="medium" />,
        },
      ],
    },
  ];

  return { navAdmin, navManager };
}

export { useConfigSidebar };