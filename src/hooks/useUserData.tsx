import { useState, useEffect, useCallback } from 'react';
import {
  addBloodPressureData,
  addBloodSugarData,
  getBloodPressureData,
  getBloodSugarData,
  updateBloodPressureData,
  updateBloodSugarData,
  BloodPressureData,
  BloodSugarData,
  BloodPressureDataRead,
  BloodSugarDataRead,
} from '../firebase';

/* Removed the generic Reading type and using specific types instead */

interface Readings {
  bloodPressure: BloodPressureDataRead[];
  bloodSugar: BloodSugarDataRead[];
}

interface UseUserData {
  readings: Readings;
  loading: boolean;
  error: string | null;
  fetchReadings: () => void;
  addReading: (type: 'bloodPressure' | 'bloodSugar', data: any) => void;
  updateReading: (
    type: 'bloodPressure' | 'bloodSugar',
    docId: string,
    data: any
  ) => void;
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

      setReadings({
        bloodPressure: bpData,
        bloodSugar: bsData,
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

  // Update an existing reading in Firestore
  const updateReading = useCallback(
    async (type: 'bloodPressure' | 'bloodSugar', docId: string, data: any) => {
      setLoading(true);
      setError(null);
      try {
        if (type === 'bloodPressure') {
          await updateBloodPressureData(
            docId,
            data as Partial<BloodPressureData>
          );
        } else if (type === 'bloodSugar') {
          await updateBloodSugarData(docId, data as Partial<BloodSugarData>);
        }
        // After updating, fetch the updated list
        await fetchReadings();
      } catch (err: any) {
        console.error(`Error updating ${type} reading:`, err);
        setError(`Failed to update ${type} reading.`);
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

  return { readings, loading, error, fetchReadings, addReading, updateReading };
};

export default useUserData;
