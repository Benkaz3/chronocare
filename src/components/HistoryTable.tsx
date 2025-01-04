// src/components/HistoryTable.tsx

import React, { useMemo, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  TablePagination,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  Tooltip,
  Grid,
  TableHead, // Added TableHead
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RestoreIcon from '@mui/icons-material/Restore';
import useUserData from '../hooks/useUserData';
import CalendarModal from './CalendarModal';

// Import centralized data and utility functions
import {
  getBloodPressureCategory,
  getBloodPressureStatusInfo,
  bloodPressureFilterableStatusLabels,
} from '../data/bloodPressure';
import {
  getBloodSugarCategory,
  getBloodSugarStatusInfo,
  bloodSugarFilterableStatusLabels,
} from '../data/bloodSugar';

// Interfaces for readings (adjusted as per centralized data)
interface HistoryTableProps {
  type: 'bloodPressure' | 'bloodSugar';
  title: string;
}

interface BloodPressureReading {
  id: string;
  value: {
    systolic: number;
    diastolic: number;
    pulse?: number;
  };
  date: string;
  recordedAt: Date | null;
}

interface BloodSugarReading {
  id: string;
  value: {
    level: number;
  };
  date: string;
  recordedAt: Date | null;
}

interface ProcessedBP extends BloodPressureReading {
  systolic: number;
  diastolic: number;
  pulse: number | null;
  status: string;
  color: string; // Added color for consistency
}

interface ProcessedBS extends BloodSugarReading {
  level: number;
  status: string;
  color: string; // Added color for consistency
}

// Type guard to differentiate between ProcessedBP and ProcessedBS
const isProcessedBP = (row: ProcessedBP | ProcessedBS): row is ProcessedBP => {
  return 'systolic' in row;
};

// Styled Avatar for status indicators
interface StyledAvatarProps {
  bgcolor: string;
}

const StatusCircle = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'bgcolor',
})<StyledAvatarProps>(({ bgcolor }) => ({
  backgroundColor: bgcolor,
  width: 60,
  height: 60,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.8rem',
}));

// Render functions using centralized status info
const renderBloodPressureRow = (
  row: ProcessedBP,
  formatDateTime: (isoString: string) => { date: string; time: string }
) => {
  const { date, time } = formatDateTime(row.date);

  return (
    <>
      <TableCell align='center'>
        <StatusCircle bgcolor={row.color}>
          <Typography variant='subtitle2'>{row.systolic}</Typography>
          <Box
            sx={{
              width: '80%',
              height: '1px',
              backgroundColor: '#fff',
              marginY: '2px',
            }}
          />
          <Typography variant='subtitle2'>{row.diastolic}</Typography>
        </StatusCircle>
      </TableCell>
      <TableCell>
        <Typography variant='subtitle1' color='textPrimary'>
          {row.status}
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          {date} {time}
          {row.pulse !== null && ` | ${row.pulse} bpm`}
        </Typography>
      </TableCell>
    </>
  );
};
// Continue of src/components/HistoryTable.tsx

const renderBloodSugarRow = (
  row: ProcessedBS,
  formatDateTime: (isoString: string) => { date: string; time: string }
) => {
  const { date, time } = formatDateTime(row.date);

  return (
    <>
      <TableCell align='center'>
        <StatusCircle bgcolor={row.color}>
          <Typography variant='subtitle2'>{row.level}</Typography>
        </StatusCircle>
      </TableCell>
      <TableCell>
        <Typography variant='subtitle1' color='textPrimary'>
          {row.status}
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          {date} {time}
        </Typography>
      </TableCell>
    </>
  );
};

