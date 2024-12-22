import { initializeApp } from 'firebase/app';
import { getAuth, User } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  limit,
  FirestoreError,
} from 'firebase/firestore';

// Firebase configuration (replace these with your Firebase project credentials)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// TypeScript interface for blood pressure data
export interface BloodPressureData {
  systolic: number;
  diastolic: number;
  pulse: number;
  time: string;
  timestamp?: ReturnType<typeof serverTimestamp>;
}

// Function to add blood pressure data to Firestore
const addBloodPressureData = async (data: BloodPressureData): Promise<void> => {
  const user: User | null = auth.currentUser; // Get the currently authenticated user

  if (!user) {
    throw new Error('User not authenticated');
  }

  const userId = user.uid; // User's unique ID

  try {
    // Store the blood pressure data in a subcollection named 'bloodPressure' under the user's document
    const newData = { ...data, timestamp: serverTimestamp() };
    const docRef = await addDoc(
      collection(db, 'users', userId, 'bloodPressure'),
      newData
    );
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    const error = e as FirestoreError;
    console.error('Error adding document: ', error.message);
    throw new Error('Error adding document');
  }
};

// Function to fetch blood pressure data from Firestore
const getBloodPressureData = async (): Promise<BloodPressureData[]> => {
  const user: User | null = getAuth().currentUser;
  if (!user) {
    console.error('No user is logged in');
    return [];
  }

  const userId = user.uid;
  console.log('Fetching data for user ID:', userId);

  try {
    const q = query(
      collection(db, 'users', userId, 'bloodPressure'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    console.log('Query Snapshot Size:', querySnapshot.size);

    if (querySnapshot.empty) {
      console.log('No blood pressure data found.');
      return [];
    }

    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data() as BloodPressureData;
      console.log('Document Data:', docData);
      return docData;
    });

    return data;
  } catch (e) {
    const error = e as FirestoreError;
    console.error('Error fetching data: ', error.message);
    throw new Error('Error fetching data');
  }
};

export { auth, db, addBloodPressureData, getBloodPressureData };
