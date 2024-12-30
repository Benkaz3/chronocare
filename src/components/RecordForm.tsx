// src/components/RecordForm.tsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Alert,
  Autocomplete,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { BloodPressureData, BloodSugarData } from '../firebase';
import useUserData from '../hooks/useUserData';
import { evaluateBPStatus, StatusInfo } from '../utils/evaluateBPStatus';
import BloodPressureGauge from './BloodPressureGauge';
import Bsgauge from './Bsgauge';

// Interface for TabPanel Props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Reusable TabPanel Component
const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => (
  <div
    role='tabpanel'
    hidden={value !== index}
    id={`record-form-tabpanel-${index}`}
    aria-labelledby={`record-form-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
  </div>
);

// Interface for NumberAutocomplete Props
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

// Reusable NumberAutocomplete Component
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

// Interface for FormAlert Props
interface FormAlertProps {
  successMessage?: string;
  errorMessage?: string;
}

// Reusable FormAlert Component
const FormAlert: React.FC<FormAlertProps> = ({
  successMessage,
  errorMessage,
}) => (
  <Box sx={{ minHeight: '65px', mt: 2 }}>
    {successMessage && <Alert severity='success'>{successMessage}</Alert>}
    {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
  </Box>
);

// Main RecordForm Component
const RecordForm: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const { addReading, loading } = useUserData();

  // State Management
  const [bloodPressure, setBloodPressure] = useState({
    systolic: '120',
    diastolic: '80',
    pulse: '70',
  });

  const [bloodSugar, setBloodSugar] = useState({
    level: '75',
  });

  const [errors, setErrors] = useState({
    bp: '',
    bs: '',
    bpPulse: '',
  });

  const [successMessages, setSuccessMessages] = useState({
    bp: '',
    bs: '',
  });

  const [numericValues, setNumericValues] = useState({
    bpSystolic: 120,
    bpDiastolic: 80,
    bpPulse: 70,
    bsLevel: 75,
  });

  const [, setBpStatusInfo] = useState<StatusInfo | null>(null);

  // Autocomplete Options (Memoized for Performance)
  const systolicOptions = useMemo(
    () => Array.from({ length: 121 }, (_, i) => (80 + i).toString()),
    []
  );
  const diastolicOptions = useMemo(
    () => Array.from({ length: 71 }, (_, i) => (50 + i).toString()),
    []
  );
  const pulseOptions = useMemo(
    () => Array.from({ length: 141 }, (_, i) => (40 + i).toString()),
    []
  );
  const bloodSugarOptions = useMemo(
    () => Array.from({ length: 451 }, (_, i) => (50 + i).toString()),
    []
  );

  // Responsive Design Hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle Tab Change
  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
      // Clear messages when switching tabs
      setErrors({ bp: '', bs: '', bpPulse: '' });
      setSuccessMessages({ bp: '', bs: '' });
    },
    []
  );

  // Validation Functions
  const isBPValid = useCallback((): boolean => {
    const { bpSystolic, bpDiastolic } = numericValues;
    return (
      bpSystolic >= 80 &&
      bpSystolic <= 200 &&
      bpDiastolic >= 50 &&
      bpDiastolic <= 120
    );
  }, [numericValues]);

  const isBSValid = useCallback((): boolean => {
    const { bsLevel } = numericValues;
    return bsLevel >= 50 && bsLevel <= 500;
  }, [numericValues]);

  // Fetch Last Readings from localStorage on Component Mount
  useEffect(() => {
    const fetchLastReadings = () => {
      const lastBP = localStorage.getItem('lastBloodPressure');
      if (lastBP) {
        try {
          const parsedBP: BloodPressureData = JSON.parse(lastBP);
          setBloodPressure({
            systolic: parsedBP.systolic.toString(),
            diastolic: parsedBP.diastolic.toString(),
            pulse: parsedBP.pulse.toString(),
          });
          setNumericValues((prev) => ({
            ...prev,
            bpSystolic: parsedBP.systolic,
            bpDiastolic: parsedBP.diastolic,
            bpPulse: parsedBP.pulse,
          }));
        } catch (error) {
          console.error(
            'Error parsing lastBloodPressure from localStorage:',
            error
          );
        }
      }

      const lastBS = localStorage.getItem('lastBloodSugar');
      if (lastBS) {
        try {
          const parsedBS: BloodSugarData = JSON.parse(lastBS);
          setBloodSugar({
            level: parsedBS.level.toString(),
          });
          setNumericValues((prev) => ({
            ...prev,
            bsLevel: parsedBS.level,
          }));
        } catch (error) {
          console.error(
            'Error parsing lastBloodSugar from localStorage:',
            error
          );
        }
      }
    };

    fetchLastReadings();
  }, []);

  // Evaluate BP Status
  useEffect(() => {
    if (bloodPressure.systolic && bloodPressure.diastolic) {
      if (isBPValid()) {
        const statusInfo = evaluateBPStatus(
          numericValues.bpSystolic,
          numericValues.bpDiastolic
        );
        setBpStatusInfo(statusInfo);
        setErrors((prev) => ({ ...prev, bp: '' }));
      } else {
        setBpStatusInfo(null);
        setErrors((prev) => ({
          ...prev,
          bp: 'Vui lòng nhập các chỉ số huyết áp hợp lệ.',
        }));
      }
    } else {
      setBpStatusInfo(null);
      setErrors((prev) => ({ ...prev, bp: '' }));
    }
  }, [
    bloodPressure.systolic,
    bloodPressure.diastolic,
    isBPValid,
    numericValues.bpSystolic,
    numericValues.bpDiastolic,
  ]);

  // Handle Input Changes
  const handleBPChange = useCallback(
    (field: keyof typeof bloodPressure) =>
      (
        _event: React.SyntheticEvent<Element, Event>,
        newValue: string | null
      ) => {
        const value = newValue || '';
        setBloodPressure((prev) => ({ ...prev, [field]: value }));
        const num = parseInt(value, 10);
        setNumericValues((prev) => ({
          ...prev,
          [`bp${field.charAt(0).toUpperCase() + field.slice(1)}`]: isNaN(num)
            ? 0
            : num,
        }));
      },
    []
  );

  const handleBSChange = useCallback(
    (_event: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
      const value = newValue || '';
      setBloodSugar({ level: value });
      const num = parseFloat(value);
      setNumericValues((prev) => ({
        ...prev,
        bsLevel: isNaN(num) ? 0 : num,
      }));
    },
    []
  );

  // Submit BP Form
  const handleBPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBPValid()) {
      setErrors((prev) => ({
        ...prev,
        bp: 'Vui lòng nhập các chỉ số huyết áp hợp lệ.',
      }));
      setSuccessMessages((prev) => ({ ...prev, bp: '' }));
      return;
    }

    const bpData: BloodPressureData = {
      systolic: numericValues.bpSystolic,
      diastolic: numericValues.bpDiastolic,
      pulse: numericValues.bpPulse,
      time: new Date().toISOString(),
    };

    try {
      await addReading('bloodPressure', bpData);
      setErrors((prev) => ({ ...prev, bp: '' }));
      setSuccessMessages((prev) => ({ ...prev, bp: 'Gửi thành công' }));
      // Persist to localStorage
      localStorage.setItem('lastBloodPressure', JSON.stringify(bpData));
    } catch (err) {
      setErrors((prev) => ({ ...prev, bp: 'Gửi không thành công.' }));
      setSuccessMessages((prev) => ({ ...prev, bp: '' }));
    }
  };

  // Submit BS Form
  const handleBSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBSValid()) {
      setErrors((prev) => ({
        ...prev,
        bs: 'Vui lòng nhập chỉ số đường huyết hợp lệ.',
      }));
      setSuccessMessages((prev) => ({ ...prev, bs: '' }));
      return;
    }

    const bsData: BloodSugarData = {
      level: numericValues.bsLevel,
      time: new Date().toISOString(),
    };

    try {
      await addReading('bloodSugar', bsData);
      setErrors((prev) => ({ ...prev, bs: '' }));
      setSuccessMessages((prev) => ({ ...prev, bs: 'Gửi thành công.' }));
      // Persist to localStorage
      localStorage.setItem('lastBloodSugar', JSON.stringify(bsData));
    } catch (err) {
      setErrors((prev) => ({ ...prev, bs: 'Gửi không thành công.' }));
      setSuccessMessages((prev) => ({ ...prev, bs: '' }));
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        padding: isMobile ? 1 : 4,
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label='Tabs Biểu mẫu Ghi nhận'
        variant='fullWidth'
        centered
      >
        <Tab
          label='Huyết Áp'
          id='record-form-tab-0'
          aria-controls='record-form-tabpanel-0'
        />
        <Tab
          label='Đường Huyết'
          id='record-form-tab-1'
          aria-controls='record-form-tabpanel-1'
        />
      </Tabs>

      {/* Blood Pressure Form */}
      <TabPanel value={tabValue} index={0}>
        {/* BloodPressureGauge */}
        <BloodPressureGauge
          systolic={numericValues.bpSystolic}
          diastolic={numericValues.bpDiastolic}
        />
        {/* End of BloodPressureGauge */}

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
              value={bloodPressure.systolic}
              options={systolicOptions}
              onChange={handleBPChange('systolic')}
              min={80}
              max={200}
              error={!!errors.bp && !isBPValid()}
              aria-label='Systolic Blood Pressure in mm Hg'
              width={75}
            />

            <NumberAutocomplete
              label='Diastolic'
              unit='mmHg'
              value={bloodPressure.diastolic}
              options={diastolicOptions}
              onChange={handleBPChange('diastolic')}
              min={50}
              max={120}
              error={!!errors.bp && !isBPValid()}
              aria-label='Diastolic Blood Pressure in mm Hg'
              width={75}
            />

            <NumberAutocomplete
              label='Nhịp'
              unit='bpm'
              value={bloodPressure.pulse}
              options={pulseOptions}
              onChange={handleBPChange('pulse')}
              min={40}
              max={180}
              error={
                !!errors.bpPulse &&
                (numericValues.bpPulse < 40 || numericValues.bpPulse > 180)
              }
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
            successMessage={successMessages.bp}
            errorMessage={errors.bp}
          />
        </form>
      </TabPanel>

      {/* Blood Sugar Form */}
      <TabPanel value={tabValue} index={1}>
        {/* bsgauge */}
        <Bsgauge level={numericValues.bsLevel} />
        {/* End of bsgauge */}

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
              value={bloodSugar.level}
              options={bloodSugarOptions}
              onChange={handleBSChange}
              min={50}
              max={500}
              error={!!errors.bs && !isBSValid()}
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

          <FormAlert
            successMessage={successMessages.bs}
            errorMessage={errors.bs}
          />
        </form>
      </TabPanel>
    </Box>
  );
};

export default RecordForm;
