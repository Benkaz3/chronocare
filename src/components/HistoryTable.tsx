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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import useUserData from '../hooks/useUserData';
import CalendarModal from './CalendarModal';

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
}

interface BloodSugarReading {
  id: string;
  value: {
    level: number;
  };
  date: string;
}

interface ProcessedBP extends BloodPressureReading {
  systolic: number;
  diastolic: number;
  pulse: number | null;
  status: string;
}

interface ProcessedBS extends BloodSugarReading {
  level: number;
  status: string;
}

const isProcessedBP = (row: ProcessedBP | ProcessedBS): row is ProcessedBP => {
  return 'systolic' in row;
};

const getBPStatus = (
  systolic: number,
  diastolic: number
): { status: string; color: string } => {
  if (systolic < 120 && diastolic < 80) {
    return { status: 'Bình thường', color: '#4caf50' };
  } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
    return { status: 'Tăng nhẹ', color: '#e8cf51' };
  } else if (
    (systolic >= 130 && systolic < 140) ||
    (diastolic >= 80 && diastolic < 90)
  ) {
    return { status: 'Tăng huyết áp giai đoạn 1', color: '#ffa322' };
  } else if (systolic >= 140 || diastolic >= 90) {
    return { status: 'Tăng huyết áp giai đoạn 2', color: '#f44336' };
  } else {
    return { status: 'Không xác định', color: '#9e9e9e' };
  }
};

const getBSStatus = (level: number): { status: string; color: string } => {
  if (level < 70) {
    return { status: 'Thấp', color: '#2196f3' };
  } else if (level >= 70 && level <= 140) {
    return { status: 'Bình thường', color: '#4caf50' };
  } else if (level > 140 && level <= 180) {
    return { status: 'Cao', color: '#ff9800' };
  } else {
    return { status: 'Nguy kịch', color: '#f44336' };
  }
};

interface StyledAvatarProps {
  bgcolor: string;
}

const BPCircle = styled(Avatar, {
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

const BSCircle = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'bgcolor',
})<StyledAvatarProps>(({ bgcolor }) => ({
  backgroundColor: bgcolor,
  width: 60,
  height: 60,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.8rem',
}));

const renderBloodPressureRow = (
  row: ProcessedBP,
  formatDateTime: (isoString: string) => { date: string; time: string }
) => {
  const { status, color } = getBPStatus(row.systolic, row.diastolic);
  const { date, time } = formatDateTime(row.date);

  return (
    <>
      <TableCell align='center'>
        <BPCircle bgcolor={color}>
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
        </BPCircle>
      </TableCell>
      <TableCell>
        <Typography variant='subtitle1' color='textPrimary'>
          {status}
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          {date} {time}
          {row.pulse !== null && ` | ${row.pulse} bpm`}
        </Typography>
      </TableCell>
    </>
  );
};

const renderBloodSugarRow = (
  row: ProcessedBS,
  formatDateTime: (isoString: string) => { date: string; time: string }
) => {
  const { status, color } = getBSStatus(row.level);
  const { date, time } = formatDateTime(row.date);

  return (
    <>
      <TableCell align='center'>
        <BSCircle bgcolor={color}>
          <Typography variant='subtitle2'>{row.level}</Typography>
        </BSCircle>
      </TableCell>
      <TableCell>
        <Typography variant='subtitle1' color='textPrimary'>
          {status}
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

  const statusOptions = useMemo(() => {
    if (type === 'bloodPressure') {
      return [
        'Tất cả',
        'Bình thường',
        'Tăng nhẹ',
        'Tăng huyết áp giai đoạn 1',
        'Tăng huyết áp giai đoạn 2',
        'Không xác định',
      ];
    } else if (type === 'bloodSugar') {
      return ['Tất cả', 'Thấp', 'Bình thường', 'Cao', 'Nguy kịch'];
    }
    return ['Tất cả'];
  }, [type]);

  const dataWithStatus = useMemo(() => {
    if (type === 'bloodPressure') {
      return (
        (readings.bloodPressure?.map((reading: BloodPressureReading) => {
          const baseProcessed: Omit<ProcessedBP, 'status'> = {
            ...reading,
            systolic: reading.value.systolic,
            diastolic: reading.value.diastolic,
            pulse: reading.value.pulse ?? null,
          };

          const statusInfo = getBPStatus(
            baseProcessed.systolic,
            baseProcessed.diastolic
          );

          return { ...baseProcessed, status: statusInfo.status } as ProcessedBP;
        }) as ProcessedBP[]) || []
      );
    } else if (type === 'bloodSugar') {
      return (
        (readings.bloodSugar?.map((reading: BloodSugarReading) => {
          const baseProcessed: Omit<ProcessedBS, 'status'> = {
            ...reading,
            level: reading.value.level,
          };

          const statusInfo = getBSStatus(baseProcessed.level);

          return { ...baseProcessed, status: statusInfo.status } as ProcessedBS;
        }) as ProcessedBS[]) || []
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
      const rowDate = new Date(row.date).toDateString();
      return rowDate === selectedDateString;
    });
  }, [filteredByStatus, selectedDate]);

  const filteredData = useMemo(() => {
    // Use type guards to ensure data is of a single type
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
    return dataWithStatus.map((row) => new Date(row.date));
  }, [dataWithStatus]);

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        {title}
      </Typography>

      <Box mb={2} display='flex' alignItems='center' gap={2}>
        <FormControl variant='outlined' size='small'>
          <InputLabel id='status-filter-label'>Trạng thái</InputLabel>
          <Select
            labelId='status-filter-label'
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as string);
              setPage(0);
            }}
            label='Trạng thái'
            style={{ minWidth: 200 }}
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          color='primary'
          onClick={handleOpenCalendar}
          aria-label='Open Calendar'
        >
          <CalendarTodayIcon />
        </IconButton>
      </Box>

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
      ) : filteredByStatus.length === 0 ? (
        <Typography>
          Không có dữ liệu{' '}
          {type === 'bloodPressure' ? 'huyết áp' : 'đường huyết'} với trạng thái
          "{statusFilter}".
        </Typography>
      ) : filteredByDate.length === 0 ? (
        <Typography>
          Không có dữ liệu{' '}
          {type === 'bloodPressure' ? 'huyết áp' : 'đường huyết'} cho ngày đã
          chọn.
        </Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table aria-labelledby='tableTitle' size='medium'>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow hover key={row.id}>
                    {type === 'bloodPressure' && isProcessedBP(row)
                      ? renderBloodPressureRow(row, formatDateTime)
                      : type === 'bloodSugar' && 'level' in row
                      ? renderBloodSugarRow(row, formatDateTime)
                      : null}
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
            labelRowsPerPage=''
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`
            }
          />
        </Paper>
      )}

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
