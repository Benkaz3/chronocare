// src/components/BloodPressureForm.tsx

import React, { useState } from 'react';
import { Box, Button, Dialog, Typography } from '@mui/material';
import {
  LocalizationProvider,
  StaticDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BloodPressureData } from '../firebase';
import { useHealthData } from '../context/HealthDataContext';
import NumberAutocomplete from './NumberAutocomplete';
import FormAlert from './FormAlert';
import { getBloodPressureCategory } from '../data/bloodPressure';
import LastReading from './LastReading';

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
    dateTime?: string;
  };
  setErrors: React.Dispatch<
    React.SetStateAction<{
      bp: string;
      bpPulse: string;
      dateTime?: string;
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
  const { addBloodPressureReading, loading, bloodPressure } = useHealthData();

  // State for date-time picker using Day.js (non-nullable)
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs>(dayjs());

  // State to control picker dialog
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Handle Input Changes
  const handleBPChange =
    (field: keyof typeof inputBP) =>
    (_event: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
      const value = newValue || '';
      setInputBP((prev) => ({ ...prev, [field]: value }));
      setSuccessMessage('');
      if (errors.bp) {
        setErrors((prev) => ({ ...prev, bp: '' }));
      }
      if (errors.bpPulse) {
        setErrors((prev) => ({ ...prev, bpPulse: '' }));
      }
    };

  // Handle Date-Time Change
  const handleDateTimeChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setSelectedDateTime(newValue);
      setSuccessMessage('');
      if (errors.dateTime) {
        setErrors((prev) => ({ ...prev, dateTime: '' }));
      }
      setIsPickerOpen(false); // Close picker after selection
    }
  };

  const handleBPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const systolic = parseInt(inputBP.systolic, 10);
    const diastolic = parseInt(inputBP.diastolic, 10);
    const pulse = parseInt(inputBP.pulse, 10);

    const category = getBloodPressureCategory(systolic, diastolic);
    let hasError = false;
    const newErrors = { bp: '', bpPulse: '', dateTime: '' };

    if (category === 'Invalid') {
      newErrors.bp = 'Vui lòng nhập các chỉ số huyết áp hợp lệ.';
      hasError = true;
    }

    if (pulse < 40 || pulse > 180) {
      newErrors.bpPulse = 'Vui lòng nhập nhịp tim hợp lệ (40-180 bpm).';
      hasError = true;
    }

    if (!selectedDateTime || !selectedDateTime.isValid()) {
      newErrors.dateTime = 'Vui lòng chọn ngày và giờ hợp lệ.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setSuccessMessage('');
      return;
    }

    // If valid, create data object
    const bpData: BloodPressureData = {
      systolic,
      diastolic,
      pulse,
      time: selectedDateTime.toISOString(),
    };

    try {
      await addBloodPressureReading(bpData);
      setErrors({ bp: '', bpPulse: '', dateTime: '' });
      setSuccessMessage('Gửi thành công');
      // Optionally reset the form
      setInputBP({ systolic: '', diastolic: '', pulse: '' });
      setSelectedDateTime(dayjs());
    } catch (err) {
      setErrors({
        bp: 'Gửi không thành công.',
        bpPulse: '',
        dateTime: errors.dateTime || '',
      });
      setSuccessMessage('');
    }
  };

  // Helper functions to format date and time
  const isToday = selectedDateTime.isSame(dayjs(), 'day');
  const displayDate = isToday ? 'Hôm nay' : selectedDateTime.format('DD/MM');
  const displayTime = selectedDateTime.format('h:mm A');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleBPSubmit}>
        {/* Systolic, Diastolic, Pulse Inputs */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isMobile ? 1 : 2,
            mt: 2,
            flexWrap: 'wrap',
          }}
        >
          <NumberAutocomplete
            label='Systolic'
            placeholder='VD: 114'
            unit='mmHg'
            value={inputBP.systolic}
            options={systolicOptions}
            onChange={handleBPChange('systolic')}
            min={80}
            max={200}
            error={!!errors.bp}
            aria-label='Systolic Blood Pressure in mm Hg'
            width={isMobile ? 75 : 120}
          />

          <NumberAutocomplete
            label='Diastolic'
            placeholder='VD: 80'
            unit='mmHg'
            value={inputBP.diastolic}
            options={diastolicOptions}
            onChange={handleBPChange('diastolic')}
            min={50}
            max={120}
            error={!!errors.bp}
            aria-label='Diastolic Blood Pressure in mm Hg'
            width={isMobile ? 75 : 120}
          />

          <NumberAutocomplete
            label='Nhịp'
            placeholder='VD: 85'
            unit='bpm'
            value={inputBP.pulse}
            options={pulseOptions}
            onChange={handleBPChange('pulse')}
            min={40}
            max={180}
            error={!!errors.bpPulse}
            aria-label='Pulse in bpm'
            width={isMobile ? 75 : 120}
          />
        </Box>

        {/* Date-Time Display */}
        <Box
          sx={{
            mt: isMobile ? 2 : 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            cursor: 'pointer',
            padding: 1,
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
          onClick={() => setIsPickerOpen(true)}
          aria-label='Chọn ngày và giờ'
        >
          {/* Date Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon color='disabled' />
            <Typography variant='body2' sx={{ fontWeight: '400' }}>
              {displayDate}
            </Typography>
          </Box>

          {/* Time Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon color='disabled' />
            <Typography variant='body2' sx={{ fontWeight: '400' }}>
              {displayTime}
            </Typography>
          </Box>
        </Box>

        {/* Date-Time Picker Dialog */}
        <Dialog
          open={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          fullWidth
          maxWidth='xs'
        >
          <Box sx={{ padding: 2 }}>
            <StaticDateTimePicker
              displayStaticWrapperAs='desktop'
              value={selectedDateTime}
              onChange={handleDateTimeChange}
              disableFuture
            />
          </Box>
        </Dialog>

        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          sx={{
            mt: 3,
            height: 48,
            borderRadius: 2,
            fontSize: isMobile ? '1rem' : '1.125rem',
          }}
          disabled={loading}
          aria-label='Submit Blood Pressure Reading'
        >
          {loading ? 'Đang gửi...' : 'THÊM'}
        </Button>

        <FormAlert
          successMessage={successMessage}
          errorMessage={errors.bp || errors.bpPulse || errors.dateTime}
        />
        <LastReading reading={bloodPressure} type='bloodPressure' />
      </form>
    </LocalizationProvider>
  );
};

export default BloodPressureForm;
