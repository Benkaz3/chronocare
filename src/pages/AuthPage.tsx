// src/pages/AuthPage.tsx
import React from 'react';
import {
  CssBaseline,
  Box,
  Typography,
  Container,
  Divider,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import AuthProviderButtons from '../components/AuthProviderButtons';
import useAuth from '../hooks/useAuth';
import theme from '../theme';

const AuthPage: React.FC = () => {
  // Use custom hook for authentication
  const {
    message, // message is now AuthMessage | null
    loading,
    signInWithProvider,
    resetAuthMessage,
  } = useAuth();

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
            variant='h2'
            sx={{
              mb: 3,
              textAlign: 'left',
              fontFamily: 'Fairdisplay',
            }}
            tabIndex={0}
          >
            ChronoCare
          </Typography>

          {/* Conditionally render Alert if message exists */}
          {message && (
            <Alert
              severity={message.type}
              onClose={resetAuthMessage}
              sx={{ mb: 2 }}
            >
              {message.text}
            </Alert>
          )}

          <Typography
            variant='body2'
            sx={{
              mb: 2,
              textAlign: 'left',
            }}
          >
            Đăng nhập nhanh với
          </Typography>

          <AuthProviderButtons
            onSignIn={signInWithProvider}
            disabled={loading}
          />

          <Divider sx={{ borderColor: '#bfbfbf', my: 3 }} />

          <Typography
            variant='body2'
            sx={{
              color: theme.palette.text.secondary,
              mt: 2,
              fontSize: '0.8rem',
              textAlign: 'center',
            }}
          >
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <MuiLink
              href='/terms-privacy-policy'
              aria-label='Terms of Service and Privacy Policy'
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'underline',
                fontWeight: 'bold',
              }}
            >
              điều khoản dịch vụ
            </MuiLink>{' '}
            và{' '}
            <MuiLink
              href='/terms-privacy-policy'
              aria-label='Terms of Service and Privacy Policy'
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'underline',
                fontWeight: 'bold',
              }}
            >
              chính sách bảo mật
            </MuiLink>{' '}
            của chúng tôi.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AuthPage;
