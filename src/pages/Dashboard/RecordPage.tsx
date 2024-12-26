import React from 'react';
import { Paper, Typography } from '@mui/material';
import RecordForm from '../../components/RecordForm';

const RecordPage: React.FC = () => (
  <Paper elevation={3} sx={{ padding: 2 }}>
    <Typography variant='h5' gutterBottom>
      Thêm chỉ số mới
    </Typography>
    <RecordForm />
  </Paper>
);

export default RecordPage;
