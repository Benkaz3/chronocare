import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      navigate('/'); // Redirect to homepage after signing out
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
        color: 'var(--primary)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <svg
          viewBox='0 0 24 24'
          fill='currentColor'
          xmlns='http://www.w3.org/2000/svg'
          style={{ width: 60, height: 60, marginRight: 8 }}
        >
          <path d='M2.34594 11.2501C2.12458 10.5866 2 9.92019 2 9.26044C2 3.3495 7.50016 0.662637 12 5.49877C16.4998 0.662637 22 3.34931 22 9.2604C22 9.92017 21.8754 10.5866 21.6541 11.2501H18.6361L18.5241 11.25C17.9784 11.2491 17.4937 11.2483 17.0527 11.4447C16.6116 11.6411 16.2879 12.002 15.9233 12.4084L15.8485 12.4918L14.8192 13.6354C14.7426 13.7205 14.68 13.79 14.6247 13.8493C14.5723 13.7879 14.5128 13.7159 14.4401 13.6277L10.8889 9.32318C10.7493 9.15391 10.6 8.97281 10.454 8.8384C10.2839 8.68188 10.0325 8.50581 9.68096 8.4847C9.32945 8.46359 9.05875 8.60829 8.87115 8.74333C8.71006 8.8593 8.54016 9.02123 8.38136 9.17258L6.85172 10.6294C6.37995 11.0787 6.28151 11.1553 6.17854 11.1964C6.07557 11.2376 5.9515 11.2501 5.3 11.2501H2.34594Z' />
          <path d='M3.00441 12.7501C4.38539 15.312 6.93029 17.7142 8.96173 19.3707C10.2937 20.4569 10.9597 21 12 21C13.0403 21 13.7063 20.4569 15.0383 19.3707C17.0697 17.7142 19.6146 15.312 20.9956 12.7501H18.6361C17.9119 12.7501 17.7746 12.7652 17.6629 12.815C17.5513 12.8647 17.4481 12.9567 16.9634 13.4952L15.9086 14.6672C15.7507 14.8428 15.5839 15.0283 15.4235 15.1628C15.2384 15.318 14.9627 15.4921 14.5896 15.4841C14.2166 15.476 13.9488 15.2904 13.7704 15.1274C13.616 14.9862 13.4574 14.7938 13.3074 14.6118L9.75487 10.3057C9.68734 10.2239 9.63239 10.1573 9.5839 10.1005C9.52897 10.1511 9.46645 10.2106 9.38961 10.2838L7.81346 11.785C7.4575 12.125 7.14165 12.4267 6.73563 12.5892C6.32961 12.7516 5.89282 12.7509 5.40054 12.7502L3.00441 12.7501Z' />
        </svg>
        <Typography
          variant='h5'
          sx={{
            fontFamily: 'Playfair, serif',
            fontWeight: 900,
            color: 'inherit',
            textAlign: 'center',
          }}
        >
          ChronoCare
        </Typography>
      </Box>
      <Button
        onClick={handleSignOut}
        sx={{
          backgroundColor: 'white',
          border: '1px solid #dadce0',
          borderRadius: '9999px',
          padding: '4px 16px',
          '&:hover': { backgroundColor: '#f8f9fa' },
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default Header;