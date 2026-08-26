import { extendTheme } from '@mui/material/styles';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#aa3bff',
        },
        divider: '#e5e4e7',
        background: {
          default: '#ffffff',
          paper: '#ffffff',
        },
        text: {
          secondary: '#6b6375',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#d4b0ff',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      },
    },
  },
  typography: {
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { textRendering: 'optimizeLegibility' },
        '#root': { minHeight: '100vh' },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },
  },
});

export default theme;
