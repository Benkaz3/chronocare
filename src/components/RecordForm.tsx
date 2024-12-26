// src/components/RecordForm.tsx

import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { BloodPressureData, BloodSugarData } from '../firebase';
import useUserData from '../hooks/useUserData';
import {
  evaluateBPStatus,
  evaluateBSStatus,
  BPStatus,
  BSStatus,
} from '../utils/statusUtils';
import StatusBar from './StatusBar';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StatusInfo {
  status: BPStatus | BSStatus;
  explanation: string;
  action: string;
  range: {
    min: number;
    max: number;
    color: string;
  };
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

  // Trạng thái Huyết Áp
  const [bpSystolic, setBpSystolic] = useState<string>('');
  const [bpDiastolic, setBpDiastolic] = useState<string>('');
  const [bpPulse, setBpPulse] = useState<string>('');

  // Trạng thái Đường Huyết
  const [bsLevel, setBsLevel] = useState<string>('');

  // Thông tin Trạng thái
  const [bpStatusInfo, setBpStatusInfo] = useState<StatusInfo | null>(null);
  const [bsStatusInfo, setBsStatusInfo] = useState<StatusInfo | null>(null);

  // Trạng thái Lỗi Xác thực
  const [bpValidationError, setBpValidationError] = useState<string>('');
  const [bsValidationError, setBsValidationError] = useState<string>('');

  // Xử lý Thay đổi Tab
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Đặt lại các trường biểu mẫu và trạng thái khi chuyển đổi tab
    setBpSystolic(newValue === 0 ? '110' : '');
    setBpDiastolic(newValue === 0 ? '76' : '');
    setBpPulse(newValue === 0 ? '81' : '');
    setBsLevel(newValue === 1 ? '' : '');
    setBpStatusInfo(null);
    setBsStatusInfo(null);
    setBpValidationError('');
    setBsValidationError('');
  };

  // Trợ giúp Xác thực
  const isBPValid = (): boolean => {
    const systolic = parseInt(bpSystolic, 10);
    const diastolic = parseInt(bpDiastolic, 10);
    return (
      !isNaN(systolic) &&
      systolic >= 80 &&
      systolic <= 200 &&
      !isNaN(diastolic) &&
      diastolic >= 50 &&
      diastolic <= 120
    );
  };

  const isBSValid = (): boolean => {
    const level = parseFloat(bsLevel);
    return !isNaN(level) && level >= 50 && level <= 500;
  };

  // Đánh giá Trạng thái khi Thay đổi Input
  useEffect(() => {
    if (tabValue === 0) {
      if (bpSystolic && bpDiastolic) {
        if (isBPValid()) {
          const systolic = parseInt(bpSystolic, 10);
          const diastolic = parseInt(bpDiastolic, 10);
          const statusInfo = evaluateBPStatus(systolic, diastolic);
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
    }
  }, [bpSystolic, bpDiastolic, tabValue]);

  useEffect(() => {
    if (tabValue === 1) {
      if (bsLevel) {
        if (isBSValid()) {
          const level = parseFloat(bsLevel);
          const statusInfo = evaluateBSStatus(level);
          setBsStatusInfo(statusInfo);
          setBsValidationError('');
        } else {
          setBsStatusInfo(null);
          setBsValidationError('Vui lòng nhập chỉ số đường huyết hợp lệ.');
        }
      } else {
        setBsStatusInfo(null);
        setBsValidationError('');
      }
    }
  }, [bsLevel, tabValue]);

  // Xử lý Gửi Form Huyết Áp
  const handleBPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBPValid()) {
      setBpValidationError('Vui lòng nhập các chỉ số huyết áp hợp lệ.');
      return;
    }

    const systolic = parseInt(bpSystolic, 10);
    const diastolic = parseInt(bpDiastolic, 10);
    const pulse = bpPulse ? parseInt(bpPulse, 10) : 0;

    const bpData: BloodPressureData = {
      systolic,
      diastolic,
      pulse,
      time: new Date().toISOString(),
    };

    try {
      await addReading('bloodPressure', bpData);
      // Đặt lại các trường biểu mẫu và trạng thái sau khi gửi
      setBpSystolic('110');
      setBpDiastolic('76');
      setBpPulse('81');
      setBpStatusInfo(null);
      setBpValidationError('');
    } catch (err) {
      // Xử lý lỗi từ backend
      setBpValidationError('Thêm chỉ số huyết áp không thành công.');
    }
  };

  // Xử lý Gửi Form Đường Huyết
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
      // Đặt lại các trường biểu mẫu và trạng thái sau khi gửi
      setBsLevel('');
      setBsStatusInfo(null);
      setBsValidationError('');
    } catch (err) {
      // Xử lý lỗi từ backend
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

      {/* Biểu mẫu Huyết Áp */}
      <TabPanel value={tabValue} index={0}>
        {bpStatusInfo && <StatusBar status={bpStatusInfo.status} />}
        {bpStatusInfo && bpStatusInfo.explanation && (
          <Box sx={{ mt: 1 }}>
            <Typography variant='body1'>{bpStatusInfo.explanation}</Typography>
            {bpStatusInfo.action && (
              <Typography variant='body2' color='textSecondary'>
                Khuyến cáo: {bpStatusInfo.action}
              </Typography>
            )}
          </Box>
        )}
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
            onChange={(e) => setBpSystolic(e.target.value)}
            type='number'
            inputProps={{ min: 80, max: 200 }}
          />
          <TextField
            label='Huyết áp tâm trương (mm Hg)'
            variant='outlined'
            fullWidth
            required
            margin='normal'
            value={bpDiastolic}
            onChange={(e) => setBpDiastolic(e.target.value)}
            type='number'
            inputProps={{ min: 50, max: 120 }}
          />
          <TextField
            label='Nhịp tim (BPM)'
            variant='outlined'
            fullWidth
            margin='normal'
            value={bpPulse}
            onChange={(e) => setBpPulse(e.target.value)}
            type='number'
            inputProps={{ min: 40, max: 180 }}
            helperText='Tùy chọn'
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

      {/* Biểu mẫu Đường Huyết */}
      <TabPanel value={tabValue} index={1}>
        {bsStatusInfo && <StatusBar status={bsStatusInfo.status} />}
        {bsStatusInfo && bsStatusInfo.explanation && (
          <Box sx={{ mt: 1 }}>
            <Typography variant='body1'>{bsStatusInfo.explanation}</Typography>
            {bsStatusInfo.action && (
              <Typography variant='body2' color='textSecondary'>
                Khuyến cáo: {bsStatusInfo.action}
              </Typography>
            )}
          </Box>
        )}
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
            onChange={(e) => setBsLevel(e.target.value)}
            type='number'
            inputProps={{ min: 50, max: 500 }}
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
