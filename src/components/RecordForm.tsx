// src/components/RecordForm.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { Tabs, Tab, Box, useTheme, useMediaQuery } from '@mui/material';
import BloodPressureGauge from './BloodPressureGauge';
import BloodSugarGauge from './Bsgauge';
import BloodPressureForm from './BloodPressureForm';
import BloodSugarForm from './BloodSugarForm';

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

const RecordForm: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [inputBP, setInputBP] = useState<{
    systolic: string;
    diastolic: string;
    pulse: string;
  }>({
    systolic: '',
    diastolic: '',
    pulse: '',
  });

  const [inputBS, setInputBS] = useState<{
    level: string;
  }>({
    level: '',
  });

  const [errorsBP, setErrorsBP] = useState<{
    bp: string;
    bpPulse: string;
  }>({
    bp: '',
    bpPulse: '',
  });

  const [errorsBS, setErrorsBS] = useState<{
    bs: string;
  }>({
    bs: '',
  });

  const [successBP, setSuccessBP] = useState<string>('');
  const [successBS, setSuccessBS] = useState<string>('');

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

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
      setErrorsBP({ bp: '', bpPulse: '' });
      setErrorsBS({ bs: '' });
      setSuccessBP('');
      setSuccessBS('');
    },
    []
  );

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

      <TabPanel value={tabValue} index={0}>
        <BloodPressureGauge
          systolic={inputBP.systolic}
          diastolic={inputBP.diastolic}
        />
        <BloodPressureForm
          inputBP={inputBP}
          setInputBP={setInputBP}
          systolicOptions={systolicOptions}
          diastolicOptions={diastolicOptions}
          pulseOptions={pulseOptions}
          isMobile={isMobile}
          errors={errorsBP}
          setErrors={setErrorsBP}
          successMessage={successBP}
          setSuccessMessage={setSuccessBP}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <BloodSugarGauge level={inputBS.level} />
        <BloodSugarForm
          inputBS={inputBS}
          setInputBS={setInputBS}
          bloodSugarOptions={bloodSugarOptions}
          isMobile={isMobile}
          errors={errorsBS}
          setErrors={setErrorsBS}
          successMessage={successBS}
          setSuccessMessage={setSuccessBS}
        />
      </TabPanel>
    </Box>
  );
};

export default RecordForm;
