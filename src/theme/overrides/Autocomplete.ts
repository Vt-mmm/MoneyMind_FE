import { customShadows } from 'theme/customShadows';

// ----------------------------------------------------------------------

export default function Autocomplete(theme: any) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: customShadows.z20,
        },
      },
    },
  };
}
