import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Ensure this path is correct

export const useAuth = () => useContext(AuthContext);
