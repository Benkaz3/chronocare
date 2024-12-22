import React from 'react';
import { Grid, TextField } from '@mui/material';

interface BloodPressureFormProps {
  systolic: number;
  diastolic: number;
  pulse: number;
  setSystolic: (value: number) => void;
  setDiastolic: (value: number) => void;
  setPulse: (value: number) => void;
}

const BloodPressureForm: React.FC<BloodPressureFormProps> = ({
  systolic,
  diastolic,
  pulse,
  setSystolic,
  setDiastolic,
  setPulse,
}) => (
  <Grid container spacing={2} alignItems='center' sx={{ marginTop: 3 }}>
    <Grid item xs={4}>
      <TextField
        label='Tâm thu'
        variant='outlined'
        type='number'
        value={systolic}
        onChange={(e) => setSystolic(Number(e.target.value))}
        fullWidth
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      />
    </Grid>
    <Grid item xs={4}>
      <TextField
        label='Tâm trương'
        variant='outlined'
        type='number'
        value={diastolic}
        onChange={(e) => setDiastolic(Number(e.target.value))}
        fullWidth
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      />
    </Grid>
    <Grid item xs={4}>
      <TextField
        label='Mạch'
        variant='outlined'
        type='number'
        value={pulse}
        onChange={(e) => setPulse(Number(e.target.value))}
        fullWidth
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      />
    </Grid>
  </Grid>
);

export default BloodPressureForm;
