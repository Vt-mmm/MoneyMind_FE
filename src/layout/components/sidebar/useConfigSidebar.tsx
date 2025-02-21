// @mui icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import BarChartIcon from '@mui/icons-material/BarChart';

import { PATH_ADMIN_APP, PATH_MANAGER_APP } from 'routes/paths';

function useConfigSidebar() {
  const navAdmin = [
    {
      missions: 'Tổng Quan',
      listNav: [
        {
          title: 'Dashboard',
          path: PATH_ADMIN_APP.root,
          icon: <DashboardIcon fontSize="medium" />,
        },
      ],
    },
    {
      missions: 'Quản Lý',
      listNav: [
        {
          title: 'Người dùng',
          path: PATH_ADMIN_APP.userManagement.list,
          icon: <PeopleIcon fontSize="medium" />,
        },
        {
          title: 'Tags',
          path: PATH_ADMIN_APP.tag,
          icon: <LabelIcon fontSize="medium" />,
        },
        {
          title: 'WalletType',
          path: PATH_ADMIN_APP.wallettype,
          icon: <AccountBalanceWalletIcon fontSize="medium" />,
        },
        {
          title: 'Icons',
          path: PATH_ADMIN_APP.icon,
          icon: <InsertEmoticonIcon fontSize="medium" />,
        },
        {
          title: 'DataDefault',
          path: PATH_ADMIN_APP.datadefault,
          icon: <SettingsApplicationsIcon fontSize="medium" />,
        },
      ]
    },
  ];
  const navManager = [
    {
      missions: 'Tổng Quan',
      listNav: [
        {
          title: 'Report',
          path: PATH_MANAGER_APP.root,
          icon: <BarChartIcon fontSize="medium" />,
        },
      ],
    },
    {
      missions: 'Quản Lý',
      listNav: [
        {
          title: 'Người dùng',
          path: PATH_MANAGER_APP.userManagement.list,
          icon: <PeopleIcon fontSize="medium" />,
        },
       
      ]
    },

  ];

  return { navAdmin, navManager };
}

export { useConfigSidebar };
