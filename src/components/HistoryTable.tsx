// src/components/HistoryTable.tsx

import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  TableSortLabel,
  TablePagination,
  Box,
} from '@mui/material';
import useUserData from '../hooks/useUserData';

type Order = 'asc' | 'desc';

interface HistoryTableProps {
  type: 'bloodPressure' | 'bloodSugar';
  title: string;
}

interface EnhancedTableProps {
  headCells: {
    id: string;
    label: string;
    numeric: boolean;
  }[];
  order: Order;
  orderBy: OrderByKeys;
  onRequestSort: (property: OrderByKeys) => void;
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

type OrderByKeys = 'date' | 'systolic' | 'diastolic' | 'pulse' | 'level';

const EnhancedTableHead: React.FC<EnhancedTableProps> = ({
  headCells,
  order,
  orderBy,
  onRequestSort,
}) => {
  const createSortHandler = (property: OrderByKeys) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id as OrderByKeys)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={{ display: 'none' }}>
                  {order === 'desc'
                    ? 'được sắp xếp giảm dần'
                    : 'được sắp xếp tăng dần'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

interface ProcessedBP extends BloodPressureReading {
  systolic: number;
  diastolic: number;
  pulse: number | string;
}

interface ProcessedBS extends BloodSugarReading {
  level: number;
}

const isProcessedBP = (row: ProcessedBP | ProcessedBS): row is ProcessedBP => {
  return (row as ProcessedBP).systolic !== undefined;
};

const HistoryTable: React.FC<HistoryTableProps> = ({ type, title }) => {
  const { readings, loading, error } = useUserData();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderByKeys>('date');

  const handleRequestSort = (property: OrderByKeys) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle Pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const data = useMemo(() => {
    if (type === 'bloodPressure') {
      return readings.bloodPressure.map((reading: BloodPressureReading) => ({
        ...reading,
        systolic: reading.value.systolic,
        diastolic: reading.value.diastolic,
        pulse: reading.value.pulse !== undefined ? reading.value.pulse : 'N/A',
      })) as ProcessedBP[];
    } else if (type === 'bloodSugar') {
      return readings.bloodSugar.map((reading: BloodSugarReading) => ({
        ...reading,
        level: reading.value.level,
      })) as ProcessedBS[];
    }
    return [];
  }, [readings, type]);

  const stableSort = <T,>(
    array: T[],
    comparator: (a: T, b: T) => number
  ): T[] => {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const orderComp = comparator(a[0], b[0]);
      if (orderComp !== 0) return orderComp;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (
    order: Order,
    orderBy: OrderByKeys
  ): ((
    a: ProcessedBP | ProcessedBS,
    b: ProcessedBP | ProcessedBS
  ) => number) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (
    a: ProcessedBP | ProcessedBS,
    b: ProcessedBP | ProcessedBS,
    orderBy: OrderByKeys
  ): number => {
    if (orderBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (orderBy === 'systolic') {
      if (isProcessedBP(a) && isProcessedBP(b)) {
        return (b.systolic as number) - (a.systolic as number);
      }
    }
    if (orderBy === 'diastolic') {
      if (isProcessedBP(a) && isProcessedBP(b)) {
        return (b.diastolic as number) - (a.diastolic as number);
      }
    }
    if (orderBy === 'pulse') {
      if (isProcessedBP(a) && isProcessedBP(b)) {
        const aPulse = typeof a.pulse === 'number' ? a.pulse : 0;
        const bPulse = typeof b.pulse === 'number' ? b.pulse : 0;
        return bPulse - aPulse;
      }
    }
    if (orderBy === 'level') {
      if ('level' in a && 'level' in b) {
        return (b.level as number) - (a.level as number);
      }
    }
    return 0;
  };

  const headCells = useMemo(() => {
    if (type === 'bloodPressure') {
      return [
        { id: 'date', label: 'Ngày & Giờ', numeric: false },
        { id: 'systolic', label: 'Tâm thu (mm Hg)', numeric: true },
        { id: 'diastolic', label: 'Tâm trương (mm Hg)', numeric: true },
        { id: 'pulse', label: 'Nhịp tim (BPM)', numeric: true },
      ];
    } else if (type === 'bloodSugar') {
      return [
        { id: 'date', label: 'Ngày & Giờ', numeric: false },
        { id: 'level', label: 'Mức đường huyết (mg/dL)', numeric: true },
      ];
    }
    return [];
  }, [type]);

  const sortedData = useMemo(() => {
    return stableSort(data, getComparator(order, orderBy));
  }, [data, order, orderBy]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedData, page, rowsPerPage]);

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN');
  };

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        {title}
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
      ) : data.length === 0 ? (
        <Typography>
          Không có dữ liệu{' '}
          {type === 'bloodPressure' ? 'huyết áp' : 'đường huyết'}.
        </Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table aria-labelledby='tableTitle' size='medium'>
              <EnhancedTableHead
                headCells={headCells}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell component='th' scope='row'>
                      {formatDate(row.date)}
                    </TableCell>
                    {type === 'bloodPressure' ? (
                      isProcessedBP(row) ? (
                        <>
                          <TableCell align='right'>{row.systolic}</TableCell>
                          <TableCell align='right'>{row.diastolic}</TableCell>
                          <TableCell align='right'>{row.pulse}</TableCell>
                        </>
                      ) : null
                    ) : (
                      'level' in row && (
                        <TableCell align='right'>{row.level}</TableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={sortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage='Số hàng mỗi trang'
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`
            }
          />
        </Paper>
      )}
    </Box>
  );
};

export default HistoryTable;
