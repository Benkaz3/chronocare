// src/hooks/useAuth.ts

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthMessage {
  type: 'success' | 'error';
  text: React.ReactNode;
}

const useAuth = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<AuthMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAuthError = (err: any) => {
    console.error('Authentication Error:', err);
    if (err.code === 'auth/email-already-in-use') {
      setMessage({
        type: 'error',
        text: (
          <>
            Email is already in use. Please{' '}
            <button
              onClick={() => {
                setMessage(null);
                navigate('/login'); // Adjust the navigation as needed
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit',
              }}
            >
              log in
            </button>
            .
          </>
        ),
      });
    } else if (err.code === 'auth/invalid-email') {
      setMessage({ type: 'error', text: 'Invalid email address.' });
    } else if (err.code === 'auth/weak-password') {
      setMessage({
        type: 'error',
        text: 'Password is too weak. Please choose a stronger password.',
      });
    } else if (err.code === 'auth/user-not-found') {
      setMessage({
        type: 'error',
        text: 'No user found with this email.',
      });
    } else if (err.code === 'auth/wrong-password') {
      setMessage({
        type: 'error',
        text: 'Incorrect password.',
      });
    } else {
      setMessage({
        type: 'error',
        text: 'Authentication failed. Please try again.',
      });
    }
  };

  const signInWithProvider = async (
    provider: GoogleAuthProvider | TwitterAuthProvider,
    providerName: string
  ): Promise<UserCredential | null> => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      navigate('/dashboard'); // Redirect after successful sign-in
      return result;
    } catch (err: any) {
      console.error(`Error signing in with ${providerName}:`, err);
      setMessage({
        type: 'error',
        text: `Cannot sign in with ${providerName}. Please try again later.`,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string
  ): Promise<UserCredential | null> => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setMessage({
        type: 'success',
        text: 'Registration successful! Redirecting to dashboard...',
      });
      // Clear form fields can be handled outside this hook if needed
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return result;
    } catch (err: any) {
      handleAuthError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<UserCredential | null> => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect after successful sign-in
      return result;
    } catch (err: any) {
      handleAuthError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetAuthMessage = () => {
    setMessage(null);
  };

  return {
    message,
    setMessage,
    loading,
    signInWithProvider,
    signUpWithEmail,
    signInWithEmail,
    resetAuthMessage,
  };
};

export default useAuth;
