// src/components/PaginationControls.tsx

import React from 'react';
import { TablePagination } from '@mui/material';

interface PaginationControlsProps {
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component='div'
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage='Trang'
      labelDisplayedRows={({ from, to, count }) =>
        `${from}-${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`
      }
    />
  );
};

export default React.memo(PaginationControls);
