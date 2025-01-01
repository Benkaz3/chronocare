// src/components/skeletons/StatusCardSkeleton.tsx
import React from 'react';
import { Skeleton, Box } from '@mui/material';

const StatusCardSkeleton: React.FC = () => {
  return (
    <Box sx={{ minHeight: '150px', mt: 0 }}>
      <Skeleton variant='rectangular' width='100%' height={150} />
    </Box>
  );
};

export default StatusCardSkeleton;
