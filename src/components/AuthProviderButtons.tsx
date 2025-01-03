// components/AuthProviderButtons.tsx
import React from 'react';
import { Button, Stack } from '@mui/material';
import {
  Google as GoogleIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';

interface AuthProviderButtonsProps {
  onSignIn: (provider: string) => void;
  disabled: boolean;
}

const AuthProviderButtons: React.FC<AuthProviderButtonsProps> = ({
  onSignIn,
  disabled,
}) => {
  const providers = [
    { name: 'Google', icon: <GoogleIcon />, id: 'google' },
    { name: 'Twitter', icon: <TwitterIcon />, id: 'twitter' },
    // Add more providers as needed
  ];

  return (
    <Stack spacing={2}>
      {providers.map((provider) => (
        <Button
          key={provider.id}
          variant='contained'
          startIcon={provider.icon}
          onClick={() => onSignIn(provider.id)}
          disabled={disabled}
          fullWidth
          aria-label={`Sign in with ${provider.name}`}
        >
          {`Đăng nhập với ${provider.name}`}
        </Button>
      ))}
    </Stack>
  );
};

export default AuthProviderButtons;
