// src/components/StatusCircle.tsx

import React from 'react';
import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

interface StatusCircleProps {
  bgcolor: string;
  children: React.ReactNode;
}

const StyledAvatar = styled(Avatar)<{ bgcolor: string }>(({ bgcolor }) => ({
  backgroundColor: bgcolor,
  width: 60,
  height: 60,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.8rem',
}));

const StatusCircle: React.FC<StatusCircleProps> = ({ bgcolor, children }) => {
  return <StyledAvatar bgcolor={bgcolor}>{children}</StyledAvatar>;
};

export default React.memo(StatusCircle);
