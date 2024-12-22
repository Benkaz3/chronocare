import React from 'react';
import { Button } from '@mui/material';
import { addBloodPressureData } from '../firebase'; // Ensure this path is correct

const TestFirestoreAdd: React.FC = () => {
  const handleAddData = async () => {
    try {
      await addBloodPressureData({
        systolic: 120,
        diastolic: 80,
        pulse: 70,
        time: new Date().toISOString(),
      });
      console.log('Data added successfully');
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  return (
    <Button onClick={handleAddData} variant='contained' color='primary'>
      Add Test Data
    </Button>
  );
};

export default TestFirestoreAdd;
