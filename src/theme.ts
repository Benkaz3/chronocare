// src/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Set the theme to light mode
    primary: {
      main: '#1976d2', // Default primary color for light theme
    },
    secondary: {
      main: '#dc004e', // Secondary color for accents
    },
    success: {
      main: '#4caf50', // For success states
    },
    warning: {
      main: '#ff9800', // For warning states
    },
    error: {
      main: '#f44336', // For error states
    },
    info: {
      main: '#2196f3', // For informational messages
    },
    background: {
      default: '#f5f5f5', // Light background
      paper: '#ffffff', // Light paper background
    },
    text: {
      primary: '#000000', // Dark text for light theme
      secondary: 'rgba(0, 0, 0, 0.7)',
    },
    chart: {
      bloodPressure: {
        systolic: '#ff5722', // Color for systolic charts
        diastolic: '#03a9f4', // Color for diastolic charts
      },
      bloodSugar: {
        fasting: '#8bc34a', // Color for fasting blood sugar
        postPrandial: '#ffeb3b', // Color for post-prandial blood sugar
      },
    },
  },
  typography: {
    fontFamily: [
      'Fairdisplay',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
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
  spacing: 8, // Default spacing unit (can be used as spacing(2) => 16px)
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#1976d2',
          color: '#ffffff',
          textTransform: 'none',
          padding: '10px 0',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
          '&:focus-visible': {
            outline: '2px solid #1976d2',
            outlineOffset: '2px',
          },
        },
        outlined: {
          backgroundColor: '#ffffff',
          color: '#1976d2',
          textTransform: 'none',
          padding: '10px 0',
          border: '1px solid rgba(25, 118, 210, 0.7)',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            borderColor: 'rgba(25, 118, 210, 0.9)',
          },
          '&:focus-visible': {
            outline: '2px solid #1976d2',
            outlineOffset: '2px',
          },
        },
        text: {
          color: '#1976d2',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
          '&:focus-visible': {
            outline: '2px solid #1976d2',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #1976d2',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#1976d2',
          textDecoration: 'underline',
          fontSize: '0.725rem',
          '&:focus-visible': {
            outline: '2px solid #1976d2',
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
            outline: '2px solid #1976d2',
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
          backgroundColor: '#1976d2',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#1976d2',
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
    borderRadius: 8, // Default border radius for components
  },
  transitions: {
    // Customize transition durations and easing if needed
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
