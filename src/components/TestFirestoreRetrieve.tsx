import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { getBloodPressureData, BloodPressureData } from '../firebase'; // Ensure this path is correct

const TestFirestoreRetrieve: React.FC = () => {
  const [data, setData] = useState<BloodPressureData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const retrievedData = await getBloodPressureData();
        setData(retrievedData);
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant='h5'>Fetched Blood Pressure Data:</Typography>
      {data.length === 0 ? (
        <Typography>No data available.</Typography>
      ) : (
        data.map((entry, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant='body1'>
              Systolic: {entry.systolic}, Diastolic: {entry.diastolic}, Pulse:{' '}
              {entry.pulse}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Time: {new Date(entry.time).toLocaleString()}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default TestFirestoreRetrieve;
