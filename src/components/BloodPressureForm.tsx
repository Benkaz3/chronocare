// src/components/BloodPressureForm.tsx

import React from 'react';
import { Box, Button } from '@mui/material';
import { BloodPressureData } from '../firebase';
import { useHealthData } from '../context/HealthDataContext';
import NumberAutocomplete from './NumberAutocomplete';
import FormAlert from './FormAlert';
import { getBloodPressureCategory } from '../data/bloodPressure';

interface BloodPressureFormProps {
  inputBP: {
    systolic: string;
    diastolic: string;
    pulse: string;
  };
  setInputBP: React.Dispatch<
    React.SetStateAction<{
      systolic: string;
      diastolic: string;
      pulse: string;
    }>
  >;
  systolicOptions: string[];
  diastolicOptions: string[];
  pulseOptions: string[];
  isMobile: boolean;
  errors: {
    bp: string;
    bpPulse: string;
  };
  setErrors: React.Dispatch<
    React.SetStateAction<{
      bp: string;
      bpPulse: string;
    }>
  >;
  successMessage: string;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

const BloodPressureForm: React.FC<BloodPressureFormProps> = ({
  inputBP,
  setInputBP,
  systolicOptions,
  diastolicOptions,
  pulseOptions,
  isMobile,
  errors,
  setErrors,
  successMessage,
  setSuccessMessage,
}) => {
  const { addBloodPressureReading, loading } = useHealthData();

  // Handle Input Changes
  const handleBPChange =
    (field: keyof typeof inputBP) =>
    (_event: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
      const value = newValue || '';
      setInputBP((prev) => ({ ...prev, [field]: value }));
      // Reset success message and specific error on input change
      setSuccessMessage('');
      if (errors.bp) {
        setErrors((prev) => ({ ...prev, bp: '' }));
      }
      if (errors.bpPulse) {
        setErrors((prev) => ({ ...prev, bpPulse: '' }));
      }
    };

  // Submit BP Form
  const handleBPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse inputs
    const systolic = parseInt(inputBP.systolic, 10);
    const diastolic = parseInt(inputBP.diastolic, 10);
    const pulse = parseInt(inputBP.pulse, 10);

    // Validate inputs using context's status info
    const category = getBloodPressureCategory(systolic, diastolic);
    if (category === 'Invalid' || pulse < 40 || pulse > 180) {
      setErrors({
        bp:
          category === 'Invalid'
            ? 'Vui lòng nhập các chỉ số huyết áp hợp lệ.'
            : '',
        bpPulse:
          pulse < 40 || pulse > 180
            ? 'Vui lòng nhập nhịp tim hợp lệ (40-180 bpm).'
            : '',
      });
      setSuccessMessage('');
      return;
    }

    // If valid, create data object
    const bpData: BloodPressureData = {
      systolic,
      diastolic,
      pulse,
      time: new Date().toISOString(),
    };

    try {
      await addBloodPressureReading(bpData);
      setErrors({ bp: '', bpPulse: '' });
      setSuccessMessage('Gửi thành công');
    } catch (err) {
      setErrors({ bp: 'Gửi không thành công.', bpPulse: '' });
      setSuccessMessage('');
    }
  };

  return (
    <form onSubmit={handleBPSubmit}>
      {/* Systolic, Diastolic, Pulse Inputs */}
      <Box
        sx={{
          gap: isMobile ? 0.5 : 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 2,
          flexWrap: 'wrap',
        }}
      >
        <NumberAutocomplete
          label='Systolic'
          unit='mmHg'
          value={inputBP.systolic}
          options={systolicOptions}
          onChange={handleBPChange('systolic')}
          min={80}
          max={200}
          error={!!errors.bp}
          aria-label='Systolic Blood Pressure in mm Hg'
          width={75}
        />

        <NumberAutocomplete
          label='Diastolic'
          unit='mmHg'
          value={inputBP.diastolic}
          options={diastolicOptions}
          onChange={handleBPChange('diastolic')}
          min={50}
          max={120}
          error={!!errors.bp}
          aria-label='Diastolic Blood Pressure in mm Hg'
          width={75}
        />

        <NumberAutocomplete
          label='Nhịp'
          unit='bpm'
          value={inputBP.pulse}
          options={pulseOptions}
          onChange={handleBPChange('pulse')}
          min={40}
          max={180}
          error={!!errors.bpPulse}
          aria-label='Pulse in bpm'
          width={75}
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
        aria-label='Submit Blood Pressure Reading'
      >
        {loading ? 'Đang gửi...' : 'THÊM'}
      </Button>

      <FormAlert
        successMessage={successMessage}
        errorMessage={errors.bp || errors.bpPulse}
      />
    </form>
  );
};

export default BloodPressureForm;
