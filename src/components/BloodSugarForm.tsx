// src/components/BloodSugarForm.tsx

import React from 'react';
import { Box, Button } from '@mui/material';
import { useHealthData } from '../context/HealthDataContext';
import NumberAutocomplete from './NumberAutocomplete';
import FormAlert from './FormAlert';
import { getBloodSugarCategory } from '../data/bloodSugar';
import LastReading from './LastReading'; // Import LastReading component

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
  const { addBloodSugarReading, loading, bloodSugar } = useHealthData(); // Include bloodSugar from context

  const handleBSChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    const value = newValue || '';
    setInputBS({ level: value });
    setSuccessMessage('');
    if (errors.bs) {
      setErrors((prev) => ({ ...prev, bs: '' }));
    }
  };

  const handleBSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const level = parseFloat(inputBS.level);

    const category = getBloodSugarCategory(level);
    if (category === 'Invalid') {
      setErrors({
        bs: 'Vui lòng nhập chỉ số đường huyết hợp lệ.',
      });
      setSuccessMessage('');
      return;
    }

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
          placeholder='VD: 90'
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

      <LastReading reading={bloodSugar} type='bloodSugar' />
    </form>
  );
};

export default BloodSugarForm;
