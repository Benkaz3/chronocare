// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../firebase';

// Firebase Auth error codes
type FirebaseAuthErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/weak-password'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/user-disabled'
  | 'auth/too-many-requests'
  | 'auth/email-verified'
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
  'auth/email-verified': 'Vui lòng xác minh email của bạn trước khi đăng nhập.',
  'auth/network-request-failed':
    'Lỗi mạng. Vui lòng kiểm tra kết nối của bạn và thử lại.',
};

const useAuth = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<AuthMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initially true while checking auth state
  const [user, setUser] = useState<User | null>(null); // Current authenticated user

  useEffect(() => {
    // Set up the authentication state observer
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Authentication status has been determined
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const handleAuthError = (err: { code: FirebaseAuthErrorCode }) => {
    console.error('Authentication Error:', err);
    const userFriendlyMessage =
      errorMessages[err.code] ||
      'Đăng nhập không thành công. Vui lòng thử lại.';
    setMessage({ type: 'error', text: userFriendlyMessage });
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
    setTimeout(() => {
      navigate(redirectPath);
    }, delay);
  };

  const signInWithProvider = async (
    providerName: string
  ): Promise<UserCredential | null> => {
    setLoading(true);
    let provider:
      | GoogleAuthProvider
      | FacebookAuthProvider
      | TwitterAuthProvider;

    switch (providerName.toLowerCase()) {
      case 'google':
        provider = new GoogleAuthProvider();
        break;
      case 'facebook':
        provider = new FacebookAuthProvider();
        break;
      case 'twitter':
        provider = new TwitterAuthProvider();
        break;
      default:
        setMessage({
          type: 'error',
          text: 'Provider không hợp lệ.',
        });
        setLoading(false);
        return null;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      handleSuccess(`Đăng nhập thành công với ${providerName}!`, '/dashboard');
      return result;
    } catch (err: any) {
      console.error(`Đăng nhập không thành công với ${providerName}:`, err);
      setMessage({
        type: 'error',
        text: `Không thể đăng nhập với ${providerName}. Thử lại sau.`,
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
        text: 'Đăng ký thành công! Chuyển hướng tới dashboard...',
      });
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
      handleSuccess('Đăng nhập thành công với email!', '/dashboard');
      return result;
    } catch (err: any) {
      handleAuthError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async (): Promise<void> => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      handleSuccess('Đăng xuất thành công!', '/auth', 1500);
    } catch (err: any) {
      console.error('Error signing out:', err);
      setMessage({
        type: 'error',
        text: 'Đăng xuất không thành công. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAuthMessage = () => {
    setMessage(null);
  };

  return {
    user,
    loading,
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
