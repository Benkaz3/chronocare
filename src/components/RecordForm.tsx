// src/components/RecordForm.tsx

import React, { useState, useEffect, useMemo } from 'react';
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
import BloodSugarGauge from './BloodSugarGauge';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
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
};

const RecordForm: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const { addReading, loading } = useUserData();

  // Initialize with "Normal" Range Values or from localStorage
  // Blood Pressure State
  const [bpSystolic, setBpSystolic] = useState<string>('120');
  const [bpDiastolic, setBpDiastolic] = useState<string>('80');
  const [bpPulse, setBpPulse] = useState<string>('70');

  // Blood Sugar State
  const [bsLevel, setBsLevel] = useState<string>('75');

  // Validation Errors
  const [bpValidationError, setBpValidationError] = useState<string>('');
  const [bsValidationError, setBsValidationError] = useState<string>('');

  // Success Messages
  const [bpSuccessMessage, setBpSuccessMessage] = useState<string>('');
  const [bsSuccessMessage, setBsSuccessMessage] = useState<string>('');

  // Numeric Values for Gauge and Status Evaluation
  const [bpSystolicNum, setBpSystolicNum] = useState<number>(120);
  const [bpDiastolicNum, setBpDiastolicNum] = useState<number>(80);
  const [bpPulseNum, setBpPulseNum] = useState<number>(70);
  const [bsLevelNum, setBsLevelNum] = useState<number>(75);

  const [, setBpStatusInfo] = useState<StatusInfo | null>(null);

  // Autocomplete Options (Memoized for Performance)
  const systolicOptions = useMemo(
    () => Array.from({ length: 121 }, (_, i) => 80 + i), // 80-200
    []
  );
  const diastolicOptions = useMemo(
    () => Array.from({ length: 71 }, (_, i) => 50 + i), // 50-120
    []
  );
  const pulseOptions = useMemo(
    () => Array.from({ length: 141 }, (_, i) => 40 + i), // 40-180
    []
  );
  const bloodSugarOptions = useMemo(
    () => Array.from({ length: 451 }, (_, i) => 50 + i), // 50-500
    []
  );

  // Responsive Design Hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle Tab Change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    // Clear validation and success messages
    setBpValidationError('');
    setBsValidationError('');
    setBpSuccessMessage('');
    setBsSuccessMessage('');
  };

  // Validation Functions
  const isBPValid = (): boolean => {
    return (
      bpSystolicNum >= 80 &&
      bpSystolicNum <= 200 &&
      bpDiastolicNum >= 50 &&
      bpDiastolicNum <= 120
    );
  };

  const isBSValid = (): boolean => {
    return bsLevelNum >= 50 && bsLevelNum <= 500;
  };

  // Fetch Last Readings from localStorage on Component Mount
  useEffect(() => {
    const lastBP = localStorage.getItem('lastBloodPressure');
    if (lastBP) {
      try {
        const parsedBP: BloodPressureData = JSON.parse(lastBP);
        setBpSystolic(parsedBP.systolic.toString());
        setBpDiastolic(parsedBP.diastolic.toString());
        setBpPulse(parsedBP.pulse.toString());
        setBpSystolicNum(parsedBP.systolic);
        setBpDiastolicNum(parsedBP.diastolic);
        setBpPulseNum(parsedBP.pulse);
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
        setBsLevel(parsedBS.level.toString());
        setBsLevelNum(parsedBS.level);
      } catch (error) {
        console.error('Error parsing lastBloodSugar from localStorage:', error);
      }
    }
  }, []);

  // Evaluate BP Status
  useEffect(() => {
    if (bpSystolic && bpDiastolic) {
      if (isBPValid()) {
        const statusInfo = evaluateBPStatus(bpSystolicNum, bpDiastolicNum);
        setBpStatusInfo(statusInfo);
        setBpValidationError('');
      } else {
        setBpStatusInfo(null);
        setBpValidationError('Vui lòng nhập các chỉ số huyết áp hợp lệ.');
      }
    } else {
      setBpStatusInfo(null);
      setBpValidationError('');
    }
  }, [bpSystolicNum, bpDiastolicNum]);
  // Handle Input Changes
  const handleSystolicInputChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    const value = newValue || '';
    setBpSystolic(value);
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setBpSystolicNum(num);
    } else {
      setBpSystolicNum(0);
    }
  };

  const handleDiastolicInputChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    const value = newValue || '';
    setBpDiastolic(value);
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setBpDiastolicNum(num);
    } else {
      setBpDiastolicNum(0);
    }
  };

  const handlePulseInputChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    const value = newValue || '';
    setBpPulse(value);
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setBpPulseNum(num);
    } else {
      setBpPulseNum(0);
    }
  };

  const handleBsLevelInputChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    const value = newValue || '';
    setBsLevel(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setBsLevelNum(num);
    } else {
      setBsLevelNum(0);
    }
  };

  // Submit BP Form
  const handleBPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBPValid()) {
      setBpValidationError('Vui lòng nhập các chỉ số huyết áp hợp lệ.');
      setBpSuccessMessage('');
      return;
    }

    const pulse = bpPulseNum;

    const bpData: BloodPressureData = {
      systolic: bpSystolicNum,
      diastolic: bpDiastolicNum,
      pulse,
      time: new Date().toISOString(),
    };

    try {
      await addReading('bloodPressure', bpData);
      // Update BP fields with the submitted values
      setBpValidationError('');
      setBpSuccessMessage('Gửi thành công');
      // Persist to localStorage
      localStorage.setItem('lastBloodPressure', JSON.stringify(bpData));
    } catch (err) {
      // Handle backend errors
      setBpValidationError('Gửi không thành công.');
      setBpSuccessMessage('');
    }
  };

  // Submit BS Form
  const handleBSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBSValid()) {
      setBsValidationError('Vui lòng nhập chỉ số đường huyết hợp lệ.');
      setBsSuccessMessage('');
      return;
    }

    const level = bsLevelNum;

    const bsData: BloodSugarData = {
      level,
      time: new Date().toISOString(),
    };

    try {
      await addReading('bloodSugar', bsData);
      // Update BS fields with the submitted value
      setBsValidationError('');
      setBsSuccessMessage('Gửi thành công.');
      // Persist to localStorage
      localStorage.setItem('lastBloodSugar', JSON.stringify(bsData));
    } catch (err) {
      // Handle backend errors
      setBsValidationError('Gửi không thành công.');
      setBsSuccessMessage('');
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
          systolic={bpSystolicNum}
          diastolic={bpDiastolicNum}
        />
        {/* End of BloodPressureGauge */}

        <form onSubmit={handleBPSubmit}>
          {/* Systolic Blood Pressure with Autocomplete */}
          <Box
            sx={{
              gap: isMobile ? 0.5 : 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 2,
            }}
          >
            <Autocomplete
              freeSolo
              options={systolicOptions.map((option) => option.toString())}
              value={bpSystolic}
              disableClearable
              onInputChange={handleSystolicInputChange}
              renderInput={(params) => (
                <Box
                  sx={{
                    textAlign: 'center',
                    width: 75,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.3,
                    }}
                  >
                    <Typography
                      variant='body1'
                      component='label'
                      htmlFor={params.id}
                    >
                      T.Thu
                    </Typography>
                    <Typography variant='caption'>mm Hg</Typography>
                  </Box>
                  <TextField
                    {...params}
                    variant='outlined'
                    required
                    type='number'
                    inputProps={{
                      ...params.inputProps,
                      min: 80,
                      max: 200,
                      style: { textAlign: 'center' },
                      'aria-label': 'Systolic Blood Pressure in mm Hg',
                    }}
                    error={bpValidationError !== '' && !isBPValid()}
                    aria-invalid={bpValidationError !== '' && !isBPValid()}
                  />
                </Box>
              )}
            />

            <Autocomplete
              freeSolo
              options={diastolicOptions.map((option) => option.toString())}
              value={bpDiastolic}
              disableClearable
              onInputChange={handleDiastolicInputChange}
              renderInput={(params) => (
                <Box
                  sx={{
                    textAlign: 'center',
                    width: 75,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.3,
                    }}
                  >
                    <Typography
                      variant='body1'
                      component='label'
                      htmlFor={params.id}
                    >
                      T.Trương
                    </Typography>
                    <Typography variant='caption'>mm Hg</Typography>
                  </Box>
                  <TextField
                    {...params}
                    variant='outlined'
                    required
                    type='number'
                    inputProps={{
                      ...params.inputProps,
                      min: 50,
                      max: 120,
                      style: { textAlign: 'center' },
                      'aria-label': 'Diastolic Blood Pressure in mm Hg',
                    }}
                    error={bpValidationError !== '' && !isBPValid()}
                    aria-invalid={bpValidationError !== '' && !isBPValid()}
                  />
                </Box>
              )}
            />

            <Autocomplete
              freeSolo
              options={pulseOptions.map((option) => option.toString())}
              value={bpPulse}
              disableClearable
              onInputChange={handlePulseInputChange}
              renderInput={(params) => (
                <Box
                  sx={{
                    textAlign: 'center',
                    width: 75,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.3,
                    }}
                  >
                    <Typography
                      variant='body1'
                      component='label'
                      htmlFor={params.id}
                    >
                      Nhịp
                    </Typography>
                    <Typography variant='caption'>bpm</Typography>
                  </Box>
                  <TextField
                    {...params}
                    variant='outlined'
                    type='number'
                    inputProps={{
                      ...params.inputProps,
                      min: 40,
                      max: 180,
                      style: { textAlign: 'center' },
                      'aria-label': 'Pulse in bpm',
                    }}
                    error={
                      bpPulse !== '' && (bpPulseNum < 40 || bpPulseNum > 180)
                    }
                    aria-invalid={
                      bpPulse !== '' && (bpPulseNum < 40 || bpPulseNum > 180)
                    }
                  />
                </Box>
              )}
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
          <Box sx={{ minHeight: '65px', mt: 2 }}>
            {/* Success Message */}
            {bpSuccessMessage && (
              <Alert severity='success'>{bpSuccessMessage}</Alert>
            )}

            {/* Validation Error */}
            {bpValidationError && (
              <Alert severity='error'>{bpValidationError}</Alert>
            )}
          </Box>
        </form>
      </TabPanel>

      {/* Blood Sugar Form */}
      <TabPanel value={tabValue} index={1}>
        {/* BloodSugarGauge */}
        <BloodSugarGauge level={bsLevelNum} />
        {/* End of BloodSugarGauge */}

        <form onSubmit={handleBSSubmit}>
          {/* Blood Sugar Level with Autocomplete */}
          <Box
            sx={{
              gap: isMobile ? 0.5 : 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 2,
            }}
          >
            <Autocomplete
              freeSolo
              options={bloodSugarOptions.map((option) => option.toString())}
              value={bsLevel}
              disableClearable
              onInputChange={handleBsLevelInputChange}
              renderInput={(params) => (
                <Box
                  sx={{
                    textAlign: 'center',
                    width: 85,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.3,
                    }}
                  >
                    <Typography
                      variant='body1'
                      component='label'
                      htmlFor={params.id}
                    >
                      Đ.Huyết
                    </Typography>
                    <Typography variant='caption'>mg/dL</Typography>
                  </Box>
                  <TextField
                    {...params}
                    variant='outlined'
                    required
                    type='number'
                    placeholder='VD: 90'
                    inputProps={{
                      ...params.inputProps,
                      min: 50,
                      max: 500,
                      style: { textAlign: 'center' },
                      'aria-label': 'Blood Sugar Level in mg/dL',
                    }}
                    error={bsValidationError !== '' && !isBSValid()}
                    aria-invalid={bsValidationError !== '' && !isBSValid()}
                  />
                </Box>
              )}
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
          {/* Success Message */}
          <Box sx={{ minHeight: '65px', mt: 2 }}>
            {bsSuccessMessage && (
              <Alert severity='success'>{bsSuccessMessage}</Alert>
            )}

            {/* Validation Error */}
            {bsValidationError && (
              <Alert severity='error'>{bsValidationError}</Alert>
            )}
          </Box>
        </form>
      </TabPanel>
    </Box>
  );
};

export default RecordForm;
