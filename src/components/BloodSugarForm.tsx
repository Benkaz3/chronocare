// src/components/BloodSugarForm.tsx

import React from 'react';
import { Box, Button } from '@mui/material';
import { useHealthData } from '../context/HealthDataContext';
import NumberAutocomplete from './NumberAutocomplete';
import FormAlert from './FormAlert';
import { getBloodSugarCategory } from '../data/bloodSugar';

interface BloodSugarFormProps {
  inputBS: {
    level: string;
  };
  setInputBS: React.Dispatch<React.SetStateAction<{ level: string }>>;
  bloodSugarOptions: string[];
  isMobile: boolean;
  errors: {
    bs: string;
  };
  setErrors: React.Dispatch<
    React.SetStateAction<{
      bs: string;
    }>
  >;
  successMessage: string;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

const BloodSugarForm: React.FC<BloodSugarFormProps> = ({
  inputBS,
  setInputBS,
  bloodSugarOptions,
  isMobile,
  errors,
  setErrors,
  successMessage,
  setSuccessMessage,
}) => {
  const { addBloodSugarReading, loading } = useHealthData();

  // Handle Input Changes
  const handleBSChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    const value = newValue || '';
    setInputBS({ level: value });
    // Reset success message and BS error on input change
    setSuccessMessage('');
    if (errors.bs) {
      setErrors((prev) => ({ ...prev, bs: '' }));
    }
  };

  // Submit BS Form
  const handleBSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse input
    const level = parseFloat(inputBS.level);

    // Validate input using context's status info
    const category = getBloodSugarCategory(level);
    if (category === 'Invalid') {
      setErrors({
        bs: 'Vui lòng nhập chỉ số đường huyết hợp lệ.',
      });
      setSuccessMessage('');
      return;
    }

    // If valid, create data object
    const bsData = {
      level,
      time: new Date().toISOString(),
    };

    try {
      await addBloodSugarReading(bsData);
      setErrors({ bs: '' });
      setSuccessMessage('Gửi thành công.');
    } catch (err) {
      setErrors({ bs: 'Gửi không thành công.' });
      setSuccessMessage('');
    }
  };

  return (
    <form onSubmit={handleBSSubmit}>
      {/* Blood Sugar Level Input */}
      <Box
        sx={{
          gap: isMobile ? 0.5 : 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 2,
          flexWrap: 'wrap',
        }}
      >
        <NumberAutocomplete
          label='Đ.Huyết'
          unit='mg/dL'
          value={inputBS.level}
          options={bloodSugarOptions}
          onChange={handleBSChange}
          min={50}
          max={500}
          error={!!errors.bs}
          aria-label='Blood Sugar Level in mg/dL'
          width={85}
        />
      </Box>

      <Button
        type='submit'
        variant='contained'
        color='primary'
        fullWidth
        sx={{
          mt: 3,
          height: 48,
          borderRadius: 8,
          fontSize: isMobile ? '1rem' : '1.125rem',
        }}
        disabled={loading}
        aria-label='Submit Blood Sugar Reading'
      >
        {loading ? 'Đang gửi...' : 'THÊM'}
      </Button>

      <FormAlert successMessage={successMessage} errorMessage={errors.bs} />
    </form>
  );
};

export default BloodSugarForm;
