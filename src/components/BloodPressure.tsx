import React, { useState } from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { AccessTime, DateRange } from '@mui/icons-material';
import { addBloodPressureData, BloodPressureData } from '../firebase';
import BloodPressureGauge from './BloodPressureGauge';
import StatusDisplay from './StatusDisplay';
import BloodPressureForm from './BloodPressureForm';
import TrendChart from './TrendChart';
import Header from './Header';

const BloodPressure: React.FC = () => {
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [pulse, setPulse] = useState<number>(70);
  const [date, setDate] = useState<string>(new Date().toLocaleDateString());
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString().slice(0, 5)
  );
  const [trendData, setTrendData] = useState<BloodPressureData[]>([]);

  const statusColors = {
    normal: '#5BE12C',
    elevated: '#F5CD19',
    hypertensionStage1: '#EA4228',
    hypertensionStage2: '#F44336',
    hypertensiveCrisis: '#D32F2F',
  };

  const getStatus = (systolic: number, diastolic: number) => {
    if (systolic < 121 && diastolic < 81) {
      return { label: 'Bình thường', color: statusColors.normal };
    } else if (systolic < 130 && diastolic < 80) {
      return { label: 'HA Cao', color: statusColors.elevated };
    } else if (systolic < 140 || diastolic < 90) {
      return {
        label: 'HA Cao - cấp 1',
        color: statusColors.hypertensionStage1,
      };
    } else if (systolic >= 140 || diastolic >= 90) {
      return {
        label: 'HA Cao - cấp 2',
        color: statusColors.hypertensionStage2,
      };
    } else {
      return {
        label: 'Báo động - cấp cứu',
        color: statusColors.hypertensiveCrisis,
      };
    }
  };

  const status = getStatus(systolic, diastolic);

  const handleAddValues = async () => {
    try {
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString().slice(0, 5);
      const currentDateString = currentDate.toLocaleDateString();

      const newData = {
        systolic,
        diastolic,
        pulse,
        time: `${currentDateString} ${currentTime}`,
      };

      await addBloodPressureData(newData);

      setDate(currentDateString);
      setTime(currentTime);
      setTrendData((prevData) => [
        ...prevData,
        {
          systolic,
          diastolic,
          pulse,
          time: `${currentDateString} ${currentTime}`,
        },
      ]);
    } catch (error) {
      console.error('Error adding blood pressure data:', error);
    }
  };

  // Prepare chart data for TrendChart
  const chartData = {
    time: trendData.map((entry, index) => `#${index + 1} - ${entry.time}`),
    systolic: trendData.map((entry) => entry.systolic),
    diastolic: trendData.map((entry) => entry.diastolic),
    pulse: trendData.map((entry) => entry.pulse),
  };

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Header />
      <Typography variant='h4' gutterBottom>
        Huyết áp
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <BloodPressureGauge
              systolic={systolic}
              statusColors={statusColors}
            />
            <StatusDisplay status={status} />
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <BloodPressureForm
              systolic={systolic}
              diastolic={diastolic}
              pulse={pulse}
              setSystolic={setSystolic}
              setDiastolic={setDiastolic}
              setPulse={setPulse}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
              <DateRange sx={{ marginRight: 1 }} />
              <Typography variant='body2' sx={{ marginRight: 3 }}>
                {date}
              </Typography>
              <AccessTime sx={{ marginRight: 1 }} />
              <Typography variant='body2'>{time}</Typography>
            </Box>
            <Button
              variant='contained'
              sx={{ marginTop: 2, minWidth: 150 }}
              onClick={handleAddValues}
            >
              Thêm
            </Button>
          </Paper>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <TrendChart chartData={chartData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}></Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </Container>
  );
};

export default BloodPressure;
