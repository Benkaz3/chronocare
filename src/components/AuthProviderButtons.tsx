import React from 'react';
import { Button, Box } from '@mui/material';
import GoogleLogo from '../assets/google-logo.svg';
import TwitterLogo from '../assets/twitter-logo.svg';
import { GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';

interface AuthProviderButtonsProps {
  onSignIn: (
    provider: GoogleAuthProvider | TwitterAuthProvider,
    providerName: string
  ) => void;
  disabled?: boolean;
}

const AuthProviderButtons: React.FC<AuthProviderButtonsProps> = ({
  onSignIn,
  disabled = false,
}) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 0, mb: 3 }}>
    <Button
      variant='contained'
      disabled={disabled}
      sx={{
        width: '49%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        textTransform: 'none',
        padding: '10px 0',
        borderRadius: '10px 0 0 10px',
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
      }}
      onClick={() => onSignIn(new GoogleAuthProvider(), 'Google')}
      aria-label='Sign in with Google'
    >
      <img
        src={GoogleLogo}
        alt='Google logo'
        style={{ width: 20, marginRight: 8 }}
      />
      Google
    </Button>
    <Button
      variant='contained'
      disabled={disabled}
      sx={{
        width: '49%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        textTransform: 'none',
        padding: '10px 0',
        borderRadius: '0 10px 10px 0',
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
      }}
      onClick={() => onSignIn(new TwitterAuthProvider(), 'Twitter')}
      aria-label='Sign in with Twitter'
    >
      <img
        src={TwitterLogo}
        alt='Twitter logo'
        style={{ width: 20, marginRight: 8 }}
      />
      Twitter
    </Button>
  </Box>
);

export default AuthProviderButtons;
