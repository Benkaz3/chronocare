import React from 'react';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RestoreIcon from '@mui/icons-material/Restore';

interface FiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  statusOptions: string[];
  handleOpenCalendar: () => void;
  handleResetFilters: () => void;
  selectedDate: Date | null;
}

const Filters: React.FC<FiltersProps> = ({
  statusFilter,
  setStatusFilter,
  statusOptions,
  handleOpenCalendar,
  handleResetFilters,
  selectedDate,
}) => {
  return (
    <Box mb={3}>
      <Grid container spacing={2} alignItems='center'>
        {/* Status Filter */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <FormControl
            variant='outlined'
            size='small'
            fullWidth
            // sx={{
            //   minWidth: 200,
            // }}
          >
            <InputLabel id='status-filter-label'>Trạng thái</InputLabel>
            <Select
              labelId='status-filter-label'
              id='status-filter'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
        <Grid item xs={12} sm={6} md={3} lg={3}>
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
              <Box
                component='span'
                sx={{ flexGrow: 1, fontSize: '0.875rem', textAlign: 'left' }}
              >
                Chọn ngày
              </Box>
              {selectedDate && (
                <Box
                  component='span'
                  sx={{ fontSize: '0.8rem', color: '#555' }}
                >
                  {`${selectedDate.getDate()}/${selectedDate.getMonth() + 1}`}
                </Box>
              )}
            </IconButton>
          </Tooltip>
        </Grid>

        {/* Reset Filters Button */}
        <Grid item xs={12} sm={12} md={4} lg={4}>
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
                paddingLeft: 2, // Add padding to the left
                paddingRight: 2, // Add padding to the right
              }}
            >
              Bỏ lọc
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(Filters);
