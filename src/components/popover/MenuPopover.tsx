// material
import { Popover, SxProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { ReactNode } from 'react';

// ----------------------------------------------------------------------

const ArrowStyle = styled('span')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    top: -7,
    zIndex: 1,
    width: 12,
    right: 20,
    height: 12,
    content: "''",
    position: 'absolute',
    borderRadius: '0 0 4px 0',
    transform: 'rotate(-135deg)',
    background: theme.palette.background.paper,
    borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
  },
}));

// ----------------------------------------------------------------------

interface MenuPopoverProps {
  sx?: SxProps;
  children: ReactNode;
  open: HTMLElement | null;
  handleCloseMenu: () => void;
}

export default function MenuPopover({ open, handleCloseMenu, children, sx, ...other }: MenuPopoverProps) {
  return (
    <Popover
      open={Boolean(open)}
      anchorEl={open}
      onClose={handleCloseMenu}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          p: 1,
          mt: 1.5,
          ml: 0.75,
          width: 120,
          overflow: 'inherit',
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
          ...sx,
        },
      }}
      {...other}
    >
      <ArrowStyle />

      {children}
    </Popover>
  );
}
