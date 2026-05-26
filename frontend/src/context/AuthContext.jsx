import { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../api/authApi';
import { getCurrentUser } from '../api/userApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('velora_token'));
  const [loading, setLoading] = useState(true);

  // Verify token and load user profile on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('velora_token');
      if (storedToken) {
        try {
          const { data } = await getCurrentUser();
          setUser(data);
          setToken(storedToken);
        } catch {
          // Token expired or invalid — clear everything
          localStorage.removeItem('velora_token');
          localStorage.removeItem('velora_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await loginUser(credentials);
    localStorage.setItem('velora_token', data.token);
    setToken(data.token);
    // Fetch full user profile after auth
    const { data: profile } = await getCurrentUser();
    localStorage.setItem('velora_user', JSON.stringify(profile));
    setUser(profile);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const { data } = await registerUser(userData);
    localStorage.setItem('velora_token', data.token);
    setToken(data.token);
    const { data: profile } = await getCurrentUser();
    localStorage.setItem('velora_user', JSON.stringify(profile));
    setUser(profile);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('velora_token');
    localStorage.removeItem('velora_user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await getCurrentUser();
      setUser(data);
      localStorage.setItem('velora_user', JSON.stringify(data));
    } catch {
      // silently fail
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    refreshUser,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
