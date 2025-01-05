// src/components/HistoryTable/NoDataMessage.tsx

import React from 'react';
import { Typography } from '@mui/material';

interface NoDataMessageProps {
  type: 'bloodPressure' | 'bloodSugar';
  statusFilter: string;
  selectedDate: Date | null;
}

const NoDataMessage: React.FC<NoDataMessageProps> = ({
  type,
  statusFilter,
  selectedDate,
}) => {
  return (
    <Typography>
      Không có dữ liệu {type === 'bloodPressure' ? 'huyết áp' : 'đường huyết'}{' '}
      {selectedDate
        ? `với trạng thái "${statusFilter}" cho ngày đã chọn`
        : `với trạng thái "${statusFilter}"`}
      .
    </Typography>
  );
};

export default React.memo(NoDataMessage);
