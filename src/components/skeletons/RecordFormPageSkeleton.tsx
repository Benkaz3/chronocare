// src/components/skeletons/HomePageSkeleton.tsx
import React from 'react';
import { Skeleton, Box, Grid } from '@mui/material';

const RecordFormPageSkeleton: React.FC = () => {
  return (
    <Box sx={{ padding: 2 }}>
      {/* Tabs/Header */}
      <Skeleton
        variant='text'
        width='60%'
        height={30}
        sx={{ marginBottom: 2 }}
      />

      {/* Colored Bar with Heart Icon */}
      <Skeleton
        variant='rectangular'
        width='100%'
        height={20}
        sx={{ marginBottom: 2 }}
      />

      {/* Status Card */}
      <Skeleton
        variant='rectangular'
        width='100%'
        height={60}
        sx={{ marginBottom: 2 }}
      />

      {/* Input Fields */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={4}>
          <Skeleton variant='rectangular' width='100%' height={40} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant='rectangular' width='100%' height={40} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant='rectangular' width='100%' height={40} />
        </Grid>
      </Grid>

      {/* Add Button */}
      <Skeleton variant='rectangular' width='100%' height={50} />
    </Box>
  );
};

export default RecordFormPageSkeleton;
