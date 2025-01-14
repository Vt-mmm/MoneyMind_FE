import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link } from '@mui/material';
// redux
import { useAppSelector } from 'redux/config';
//
import images from 'assets';
import { Role } from 'common/enums';
import { PATH_ADMIN_APP,  } from 'routes/paths';

// ----------------------------------------------------------------------

export interface LogoProps {
  sx?: object;
  disabledLink?: boolean;
}

const Logo = forwardRef(({ disabledLink = false, sx, ...other }: LogoProps, ref) => {
  const { userAuth } = useAppSelector((state) => state.auth);

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        display: 'inline-flex',
        color: (theme) => theme.palette.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        ...sx,
      }}
      {...other}
    >
      <Box component="img" alt="logo" src={images.logo.logo_moneymind_no_bg} sx={{ width: 150, height: 150 }} />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link
      to={
        userAuth?.roles?.includes(Role.MONEYMIND_MANAGER)
        ? PATH_ADMIN_APP.root
         
          : PATH_ADMIN_APP.root
      }
      component={RouterLink}
      sx={{ display: 'contents' }}
    >
      {logo}
    </Link>
  );
});

export default Logo;
