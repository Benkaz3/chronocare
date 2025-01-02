// src/components/NumberAutocomplete.tsx

import React from 'react';
import { Autocomplete } from '@mui/material';
import { Box, Typography, TextField } from '@mui/material';

interface NumberAutocompleteProps {
  label: string;
  unit: string;
  value: string;
  options: string[];
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => void;
  min: number;
  max: number;
  error?: boolean;
  'aria-label': string;
  width: number | string;
}

const NumberAutocomplete: React.FC<NumberAutocompleteProps> = ({
  label,
  unit,
  value,
  options,
  onChange,
  min,
  max,
  error = false,
  'aria-label': ariaLabel,
  width,
}) => (
  <Autocomplete
    freeSolo
    options={options}
    value={value}
    disableClearable
    onInputChange={onChange}
    renderInput={(params) => (
      <Box sx={{ textAlign: 'center', width }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.3,
          }}
        >
          <Typography variant='body1' component='label' htmlFor={params.id}>
            {label}
          </Typography>
          <Typography variant='caption'>{unit}</Typography>
        </Box>
        <TextField
          {...params}
          variant='outlined'
          required
          type='number'
          inputProps={{
            ...params.inputProps,
            min,
            max,
            style: { textAlign: 'center' },
            'aria-label': ariaLabel,
          }}
          error={error}
          aria-invalid={error}
        />
      </Box>
    )}
  />
);

export default NumberAutocomplete;
