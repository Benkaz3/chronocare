import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#a5d6a7', // Light green
      main: '#66bb6a', // Main green color
      dark: '#388e3c', // Dark green
      contrastText: '#fff',
    },
    secondary: {
      light: '#c8e6c9', // Light secondary green
      main: '#81c784', // Secondary green
      dark: '#388e3c', // Dark secondary green
      contrastText: '#fff',
    },
    info: {
      light: '#b9f6ca', // Light info green
      main: '#69f0ae', // Info green
      dark: '#00e676', // Dark info green
      contrastText: '#000',
    },
    text: {
      primary: '#1b5e20', // Dark green for primary text
      secondary: '#4caf50', // Green for secondary text
      disabled: '#c8e6c9', // Light green for disabled text
    },
    action: {
      hover: '#e8f5e9', // Light green for hover actions
      disabledBackground: '#e0f2f1', // Light green for disabled backgrounds
    },
  },
  typography: {
    fontFamily: [
      'Fairdisplay',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
      'BeVietnamPro',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    h6: {
      fontWeight: 700,
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.825rem',
    },
    caption: {
      fontSize: '0.75rem',
      color: 'text.secondary',
    },
    button: {
      textTransform: 'none',
      fontSize: '1rem',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#66bb6a', // Use primary main green
          color: '#ffffff',
          textTransform: 'none',
          padding: '10px 0',
          '&:hover': {
            backgroundColor: '#388e3c', // Use primary dark green
          },
          '&:focus-visible': {
            outline: '2px solid #66bb6a',
            outlineOffset: '2px',
          },
        },
        outlined: {
          backgroundColor: '#ffffff',
          color: '#66bb6a', // Use primary main green
          textTransform: 'none',
          padding: '10px 0',
          border: '1px solid rgba(102, 187, 106, 0.7)',
          '&:hover': {
            backgroundColor: 'rgba(102, 187, 106, 0.04)',
            borderColor: 'rgba(102, 187, 106, 0.9)',
          },
          '&:focus-visible': {
            outline: '2px solid #66bb6a',
            outlineOffset: '2px',
          },
        },
        text: {
          color: '#66bb6a', // Use primary main green
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'rgba(102, 187, 106, 0.04)',
          },
          '&:focus-visible': {
            outline: '2px solid #66bb6a',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #66bb6a',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#66bb6a', // Use primary main green
          textDecoration: 'underline',
          fontSize: '0.725rem',
          '&:focus-visible': {
            outline: '2px solid #66bb6a',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: 'rgba(0, 0, 0, 0.7)',
            '&.Mui-focused': {
              color: '#000000',
            },
          },
          '& .MuiInputBase-input': {
            color: '#000000',
            '&:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 100px #ffffff inset',
              WebkitTextFillColor: '#000000',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #66bb6a',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: 0,
          margin: 0,
          height: '20px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        caption: {
          fontSize: '0.725rem',
          color: 'text.secondary',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {},
        indicator: {
          backgroundColor: '#66bb6a', // Use primary main green
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#66bb6a', // Use primary main green
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        },
        head: {
          backgroundColor: '#f5f5f5',
          fontWeight: 700,
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 240,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#333333',
          color: '#ffffff',
          fontSize: '0.875rem',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  shape: {
    borderRadius: 8,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

export default theme;
