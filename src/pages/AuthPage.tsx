// src/pages/AuthPage.tsx

import React, { useState, useRef } from 'react';
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
import { ThemeProvider } from '@mui/material/styles';
import AuthProviderButtons from '../components/AuthProviderButtons';
import AuthForm from '../components/AuthForm';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import theme from '../theme';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState(0);
  const [fade, setFade] = useState(true);

  // Utilize the custom hook
  const {
    message,
    loading,
    signInWithProvider,
    signUpWithEmail,
    signInWithEmail,
    resetAuthMessage,
  } = useAuth();

  // Reference to the tab panel for focus management
  const tabPanelRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setFade(false);
    setTimeout(() => {
      setTab(newValue);
      setFade(true);
      resetAuthMessage();
      // Reset form fields and errors when switching tabs
      setEmail('');
      setPassword('');
      // Shift focus to the tab panel
      tabPanelRef.current?.focus();
    }, 300); // Duration should match the Fade timeout
  };

  const handleSubmit = () => {
    if (loading) return; // Prevent multiple submissions
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
          component='div'
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
              mb: 3,
              textAlign: 'left',
            }}
            tabIndex={0}
          >
            ChronoCare
          </Typography>
          <Typography
            variant='body2'
            sx={{
              mb: 1,
              textAlign: 'left',
            }}
          >
            Đăng nhập hoả tốc với
          </Typography>
          <AuthProviderButtons
            onSignIn={signInWithProvider}
            disabled={loading}
          />
          <Divider sx={{ borderColor: '#bfbfbf', mb: 3 }} />
          {/* Tabs for switching between Log In and Sign Up */}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{ mb: 3 }}
            centered
            textColor='primary'
            indicatorColor='primary'
            aria-label='Authentication Tabs'
            role='tablist'
          >
            <Tab
              label='Đăng nhập'
              id='tab-0'
              aria-controls='tabpanel-0'
              aria-selected={tab === 0}
              role='tab'
            />
            <Tab
              label='Đăng ký'
              id='tab-1'
              aria-controls='tabpanel-1'
              aria-selected={tab === 1}
              role='tab'
            />
          </Tabs>
          {/* Transition Animation */}
          <Fade in={fade} timeout={300}>
            <Box
              component='div'
              role='tabpanel'
              id={`tabpanel-${tab}`}
              aria-labelledby={`tab-${tab}`}
              tabIndex={-1}
              ref={tabPanelRef}
            >
              <AuthForm
                tab={tab}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
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
                Bằng việc đăng ký, bạn đồng ý với{' '}
                <Link
                  href='/terms-and-conditions'
                  aria-label='Terms of Service'
                >
                  điều khoản dịch vụ
                </Link>{' '}
                và{' '}
                <Link href='/privacy-policy' aria-label='Privacy Policy'>
                  chính sách bảo mật
                </Link>{' '}
                của chúng tôi.
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AuthPage;
