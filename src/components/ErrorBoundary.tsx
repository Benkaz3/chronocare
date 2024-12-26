// src/components/ErrorBoundary.tsx

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
        >
          <Typography variant='h4' gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography variant='body1' gutterBottom>
            An unexpected error has occurred. Please try reloading the page.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={this.handleReload}
          >
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;