const HistoryTable: React.FC<HistoryTableProps> = ({ type, title }) => {
  const { readings, loading, error } = useUserData();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);

  const handleOpenCalendar = () => {
    setOpenCalendar(true);
  };

  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setPage(0);
  };

  const handleResetFilters = () => {
    setStatusFilter('Tất cả');
    setSelectedDate(null);
    setPage(0);
  };

  // Derive status options based on centralized data
  const statusOptions = useMemo(() => {
    if (type === 'bloodPressure') {
      return ['Tất cả', ...bloodPressureFilterableStatusLabels];
    } else if (type === 'bloodSugar') {
      return ['Tất cả', ...bloodSugarFilterableStatusLabels];
    }
    return ['Tất cả'];
  }, [type]);

  // Processed data using centralized utility functions
  const dataWithStatus = useMemo(() => {
    if (type === 'bloodPressure') {
      return (
        readings.bloodPressure?.map((reading: BloodPressureReading) => {
          const category = getBloodPressureCategory(
            reading.value.systolic,
            reading.value.diastolic
          );
          const statusInfo = getBloodPressureStatusInfo(category);

          return {
            ...reading,
            systolic: reading.value.systolic,
            diastolic: reading.value.diastolic,
            pulse: reading.value.pulse ?? null,
            status: statusInfo?.status ?? 'Unknown', // Provide default
            color: statusInfo?.color ?? 'grey', // Provide default
          } as ProcessedBP;
        }) || []
      );
    } else if (type === 'bloodSugar') {
      return (
        readings.bloodSugar?.map((reading: BloodSugarReading) => {
          const category = getBloodSugarCategory(reading.value.level);
          const statusInfo = getBloodSugarStatusInfo(category);

          return {
            ...reading,
            level: reading.value.level,
            status: statusInfo?.status ?? 'Unknown', // Provide default
            color: statusInfo?.color ?? 'grey', // Provide default
          } as ProcessedBS;
        }) || []
      );
    }
    return [];
  }, [readings, type]);

  const filteredByStatus = useMemo(() => {
    if (statusFilter === 'Tất cả') {
      return dataWithStatus;
    }
    return dataWithStatus.filter((row) => row.status === statusFilter);
  }, [dataWithStatus, statusFilter]);

  const filteredByDate = useMemo(() => {
    if (!selectedDate) {
      return filteredByStatus;
    }
    const selectedDateString = selectedDate.toDateString();
    return filteredByStatus.filter((row) => {
      return row.recordedAt
        ? row.recordedAt.toDateString() === selectedDateString
        : false;
    });
  }, [filteredByStatus, selectedDate]);

  const filteredData = useMemo(() => {
    if (type === 'bloodPressure') {
      return filteredByDate.filter(isProcessedBP) as ProcessedBP[];
    } else if (type === 'bloodSugar') {
      return filteredByDate.filter(
        (row): row is ProcessedBS => !isProcessedBP(row)
      );
    }
    return [];
  }, [filteredByDate, type]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  const formatDateTime = (
    isoString: string
  ): { date: string; time: string } => {
    const dateObj = new Date(isoString);
    const formattedDate = `${String(dateObj.getDate()).padStart(
      2,
      '0'
    )}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    const formattedTime = `${String(dateObj.getHours()).padStart(
      2,
      '0'
    )}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
    return { date: formattedDate, time: formattedTime };
  };

  const markedDates = useMemo(() => {
    return dataWithStatus
      .filter((row: ProcessedBP | ProcessedBS) => row.recordedAt)
      .map((row: ProcessedBP | ProcessedBS) => row.recordedAt as Date);
  }, [dataWithStatus]);

  return (
    <Box p={2}>
      {/* Title */}
      <Typography variant='h6' gutterBottom>
        {title}
      </Typography>

      {/* Filters */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems='center'>
          {/* Status Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl
              variant='outlined'
              size='small'
              fullWidth
              sx={{
                minWidth: 200,
              }}
            >
              <InputLabel id='status-filter-label'>Trạng thái</InputLabel>
              <Select
                labelId='status-filter-label'
                id='status-filter'
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                label='Trạng thái'
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Calendar Button */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title='Chọn ngày'>
              <IconButton
                color='primary'
                onClick={handleOpenCalendar}
                aria-label='Open Calendar'
                size='large'
                sx={{
                  border: `1px solid #81c784`,
                  borderRadius: 1,
                  padding: '8px',
                  width: '100%',
                  justifyContent: 'flex-start',
                }}
              >
                <CalendarTodayIcon sx={{ marginRight: 1 }} />
                <Typography variant='body2'>Chọn ngày</Typography>
              </IconButton>
            </Tooltip>
          </Grid>

          {/* Reset Filters Button */}
          <Grid item xs={12} sm={12} md={2}>
            <Tooltip title='Bỏ lọc'>
              <Button
                variant='outlined'
                color='secondary'
                onClick={handleResetFilters}
                startIcon={<RestoreIcon />}
                fullWidth
                disabled={statusFilter === 'Tất cả' && !selectedDate}
                sx={{
                  height: '100%',
                }}
              >
                Bỏ lọc
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      {/* Content */}
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
      ) : filteredData.length === 0 ? (
        <Typography>
          Không có dữ liệu{' '}
          {type === 'bloodPressure' ? 'huyết áp' : 'đường huyết'}{' '}
          {selectedDate
            ? `với trạng thái "${statusFilter}" cho ngày đã chọn`
            : `với trạng thái "${statusFilter}"`}
          .
        </Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table aria-labelledby='tableTitle' size='medium'>
              <TableHead>
                <TableRow>
                  {type === 'bloodPressure' ? (
                    <>
                      <TableCell align='center'>Huyết áp</TableCell>
                      <TableCell>Trạng thái &amp; Thời gian</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align='center'>Đường huyết</TableCell>
                      <TableCell>Trạng thái &amp; Thời gian</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow hover key={row.id}>
                    {type === 'bloodPressure'
                      ? renderBloodPressureRow(
                          row as ProcessedBP,
                          formatDateTime
                        )
                      : renderBloodSugarRow(row as ProcessedBS, formatDateTime)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage='Trang'
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`
            }
          />
        </Paper>
      )}

      {/* Calendar Modal */}
      <CalendarModal
        open={openCalendar}
        onClose={handleCloseCalendar}
        onDateSelect={handleDateSelect}
        markedDates={markedDates}
      />
    </Box>
  );
};

export default HistoryTable;
