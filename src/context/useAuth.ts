// src/hooks/useAuth.ts

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';

// Firebase Auth error codes (excluding non-standard codes)
type FirebaseAuthErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/weak-password'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/user-disabled'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed';

// Interface for authentication messages
interface AuthMessage {
  type: 'success' | 'error';
  text: string;
}

// Mapping of Firebase error codes to user-friendly messages
const errorMessages: Record<FirebaseAuthErrorCode, string> = {
  'auth/email-already-in-use':
    'Email đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.',
  'auth/invalid-email': 'Email không đúng.',
  'auth/weak-password': 'Mật khẩu yếu. Vui lòng đặt mật khẩu mạnh hơn.',
  'auth/user-not-found': 'Không có người dùng với email này.',
  'auth/wrong-password': 'Sai mật khẩu.',
  'auth/user-disabled':
    'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.',
  'auth/too-many-requests':
    'Quá nhiều lần cố đăng nhập. Vui lòng thử lại sau vài phút.',
  'auth/network-request-failed':
    'Lỗi mạng. Vui lòng kiểm tra kết nối của bạn và thử lại.',
};

// Interface for the hook's return type
interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: Error | null; // Added error property
  message: AuthMessage | null;
  setMessage: Dispatch<SetStateAction<AuthMessage | null>>;
  signInWithProvider: (
    provider: GoogleAuthProvider | TwitterAuthProvider,
    providerName: string
  ) => Promise<UserCredential | null>;
  signUpWithEmail: (
    email: string,
    password: string
  ) => Promise<UserCredential | null>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<UserCredential | null>;
  signOut: () => Promise<void>;
  resetAuthMessage: () => void;
}

const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<AuthMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initially true while checking auth state
  const [user, setUser] = useState<User | null>(null); // Current authenticated user
  const [error, setError] = useState<Error | null>(null); // Added error state

  useEffect(() => {
    // Set up the authentication state observer
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          if (!currentUser.emailVerified && !currentUser.isAnonymous) {
            // If email is not verified, sign out and prompt verification
            firebaseSignOut(auth)
              .then(() => {
                setMessage({
                  type: 'error',
                  text: 'Vui lòng xác minh email của bạn trước khi đăng nhập.',
                });
                setError(new Error('Email not verified'));
              })
              .catch((signOutError: Error) => {
                console.error('Error signing out:', signOutError);
                setMessage({
                  type: 'error',
                  text: 'Đăng nhập không thành công. Vui lòng thử lại.',
                });
                setError(signOutError);
              });
          } else {
            setUser(currentUser);
            setError(null); // Clear any previous errors
          }
        } else {
          setUser(null);
          setError(null); // Clear any previous errors
        }
        setLoading(false); // Authentication status has been determined
      },
      (authError: Error) => {
        console.error('Authentication error:', authError);
        if (authError instanceof FirebaseError) {
          const userFriendlyMessage =
            errorMessages[authError.code as FirebaseAuthErrorCode] ||
            'Đăng nhập không thành công. Vui lòng thử lại.';
          setMessage({ type: 'error', text: userFriendlyMessage });
        } else {
          setMessage({
            type: 'error',
            text: 'Đăng nhập không thành công. Vui lòng thử lại.',
          });
        }
        setError(authError); // Set the error state
        setLoading(false);
      }
    );

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleAuthError = (err: Error) => {
    console.error('Authentication Error:', err);
    if (err instanceof FirebaseError) {
      const userFriendlyMessage =
        errorMessages[err.code as FirebaseAuthErrorCode] ||
        'Đăng nhập không thành công. Vui lòng thử lại.';
      setMessage({ type: 'error', text: userFriendlyMessage });
    } else {
      setMessage({
        type: 'error',
        text: 'Đăng nhập không thành công. Vui lòng thử lại.',
      });
    }
    setError(err); // Set the error state
  };

  const handleSuccess = (
    messageText: string,
    redirectPath: string,
    delay = 1500
  ) => {
    setMessage({
      type: 'success',
      text: `${messageText} Đang chuyển hướng...`,
    });
    setError(null); // Clear any previous errors
    setTimeout(() => {
      navigate(redirectPath);
    }, delay);
  };

  const signInWithProvider = async (
    provider: GoogleAuthProvider | TwitterAuthProvider,
    providerName: string
  ): Promise<UserCredential | null> => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);

      // Optional: Check if email is verified (if using email-based providers)
      if (
        result.user.email &&
        !result.user.emailVerified &&
        provider instanceof GoogleAuthProvider // Example condition
      ) {
        // If email is not verified, you might want to handle it here
        // For OAuth providers like Google, email is usually verified
        // This check might be redundant depending on the provider
      }

      handleSuccess(`Đăng nhập thành công với ${providerName}!`, '/dashboard');
      return result;
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        console.error(`Đăng nhập không thành công với ${providerName}:`, err);
        handleAuthError(err);
      } else {
        console.error(`Đăng nhập không thành công với ${providerName}:`, err);
        setMessage({
          type: 'error',
          text: `Không thể đăng nhập với ${providerName}. Thử lại sau.`,
        });
        setError(new Error(`Authentication failed with ${providerName}`));
      }
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

      // Send email verification using the sendEmailVerification function
      await sendEmailVerification(result.user);

      setMessage({
        type: 'success',
        text: 'Đăng ký thành công! Một email xác minh đã được gửi tới email của bạn. Vui lòng kiểm tra và xác minh email trước khi đăng nhập.',
      });
      setError(null); // Clear any previous errors

      // Optionally, sign out the user after registration to enforce email verification
      await firebaseSignOut(auth);

      // Redirect to login or another page if desired
      setTimeout(() => {
        navigate('/auth'); // Change '/auth' to your desired path if needed
      }, 3000);

      return result;
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        handleAuthError(err);
      } else {
        console.error('Đăng ký không thành công:', err);
        setMessage({
          type: 'error',
          text: 'Đăng ký không thành công. Vui lòng thử lại.',
        });
        setError(new Error('Sign up failed'));
      }
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

      // Check if email is verified
      if (
        result.user &&
        !result.user.emailVerified &&
        !result.user.isAnonymous
      ) {
        // If email is not verified, sign out and prompt verification
        await firebaseSignOut(auth);
        setMessage({
          type: 'error',
          text: 'Vui lòng xác minh email của bạn trước khi đăng nhập.',
        });
        setError(new Error('Email not verified'));
        return null;
      }

      handleSuccess('Đăng nhập thành công với email!', '/dashboard');
      return result;
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        handleAuthError(err);
      } else {
        console.error('Đăng nhập không thành công:', err);
        setMessage({
          type: 'error',
          text: 'Đăng nhập không thành công. Vui lòng thử lại.',
        });
        setError(new Error('Sign in with email failed'));
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async (): Promise<void> => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      handleSuccess('Đăng xuất thành công!', '/auth');
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        console.error('Error signing out:', err);
        setMessage({
          type: 'error',
          text: 'Đăng xuất không thành công. Vui lòng thử lại.',
        });
        setError(err);
      } else {
        console.error('Error signing out:', err);
        setMessage({
          type: 'error',
          text: 'Đăng xuất không thành công. Vui lòng thử lại.',
        });
        setError(new Error('Sign out failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const resetAuthMessage = () => {
    setMessage(null);
    setError(null); // Optionally reset the error state as well
  };

  return {
    user,
    loading,
    error, // Include error in the returned object
    message,
    setMessage,
    signInWithProvider,
    signUpWithEmail,
    signInWithEmail,
    signOut: signOutUser,
    resetAuthMessage,
  };
};

export default useAuth;
