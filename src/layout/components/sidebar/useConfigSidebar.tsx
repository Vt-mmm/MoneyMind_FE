// @mui icons
import AssessmentIcon from '@mui/icons-material/Assessment';

import { PATH_ADMIN_APP } from 'routes/paths';

function useConfigSidebar() {
  const navAdmin = [
    {
      missions: 'Tổng Quan',
      listNav: [
        {
          title: 'Dashboard',
          path: PATH_ADMIN_APP.root,
          icon: <AssessmentIcon fontSize="medium" />,
        },
      ],
    },
    {
      missions: 'Quản Lý',
      listNav: [
        {
          title: 'Người dùng',
          path: PATH_ADMIN_APP.userManagement.list,
          icon: <AssessmentIcon fontSize="medium" />,
        },
        {
          title: 'Tags',
          path: PATH_ADMIN_APP.tag,
          icon: <AssessmentIcon fontSize="medium" />,
        },
        {
          title: 'WalletType',
          path: PATH_ADMIN_APP.wallettype,
          icon: <AssessmentIcon fontSize="medium" />,
        },
        {
          title: 'Icons',
          path: PATH_ADMIN_APP.icon,
          icon: <AssessmentIcon fontSize="medium" />,
        },
        {
          title: 'DataDefault',
          path: PATH_ADMIN_APP.datadefault,
          icon: <AssessmentIcon fontSize="medium" />,
        },
      ]
    },
  ];

  return { navAdmin };
}

export { useConfigSidebar };
