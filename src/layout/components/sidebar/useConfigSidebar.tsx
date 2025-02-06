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
      
      ]
    },
  ];

  return { navAdmin };
}

export { useConfigSidebar };
