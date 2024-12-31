import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  markedDates: Date[];
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  open,
  onClose,
  onDateSelect,
  markedDates,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else {
      setSelectedDate(null);
    }
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
      onClose();
      setSelectedDate(null);
    }
  };

  const handleCancel = () => {
    onClose();
    setSelectedDate(null);
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const formattedDate = date.toDateString();
      return markedDates.some(
        (markedDate) => markedDate.toDateString() === formattedDate
      )
        ? 'highlight'
        : '';
    }
    return '';
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullScreen={fullScreen}
      aria-labelledby='calendar-dialog-title'
    >
      <DialogTitle id='calendar-dialog-title'>Chọn Ngày</DialogTitle>
      <DialogContent>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          selectRange={false}
          locale='vi-VN'
          tileClassName={tileClassName}
          maxDate={new Date()} // Restrict to past dates
        />
        <Box
          display='flex'
          justifyContent='end'
          mt={2} // Add margin-top for spacing
          gap={1}
        >
          <Button
            onClick={handleCancel}
            color='secondary'
            variant='outlined'
            sx={{ minWidth: 100 }} // Set a minimum width
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            color='primary'
            variant='contained'
            disabled={!selectedDate}
            sx={{ minWidth: 100 }} // Set a minimum width
          >
            Chọn
          </Button>
        </Box>
      </DialogContent>
      <style>
        {`
    .react-calendar {
      width: 100%;
      border: none;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.125em;
      background-color: ${theme.palette.background.paper};
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 15px;
      transition: all 0.3s ease;
    }
    .react-calendar__navigation button {
      color: ${theme.palette.primary.main};
      min-width: 44px;
      background: none;
      font-size: 16px;
      margin-top: 8px;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
      background-color: ${theme.palette.action.hover};
      border-radius: 6px;
      color: ${theme.palette.primary.dark};
    }
    .react-calendar__month-view__weekdays {
      text-align: center;
      font-weight: 600;
      color: ${theme.palette.text.secondary};
    }
    .react-calendar__tile {
      width: 40px;
      height: 40px;
      margin: 2px 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      text-align: center;
      line-height: 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: border-color 0.3s ease, color 0.3s ease;
    }
    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
      border: 1px solid ${theme.palette.primary.light};
      color: ${theme.palette.text.primary};
    }
    .react-calendar__tile--now {
      border: 1px solid ${theme.palette.info.main};
      color: ${theme.palette.info.dark};
      border-radius: 8px;
      font-weight: bold;
    }
    .react-calendar__tile--now:enabled:hover,
    .react-calendar__tile--now:enabled:focus {
      border-color: ${theme.palette.info.dark};
      color: ${theme.palette.info.main};
    }
    .react-calendar__tile--active {
      background-color: ${theme.palette.primary.main};
      color: ${theme.palette.primary.contrastText};
      border-radius: 8px;
      font-weight: bold;
    }
    .react-calendar__tile--active:enabled:hover,
    .react-calendar__tile--active:enabled:focus {
      background-color: ${theme.palette.primary.dark};
      color: ${theme.palette.primary.contrastText};
    }
    .react-calendar__tile--disabled {
      color: ${theme.palette.text.disabled};
      cursor: not-allowed;
    }
    .react-calendar__tile.highlight {
      border: 1px solid ${theme.palette.secondary.main};
      color: ${theme.palette.secondary.dark};
      border-radius: 8px;
      font-weight: 600;
      transition: border-color 0.3s ease, color 0.3s ease;
    }
    .react-calendar__tile.highlight:enabled:hover,
    .react-calendar__tile.highlight:enabled:focus {
      border-color: ${theme.palette.secondary.dark};
      color: ${theme.palette.secondary.main};
    }
  `}
      </style>
    </Dialog>
  );
};

export default CalendarModal;
