// src/pages/AuthPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CssBaseline,
  Box,
  Typography,
  Container,
  Link,
  Tabs,
  Tab,
  Divider,
  Fade,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthProviderButtons from '../components/AuthProviderButtons';
import AuthForm from '../components/AuthForm';
import useAuth from '../hooks/useAuth'; // Import the custom hook

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(255, 255, 255, 0.7)',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
});

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tab, setTab] = useState(0);
  const [fade, setFade] = useState(true);

  // Utilize the custom hook
  const {
    message,
    setMessage,
    loading,
    signInWithProvider,
    signUpWithEmail,
    signInWithEmail,
    resetAuthMessage,
  } = useAuth();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setFade(false);
    setTimeout(() => {
      setTab(newValue);
      setFade(true);
      resetAuthMessage();
    }, 300); // Duration should match the Fade timeout
  };

  const handleSubmit = () => {
    if (tab === 0) {
      signInWithEmail(email, password);
    } else {
      signUpWithEmail(email, password);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component='main'
        maxWidth='xs'
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: theme.palette.background.paper,
            padding: 4,
            textAlign: 'center',
          }}
        >
          <Typography
            variant='h4'
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              mb: 3,
              fontFamily: 'Fairdisplay',
              textAlign: 'left',
            }}
          >
            ChronoCare
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: theme.palette.text.secondary,
              mb: 1,
              textAlign: 'left',
            }}
          >
            Quick sign in with Google or Twitter
          </Typography>
          <AuthProviderButtons
            onSignIn={signInWithProvider}
            disabled={loading}
          />
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.5)', mb: 3 }} />
          {/* Tabs for switching between Log In and Sign Up */}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{ mb: 3 }}
            centered
            textColor='primary'
            indicatorColor='primary'
            aria-label='Authentication Tabs'
          >
            <Tab label='Log In' id='tab-0' aria-controls='tabpanel-0' />
            <Tab label='Sign Up' id='tab-1' aria-controls='tabpanel-1' />
          </Tabs>
          {/* Transition Animation */}
          <Fade in={fade} timeout={300}>
            <Box>
              <AuthForm
                tab={tab}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                onSubmit={handleSubmit}
                message={message}
                onCloseMessage={resetAuthMessage}
                loading={loading}
              />
              <Typography
                variant='body2'
                sx={{
                  color: theme.palette.text.secondary,
                  mt: 2,
                  fontSize: '0.725rem',
                  textAlign: 'center',
                }}
              >
                By signing up you agree to our{' '}
                <Link
                  href='/terms-and-conditions'
                  sx={{
                    color: 'inherit',
                    textDecoration: 'underline',
                    fontSize: '0.725rem',
                  }}
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href='/privacy-policy'
                  sx={{
                    color: 'inherit',
                    textDecoration: 'underline',
                    fontSize: '0.725rem',
                  }}
                >
                  Privacy Policy
                </Link>
                .
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AuthPage;
