// src/components/BloodSugarForm.tsx

import React, { useState } from 'react';
import { Box, Button, Dialog, Typography, Stack } from '@mui/material';
import {
  LocalizationProvider,
  StaticDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BloodSugarData } from '../firebase';
import { useHealthData } from '../context/HealthDataContext';
import NumberAutocomplete from './NumberAutocomplete';
import FormAlert from './FormAlert';
import { getBloodSugarCategory } from '../data/bloodSugar';
// import LastReading from './LastReading';
import { Timestamp } from 'firebase/firestore';

interface BloodSugarFormProps {
  inputBS: {
    level: string;
  };
  setInputBS: React.Dispatch<React.SetStateAction<{ level: string }>>;
  bloodSugarOptions: string[];
  isMobile: boolean;
  errors: {
    bs: string;
    dateTime?: string;
  };
  setErrors: React.Dispatch<
    React.SetStateAction<{
      bs: string;
      dateTime?: string;
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

  // State for date-time picker using Day.js (non-nullable)
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs>(dayjs());

  // State to control picker dialog
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Handle Input Changes
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

  // Handle Date-Time Change
  const handleDateTimeChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setSelectedDateTime(newValue);
      setSuccessMessage('');
      if (errors.dateTime) {
        setErrors((prev) => ({ ...prev, dateTime: '' }));
      }
      // Close picker after selection
    }
  };

  const handleBSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const level = parseFloat(inputBS.level);

    const category = getBloodSugarCategory(level);
    let hasError = false;
    const newErrors = { bs: '', dateTime: '' };

    if (category === 'Invalid') {
      newErrors.bs = 'Vui lòng nhập chỉ số đường huyết hợp lệ.';
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

    const bsData: BloodSugarData = {
      level,
      time: selectedDateTime.toISOString(),
      recordedAt: Timestamp.fromDate(selectedDateTime.toDate()),
    };

    try {
      await addBloodSugarReading(bsData);
      setErrors({ bs: '', dateTime: '' });
      setSuccessMessage('Gửi thành công.');
      // Optionally reset the form
      setInputBS({ level: '' });
      setSelectedDateTime(dayjs());
    } catch (err) {
      setErrors({
        bs: 'Gửi không thành công.',
        dateTime: errors.dateTime || '',
      });
      setSuccessMessage('');
    }
  };

  // Helper functions to format date and time
  const isToday = selectedDateTime.isSame(dayjs(), 'day');
  const displayDate = isToday ? 'Hôm nay' : selectedDateTime.format('DD/MM');
  const displayTime = selectedDateTime.format('h:mm A');

  // Handler for the "Done" button
  const handleDone = () => {
    setIsPickerOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleBSSubmit}>
        {/* Blood Sugar Input */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? 1 : 2,
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
            width={isMobile ? 75 : 120}
          />
        </Box>
        {/* Date-Time Display */}
        <Box
          sx={{
            mt: isMobile ? 2 : 0,
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
              onAccept={() => setIsPickerOpen(false)}
              disableFuture
            />
            {/* Action Buttons */}
            <Stack
              direction='row'
              spacing={2}
              justifyContent='flex-end'
              sx={{ mt: 2 }}
            >
              <Button
                onClick={handleDone}
                variant='outlined'
                color='primary'
                sx={{ padding: '4px 8px' }}
              >
                Hoàn tất
              </Button>
            </Stack>
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
          aria-label='Submit Blood Sugar Reading'
        >
          {loading ? 'Đang gửi...' : 'THÊM'}
        </Button>

        <FormAlert
          successMessage={successMessage}
          errorMessage={errors.bs || errors.dateTime}
        />

        {/* <LastReading reading={bloodSugar} type='bloodSugar' /> */}
      </form>
    </LocalizationProvider>
  );
};

export default BloodSugarForm;
