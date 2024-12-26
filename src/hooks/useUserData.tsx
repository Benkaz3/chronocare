import { useState, useEffect, useCallback } from 'react';
import {
  addBloodPressureData,
  addBloodSugarData,
  getBloodPressureData,
  getBloodSugarData,
} from '../firebase';
import { BloodPressureData, BloodSugarData } from '../firebase';

type Reading = {
  id: string;
  value: any;
  date: string;
};

interface Readings {
  bloodPressure: Reading[];
  bloodSugar: Reading[];
}

interface UseUserData {
  readings: Readings;
  loading: boolean;
  error: string | null;
  fetchReadings: () => void;
  addReading: (type: 'bloodPressure' | 'bloodSugar', data: any) => void;
}

const useUserData = (): UseUserData => {
  const [readings, setReadings] = useState<Readings>({
    bloodPressure: [],
    bloodSugar: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Readings from Firestore
  const fetchReadings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const bpData = await getBloodPressureData();
      const bsData = await getBloodSugarData();

      const formattedBPData: Reading[] = bpData.map((item, index) => ({
        id: `bp-${index}`,
        value: {
          systolic: item.systolic,
          diastolic: item.diastolic,
          pulse: item.pulse || 'N/A', // Assuming pulse might be optional
        },
        date: item.time,
      }));

      const formattedBSData: Reading[] = bsData.map((item, index) => ({
        id: `bs-${index}`,
        value: { level: item.level },
        date: item.time,
      }));

      setReadings({
        bloodPressure: formattedBPData,
        bloodSugar: formattedBSData,
      });
    } catch (err: any) {
      console.error('Error fetching readings:', err);
      setError('Failed to fetch readings.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new reading to Firestore
  const addReading = useCallback(
    async (type: 'bloodPressure' | 'bloodSugar', data: any) => {
      setLoading(true);
      setError(null);
      try {
        if (type === 'bloodPressure') {
          await addBloodPressureData(data as BloodPressureData);
          // After adding, fetch the updated list
          await fetchReadings();
        } else if (type === 'bloodSugar') {
          await addBloodSugarData(data as BloodSugarData);
          // After adding, fetch the updated list
          await fetchReadings();
        }
      } catch (err: any) {
        console.error(`Error adding ${type} reading:`, err);
        setError(`Failed to add ${type} reading.`);
      } finally {
        setLoading(false);
      }
    },
    [fetchReadings]
  );

  // Optionally, fetch readings on hook mount
  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  return { readings, loading, error, fetchReadings, addReading };
};

export default useUserData;
