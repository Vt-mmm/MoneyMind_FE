// @mui icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';

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
          path: PATH_ADMIN_APP.root,
          icon: <AssessmentIcon fontSize="medium" />,
        },
      
        {
          title: 'Ngân hàng',
          path: PATH_ADMIN_APP.root,
          icon: <AssessmentIcon fontSize="medium" />,
        },

        {
          title: 'Chi Tiêu',
          path: PATH_ADMIN_APP.root,
          icon: <AssessmentIcon fontSize="medium" />,
        },
      ]
    },

    // {
    //   missions: 'Configurations',
    //   listNav: [
    //     {
    //       title: 'System Configurations',
    //       path: PATH_ADMIN_APP.configurations,
    //       icon: <SettingsTwoToneIcon fontSize="medium" />,
    //     },
    //   ],
    // },
  ];

  return { navAdmin };
}

export { useConfigSidebar };
