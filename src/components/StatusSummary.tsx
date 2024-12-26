// src/components/StatusSummary.tsx

import React, { useMemo } from 'react';
import {
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Favorite as BloodPressureIcon,
  Opacity as BloodSugarIcon,
} from '@mui/icons-material';
import useUserData from '../hooks/useUserData';

interface BloodPressureReading {
  value: {
    systolic: number;
    diastolic: number;
    pulse?: number;
  };
  date: string;
}

interface BloodSugarReading {
  value: {
    level: number;
  };
  date: string;
}

const StatusSummary: React.FC = () => {
  const { readings, loading, error } = useUserData();

  // Lấy các lần đo huyết áp và đường huyết mới nhất
  const latestBP: BloodPressureReading | null = useMemo(() => {
    if (readings.bloodPressure.length === 0) return null;
    // Giả sử các lần đo được sắp xếp theo ngày giảm dần
    return readings.bloodPressure[0];
  }, [readings.bloodPressure]);

  const latestBS: BloodSugarReading | null = useMemo(() => {
    if (readings.bloodSugar.length === 0) return null;
    // Giả sử các lần đo được sắp xếp theo ngày giảm dần
    return readings.bloodSugar[0];
  }, [readings.bloodSugar]);

  // Xác định Trạng thái Huyết Áp
  const getBPStatus = (
    systolic: number,
    diastolic: number
  ): { label: string; color: 'success' | 'warning' | 'error' | 'default' } => {
    if (systolic < 120 && diastolic < 80) {
      return { label: 'Bình thường', color: 'success' };
    } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
      return { label: 'Tăng cao', color: 'warning' };
    } else if (
      (systolic >= 130 && systolic < 140) ||
      (diastolic >= 80 && diastolic < 90)
    ) {
      return { label: 'Tăng cao (Giai đoạn 1)', color: 'warning' };
    } else if (systolic >= 140 || diastolic >= 90) {
      return { label: 'Tăng cao (Giai đoạn 2)', color: 'error' };
    } else {
      return { label: 'Không xác định', color: 'default' };
    }
  };

  // Xác định Trạng thái Đường Huyết
  const getBSStatus = (
    level: number
  ): { label: string; color: 'success' | 'warning' | 'error' | 'default' } => {
    if (level < 100) {
      return { label: 'Bình thường', color: 'success' };
    } else if (level >= 100 && level < 126) {
      return { label: 'Tiền tiểu đường', color: 'warning' };
    } else if (level >= 126) {
      return { label: 'Tiểu đường', color: 'error' };
    } else {
      return { label: 'Không xác định', color: 'default' };
    }
  };

  // Định dạng Ngày
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN'); // Định dạng theo ngôn ngữ Việt Nam
  };

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Chỉ số đo lần gần nhất
      </Typography>

      {loading ? (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='100px'
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity='error'>{error}</Alert>
      ) : (
        <Grid container spacing={2}>
          {/* Phần Huyết Áp */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: '#f5f5f5',
                height: '100%',
              }}
            >
              <CardContent>
                <Box display='flex' alignItems='center' mb={2}>
                  <BloodPressureIcon color='primary' sx={{ mr: 1 }} />
                  <Typography variant='h6' component='div'>
                    Huyết Áp
                  </Typography>
                </Box>
                {latestBP ? (
                  <Box>
                    <Typography variant='body1'>
                      <strong>Tâm thu:</strong> {latestBP.value.systolic} mm Hg
                    </Typography>
                    <Typography variant='body1'>
                      <strong>Tâm trương:</strong> {latestBP.value.diastolic} mm
                      Hg
                    </Typography>
                    {latestBP.value.pulse && (
                      <Typography variant='body1'>
                        <strong>Nhịp tim:</strong> {latestBP.value.pulse} BPM
                      </Typography>
                    )}
                    <Box mt={1}>
                      <Chip
                        label={
                          getBPStatus(
                            latestBP.value.systolic,
                            latestBP.value.diastolic
                          ).label
                        }
                        color={
                          getBPStatus(
                            latestBP.value.systolic,
                            latestBP.value.diastolic
                          ).color
                        }
                        size='small'
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Typography variant='caption' color='textSecondary' mt={1}>
                      Cập nhật lần cuối: {formatDate(latestBP.date)}
                    </Typography>
                  </Box>
                ) : (
                  <Typography>Không có dữ liệu đo huyết áp.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Phần Đường Huyết */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: '#f5f5f5',
                height: '100%',
              }}
            >
              <CardContent>
                <Box display='flex' alignItems='center' mb={2}>
                  <BloodSugarIcon color='secondary' sx={{ mr: 1 }} />
                  <Typography variant='h6' component='div'>
                    Đường Huyết
                  </Typography>
                </Box>
                {latestBS ? (
                  <Box>
                    <Typography variant='body1'>
                      <strong>Mức đường huyết:</strong> {latestBS.value.level}{' '}
                      mg/dL
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        label={getBSStatus(latestBS.value.level).label}
                        color={getBSStatus(latestBS.value.level).color}
                        size='small'
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Typography variant='caption' color='textSecondary' mt={1}>
                      Cập nhật lần cuối: {formatDate(latestBS.date)}
                    </Typography>
                  </Box>
                ) : (
                  <Typography>Không có dữ liệu đo đường huyết.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StatusSummary;
