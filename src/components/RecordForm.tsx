// src/components/RecordForm.tsx

import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, TextField, Button, Alert } from '@mui/material';
import { BloodPressureData, BloodSugarData } from '../firebase';
import useUserData from '../hooks/useUserData';
import { evaluateBPStatus } from '../utils/evaluateBPStatus';
import BloodPressureGauge from './BloodPressureGauge';
import BloodSugarGauge from './bloodSugarGauge';
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

  // Blood Pressure State
  const [bpSystolic, setBpSystolic] = useState<string>('');
  const [bpDiastolic, setBpDiastolic] = useState<string>('');
  const [bpPulse, setBpPulse] = useState<string>('');

  // Blood Sugar State
  const [bsLevel, setBsLevel] = useState<string>('');

  // Validation Errors
  const [bpValidationError, setBpValidationError] = useState<string>('');
  const [bsValidationError, setBsValidationError] = useState<string>('');

  // Numeric Values for Gauge and Status Evaluation
  const [bpSystolicNum, setBpSystolicNum] = useState<number>(0);
  const [bpDiastolicNum, setBpDiastolicNum] = useState<number>(0);
  const [bsLevelNum, setBsLevelNum] = useState<number>(0);

  // Handle Tab Change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    if (newValue === 0) {
      // Switching to BP tab
    } else if (newValue === 1) {
      // Switching to Blood Sugar tab
    }

    // Clear validation errors
    setBpValidationError('');
    setBsValidationError('');
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
    const level = parseFloat(bsLevel);
    return !isNaN(level) && level >= 50 && level <= 500;
  };

  // Evaluate BP Status
  useEffect(() => {
    if (tabValue === 0) {
      if (bpSystolic && bpDiastolic) {
        if (isBPValid()) {
          evaluateBPStatus(bpSystolicNum, bpDiastolicNum);
          setBpValidationError('');
        } else {
          setBpValidationError('Vui lòng nhập các chỉ số huyết áp hợp lệ.');
        }
      } else {
        setBpValidationError('');
      }
    }
  }, [bpSystolic, bpDiastolic, bpSystolicNum, bpDiastolicNum, tabValue]);

  // Handle Input Changes
  const handleSystolicInputChange = (value: string) => {
    setBpSystolic(value);
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setBpSystolicNum(num);
    } else {
      setBpSystolicNum(0);
    }
  };

  const handleDiastolicInputChange = (value: string) => {
    setBpDiastolic(value);
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setBpDiastolicNum(num);
    } else {
      setBpDiastolicNum(0);
    }
  };

  const handleBsLevelInputChange = (value: string) => {
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
      return;
    }

    const pulse = bpPulse ? parseInt(bpPulse, 10) : 0;

    const bpData: BloodPressureData = {
      systolic: bpSystolicNum,
      diastolic: bpDiastolicNum,
      pulse,
      time: new Date().toISOString(),
    };

    try {
      await addReading('bloodPressure', bpData);
      // Reset BP fields after successful submission
      setBpSystolic('');
      setBpDiastolic('');
      setBpPulse('');
      setBpSystolicNum(0);
      setBpDiastolicNum(0);
      setBpValidationError('');
    } catch (err) {
      // Handle backend errors
      setBpValidationError('Thêm chỉ số huyết áp không thành công.');
    }
  };

  // Submit BS Form
  const handleBSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBSValid()) {
      setBsValidationError('Vui lòng nhập chỉ số đường huyết hợp lệ.');
      return;
    }

    const level = parseFloat(bsLevel);

    const bsData: BloodSugarData = {
      level,
      time: new Date().toISOString(),
    };

    try {
      await addReading('bloodSugar', bsData);
      // Reset BS fields after successful submission
      setBsLevel('');
      setBsLevelNum(0);
      setBsValidationError('');
    } catch (err) {
      // Handle backend errors
      setBsValidationError('Thêm chỉ số đường huyết không thành công.');
    }
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label='Tabs Biểu mẫu Ghi nhận'
        variant='fullWidth'
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

        {bpValidationError && (
          <Alert severity='error' sx={{ mt: 2 }}>
            {bpValidationError}
          </Alert>
        )}
        <form onSubmit={handleBPSubmit}>
          <TextField
            label='Huyết áp tâm thu (mm Hg)'
            variant='outlined'
            fullWidth
            required
            margin='normal'
            value={bpSystolic}
            onChange={(e) => handleSystolicInputChange(e.target.value)}
            type='number'
            placeholder='VD: 120'
            inputProps={{ min: 80, max: 200 }}
            helperText='Giá trị từ 80 đến 200 mm Hg'
            error={bpValidationError !== '' && !isBPValid()}
          />
          <TextField
            label='Huyết áp tâm trương (mm Hg)'
            variant='outlined'
            fullWidth
            required
            margin='normal'
            value={bpDiastolic}
            onChange={(e) => handleDiastolicInputChange(e.target.value)}
            type='number'
            placeholder='VD: 80'
            inputProps={{ min: 50, max: 120 }}
            helperText='Giá trị từ 50 đến 120 mm Hg'
            error={bpValidationError !== '' && !isBPValid()}
          />
          <TextField
            label='Nhịp tim (BPM)'
            variant='outlined'
            fullWidth
            margin='normal'
            value={bpPulse}
            onChange={(e) => setBpPulse(e.target.value)}
            type='number'
            placeholder='VD: 75'
            inputProps={{ min: 40, max: 180 }}
            helperText='Giá trị từ 40 đến 180 BPM (không bắt buộc)'
            error={
              bpValidationError !== '' &&
              bpPulse !== '' &&
              (parseInt(bpPulse, 10) < 40 || parseInt(bpPulse, 10) > 180)
            }
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : 'THÊM'}
          </Button>
        </form>
      </TabPanel>

      {/* Blood Sugar Form */}
      <TabPanel value={tabValue} index={1}>
        {/* BloodSugarGauge */}
        <BloodSugarGauge level={bsLevelNum} />
        {/* End of BloodSugarGauge */}

        {bsValidationError && (
          <Alert severity='error' sx={{ mt: 2 }}>
            {bsValidationError}
          </Alert>
        )}
        <form onSubmit={handleBSSubmit}>
          <TextField
            label='Chỉ số đường huyết (mg/dL)'
            variant='outlined'
            fullWidth
            required
            margin='normal'
            value={bsLevel}
            onChange={(e) => handleBsLevelInputChange(e.target.value)}
            type='number'
            placeholder='VD: 90'
            inputProps={{ min: 50, max: 500 }}
            helperText='Giá trị từ 50 đến 500 mg/dL'
            error={bsValidationError !== '' && !isBSValid()}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : 'THÊM'}
          </Button>
        </form>
      </TabPanel>
    </Box>
  );
};

export default RecordForm;
