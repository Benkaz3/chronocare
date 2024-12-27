import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Button,
} from '@mui/material';

const BloodPressureSelector: React.FC = () => {
  const [sys, setSys] = useState<number | null>(null); // Systolic value
  const [dia, setDia] = useState<number | null>(null); // Diastolic value
  const [bpm, setBpm] = useState<number | null>(null); // Beats per minute (optional)

  // Generate options
  const systolicOptions = Array.from({ length: 51 }, (_, i) => 90 + i); // SYS: 90–140
  const diastolicOptions = Array.from({ length: 41 }, (_, i) => 60 + i); // DIA: 60–100
  const bpmOptions = Array.from({ length: 101 }, (_, i) => 40 + i); // BPM: 40–140 (optional)

  // Form submit handler
  const handleSubmit = () => {
    // Validate required fields
    if (sys === null || dia === null) {
      alert('Please select both Systolic (SYS) and Diastolic (DIA) values.');
      return;
    }

    // Handle form data
    const formData = {
      systolic: sys,
      diastolic: dia,
      bpm: bpm || 'Not provided', // Optional field
    };

    console.log('Submitted Data:', formData);
    alert(
      `Submitted Data:\nSYS: ${sys}\nDIA: ${dia}\nBPM: ${bpm || 'Not provided'}`
    );
  };

  return (
    <Box>
      {/* Systolic (SYS) Input */}
      <FormControl fullWidth margin='normal'>
        <InputLabel id='sys-select-label'>Systolic (SYS)</InputLabel>
        <Select
          labelId='sys-select-label'
          value={sys}
          onChange={(e) => setSys(Number(e.target.value))}
          label='Systolic (SYS)'
        >
          {systolicOptions.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Diastolic (DIA) Input */}
      <FormControl fullWidth margin='normal'>
        <InputLabel id='dia-select-label'>Diastolic (DIA)</InputLabel>
        <Select
          labelId='dia-select-label'
          value={dia}
          onChange={(e) => setDia(Number(e.target.value))}
          label='Diastolic (DIA)'
        >
          {diastolicOptions.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* BPM (Beats per Minute) Input - Optional */}
      <FormControl fullWidth margin='normal'>
        <InputLabel id='bpm-select-label'>
          Beats per Minute (BPM) - Optional
        </InputLabel>
        <Select
          labelId='bpm-select-label'
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          label='Beats per Minute (BPM)'
        >
          {bpmOptions.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display Selected Values */}
      {(sys !== null || dia !== null || bpm !== null) && (
        <Typography style={{ marginTop: '1rem' }}>
          Selected SYS: <strong>{sys || 'Not selected'}</strong>, DIA:{' '}
          <strong>{dia || 'Not selected'}</strong>, BPM:{' '}
          <strong>{bpm || 'Not provided'}</strong>
        </Typography>
      )}

      {/* Submit Button */}
      <Box marginTop={2}>
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default BloodPressureSelector;
