// @mui
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { MenuItem, Popover as MUIPopover, SxProps } from '@mui/material';
import { PopoverType } from 'common/enums';

interface PopoverProps {
  sx?: SxProps;
  type?: PopoverType;
  open: HTMLButtonElement | null;
  handleCloseMenu: () => void;
  onEdit?: () => void;
  onDelete?: (title: any) => void;
}

function Popover({ type = PopoverType.ALL, open, handleCloseMenu, onEdit, onDelete, sx, ...other }: PopoverProps) {

  return (
    <>
      <MUIPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            mt: 0.5,
            width: 140,
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
        {type === PopoverType.ALL ? (
          <>
            <MenuItem
              onClick={() => {
                onEdit && onEdit();
                handleCloseMenu();
              }}
            >
              <EditRoundedIcon fontSize="small" sx={{ mr: 2 }} />
              {('button.edit')}
            </MenuItem>

            <MenuItem
              sx={{ color: 'error.main' }}
              onClick={() => {
                onDelete && onDelete('delete');
                handleCloseMenu();
              }}
            >
              <DeleteRoundedIcon fontSize="small" sx={{ mr: 2 }} />
              {('button.delete')}
            </MenuItem>
          </>
        ) : type === PopoverType.EDIT ? (
          <MenuItem
            onClick={() => {
              onEdit && onEdit();
              handleCloseMenu();
            }}
          >
            <EditRoundedIcon fontSize="small" sx={{ mr: 2 }} />
            {('button.edit')}
          </MenuItem>
        ) : (
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              onDelete && onDelete('delete');
              handleCloseMenu();
            }}
          >
            <DeleteRoundedIcon fontSize="small" sx={{ mr: 2 }} />
            {('button.delete')}
          </MenuItem>
        )}
      </MUIPopover>
    </>
  );
}

export default Popover;
