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
import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase';
import AuthProviderButtons from '../components/AuthProviderButtons';
import AuthForm from '../components/AuthForm';

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
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: React.ReactNode;
  } | null>(null);
  const [tab, setTab] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuthProviderSignIn = async (
    provider: GoogleAuthProvider | TwitterAuthProvider,
    providerName: string
  ) => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(`Error signing in with ${providerName}:`, err);
      setMessage({
        type: 'error',
        text: `Cannot sign in with ${providerName}. Please try again later.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (!email || !password || (tab === 1 && !confirmPassword)) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    if (tab === 1 && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage({
        type: 'success',
        text: 'Registration successful! Redirecting to dashboard...',
      });
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      setMessage({
        type: 'error',
        text: 'Please enter your email and password.',
      });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (err: any) => {
    console.error('Error:', err);
    if (err.code === 'auth/email-already-in-use') {
      setMessage({
        type: 'error',
        text: (
          <>
            Email is already in use. Please{' '}
            <Link
              component='button'
              variant='body2'
              onClick={() => setTab(0)}
              sx={{ color: 'inherit', textDecoration: 'underline' }}
            >
              log in
            </Link>
            .
          </>
        ),
      });
    } else if (err.code === 'auth/invalid-email') {
      setMessage({ type: 'error', text: 'Invalid email address.' });
    } else if (err.code === 'auth/weak-password') {
      setMessage({
        type: 'error',
        text: 'Password is too weak. Please choose a stronger password.',
      });
    } else if (err.code === 'auth/user-not-found') {
      setMessage({
        type: 'error',
        text: 'No user found with this email.',
      });
    } else if (err.code === 'auth/wrong-password') {
      setMessage({
        type: 'error',
        text: 'Incorrect password.',
      });
    } else {
      setMessage({
        type: 'error',
        text: 'Authentication failed. Please try again.',
      });
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setFade(false);
    setTimeout(() => {
      setTab(newValue);
      setFade(true);
      setMessage(null);
    }, 300); // Duration should match the Fade timeout
  };

  const handleSubmit = () => {
    if (tab === 0) {
      handleEmailSignIn();
    } else {
      handleEmailSignUp();
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
            onSignIn={handleAuthProviderSignIn}
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
                onCloseMessage={handleCloseMessage}
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
