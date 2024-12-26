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
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
    <Button
      variant='contained'
      disabled={disabled}
      onClick={() => onSignIn(new GoogleAuthProvider(), 'Google')}
      aria-label='Sign in with Google'
      sx={{
        width: '49%',
      }}
    >
      <img
        src={GoogleLogo}
        alt=''
        style={{ width: 20, marginRight: 8 }}
        aria-hidden='true'
      />
      Google
    </Button>
    <Button
      variant='contained'
      disabled={disabled}
      onClick={() => onSignIn(new TwitterAuthProvider(), 'Twitter')}
      aria-label='Sign in with Twitter'
      sx={{
        width: '49%',
      }}
    >
      <img
        src={TwitterLogo}
        alt=''
        style={{ width: 20, marginRight: 8 }}
        aria-hidden='true'
      />
      Twitter
    </Button>
  </Box>
);

export default AuthProviderButtons;
