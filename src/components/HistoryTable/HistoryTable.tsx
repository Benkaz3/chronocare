// src/components/HistoryTable/HistoryTable.tsx

import React, { useMemo, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import useUserData from '../../hooks/useUserData';
import CalendarModal from '../CalendarModal';
import EditEntryModal from './EditEntryModal'; // New import

// Import centralized data and utility functions
import {
  getBloodPressureCategory,
  getBloodPressureStatusInfo,
  bloodPressureFilterableStatusLabels,
} from '../../data/bloodPressure';
import {
  getBloodSugarCategory,
  getBloodSugarStatusInfo,
  bloodSugarFilterableStatusLabels,
} from '../../data/bloodSugar';

// Import smaller components
import Filters from './Filters';
import BloodPressureRow from './BloodPressureRow';
import BloodSugarRow from './BloodSugarRow';
import PaginationControls from './PaginationControls';
import NoDataMessage from './NoDataMessage';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

// Import types
import {
  HistoryTableProps,
  ProcessedBP,
  ProcessedBS,
  BloodPressureDataRead,
  BloodSugarDataRead,
} from '../../types';

// Type guard to differentiate between ProcessedBP and ProcessedBS
const isProcessedBP = (row: ProcessedBP | ProcessedBS): row is ProcessedBP => {
  return 'systolic' in row;
};

const HistoryTable: React.FC<HistoryTableProps> = ({ type, title }) => {
  const { readings, loading, error, updateReading } = useUserData();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);

  // State for edit modal
  const [selectedEntry, setSelectedEntry] = useState<
    ProcessedBP | ProcessedBS | null
  >(null);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  // Handlers for calendar modal
  const handleOpenCalendar = useCallback(() => {
    setOpenCalendar(true);
  }, []);

  const handleCloseCalendar = useCallback(() => {
    setOpenCalendar(false);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setPage(0);
  }, []);

  const handleResetFilters = useCallback(() => {
    setStatusFilter('Tất cả');
    setSelectedDate(null);
    setPage(0);
  }, []);

  // Handlers for edit modal
  const handleOpenEditModal = useCallback(
    (entry: ProcessedBP | ProcessedBS) => {
      setSelectedEntry(entry);
      setOpenEditModal(true);
    },
    []
  );

  const handleCloseEditModal = useCallback(() => {
    setSelectedEntry(null);
    setOpenEditModal(false);
  }, []);

  // Handler for saving edited entry
  const handleSaveEntry = useCallback(
    async (updatedEntry: ProcessedBP | ProcessedBS) => {
      if (!selectedEntry) return;

      try {
        if (isProcessedBP(updatedEntry)) {
          await updateReading('bloodPressure', updatedEntry.id, {
            systolic: updatedEntry.systolic,
            diastolic: updatedEntry.diastolic,
            pulse: updatedEntry.pulse,
            time: updatedEntry.time,
            recordedAt: updatedEntry.recordedAt,
          });
        } else {
          await updateReading('bloodSugar', updatedEntry.id, {
            level: updatedEntry.level,
            time: updatedEntry.time,
            recordedAt: updatedEntry.recordedAt,
          });
        }
        handleCloseEditModal();
      } catch (err) {
        console.error('Error saving entry:', err);
      }
    },
    [selectedEntry, updateReading, handleCloseEditModal]
  );

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
        readings.bloodPressure?.map((reading: BloodPressureDataRead) => {
          const category = getBloodPressureCategory(
            reading.systolic,
            reading.diastolic
          );
          const statusInfo = getBloodPressureStatusInfo(category);

          return {
            ...reading,
            status: statusInfo?.status ?? 'Unknown',
            color: statusInfo?.color ?? 'grey',
          } as ProcessedBP;
        }) || []
      );
    } else if (type === 'bloodSugar') {
      return (
        readings.bloodSugar?.map((reading: BloodSugarDataRead) => {
          const category = getBloodSugarCategory(reading.level);
          const statusInfo = getBloodSugarStatusInfo(category);

          return {
            ...reading,
            status: statusInfo?.status ?? 'Unknown',
            color: statusInfo?.color ?? 'grey',
          } as ProcessedBS;
        }) || []
      );
    }
    return [];
  }, [readings, type]);

  // Apply status filter
  const filteredByStatus = useMemo(() => {
    if (statusFilter === 'Tất cả') {
      return dataWithStatus;
    }
    return dataWithStatus.filter((row) => row.status === statusFilter);
  }, [dataWithStatus, statusFilter]);

  // Apply date filter
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

  // Final filtered data based on type
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

  // Paginated data
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  // Date formatting function
  const formatDateTime = useCallback(
    (recordedAt: Date | null): { date: string; time: string } => {
      if (!recordedAt) {
        return { date: '', time: '' };
      }
      const dateObj = new Date(recordedAt);
      const formattedDate = `${String(dateObj.getDate()).padStart(
        2,
        '0'
      )}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      const formattedTime = `${String(dateObj.getHours()).padStart(
        2,
        '0'
      )}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
      return { date: formattedDate, time: formattedTime };
    },
    []
  );

  // Gather marked dates for the calendar
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
      <Filters
        statusFilter={statusFilter}
        setStatusFilter={(value) => {
          setStatusFilter(value);
          setPage(0);
        }}
        statusOptions={statusOptions}
        handleOpenCalendar={handleOpenCalendar}
        handleResetFilters={handleResetFilters}
        selectedDate={selectedDate}
      />

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorAlert error={error} />
      ) : filteredData.length === 0 ? (
        <NoDataMessage
          type={type}
          statusFilter={statusFilter}
          selectedDate={selectedDate}
        />
      ) : (
        <Paper>
          <TableContainer>
            <Table aria-labelledby='tableTitle' size='medium'>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    onClick={() => handleOpenEditModal(row)}
                    style={{ cursor: 'pointer' }}
                  >
                    {type === 'bloodPressure' ? (
                      <BloodPressureRow
                        row={row as ProcessedBP}
                        formatDateTime={formatDateTime}
                      />
                    ) : (
                      <BloodSugarRow
                        row={row as ProcessedBS}
                        formatDateTime={formatDateTime}
                      />
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <PaginationControls
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
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

      {/* Edit Entry Modal */}
      {selectedEntry && (
        <EditEntryModal
          open={openEditModal}
          onClose={handleCloseEditModal}
          entry={selectedEntry}
          onSave={handleSaveEntry}
        />
      )}
    </Box>
  );
};

export default HistoryTable;
