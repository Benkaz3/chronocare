import React from 'react';
import { Button, CircularProgress, ButtonProps } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TableChartIcon from '@mui/icons-material/TableChart';

interface DownloadButtonProps extends ButtonProps {
  loading?: boolean;
  downloadType: 'pdf' | 'json' | 'csv'; // Made required for better enforcement
  onDownload: (type: 'pdf' | 'json' | 'csv') => void;
}

const getIcon = (type: 'pdf' | 'json' | 'csv'): React.ReactElement => {
  switch (type) {
    case 'pdf':
      return <DownloadIcon />;
    case 'json':
      return <InsertDriveFileIcon />;
    case 'csv':
      return <TableChartIcon />;
    default:
      return <DownloadIcon />;
  }
};

const DownloadButton: React.FC<DownloadButtonProps> = ({
  loading = false,
  downloadType = 'pdf',
  startIcon,
  onDownload,
  children,
  ...props
}) => {
  const handleClick = () => {
    if (onDownload && downloadType) {
      onDownload(downloadType);
    }
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      startIcon={
        loading ? (
          <CircularProgress size={24} color='inherit' />
        ) : (
          startIcon || getIcon(downloadType)
        )
      }
      disabled={loading || props.disabled}
      aria-label={`Download ${downloadType.toUpperCase()}`}
    >
      {children || `Download ${downloadType.toUpperCase()}`}
    </Button>
  );
};

export default React.memo(DownloadButton);
