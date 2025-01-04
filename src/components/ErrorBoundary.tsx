import { Component, ReactNode, ErrorInfo } from 'react';
import { Typography, Button, Box } from '@mui/material';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          height='100vh'
          textAlign='center'
          padding={2}
          bgcolor='#f5f5f5' // Optional: Background color for better visibility
        >
          <Typography variant='h4' gutterBottom color='error'>
            Bị lỗi òi! Có gì đó sai sai!
          </Typography>
          <Typography variant='body1' gutterBottom>
            Bị lỗi òi! Thử tải lại coi sao...
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={this.handleReload}
            sx={{ padding: '0.825rem' }}
          >
            Tải lại trang
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
