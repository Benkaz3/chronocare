// This page is currently NOT used. Here's for future use if any
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';
import { ThemeProvider } from '@mui/material/styles';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && alertRef.current) {
      alertRef.current.focus();
    }
  }, [message]);

  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (email === '') {
      setEmailError(undefined);
    } else {
      const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      setEmailError(
        emailRegex.test(email)
          ? undefined
          : 'Please enter a valid email address.'
      );
    }
  }, [email]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || emailError) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({
        type: 'success',
        text: 'Password reset email sent! Please check your inbox.',
      });
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      setMessage({
        type: 'error',
        text:
          error.code === 'auth/user-not-found'
            ? 'No user found with this email.'
            : 'Failed to send password reset email. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component='main'
        maxWidth='xs'
        sx={{
          padding: 2,
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography
            component='h1'
            variant='h5'
            sx={{
              mb: 3,
            }}
          >
            Cài lại mật khẩu
          </Typography>
          <Box
            component='form'
            sx={{ mt: 1 }}
            onSubmit={handleReset}
            noValidate
          >
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='reset-email'
              label='Email Address'
              name='email'
              type='email'
              autoComplete='email'
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={emailError ? 'email-error' : undefined}
              error={!!emailError}
              helperText={
                emailError && (
                  <span id='email-error' style={{ color: '#f44336' }}>
                    {emailError}
                  </span>
                )
              }
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              disabled={loading || !email || !!emailError}
              aria-label='Send Password Reset Email'
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </Button>
            {message && (
              <Alert
                severity={message.type}
                sx={{ mt: 2 }}
                action={
                  <IconButton
                    aria-label='close'
                    color='inherit'
                    size='small'
                    onClick={() => setMessage(null)}
                    role='button'
                  >
                    <CloseIcon fontSize='inherit' />
                  </IconButton>
                }
                role='alert'
                tabIndex={-1}
                ref={message.type === 'error' ? alertRef : null}
              >
                {message.text}
              </Alert>
            )}
            <Button
              fullWidth
              variant='text'
              onClick={() => {
                navigate('/');
              }}
              aria-label='Back to Log In'
            >
              Quay lại đăng nhập
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ResetPasswordPage;
