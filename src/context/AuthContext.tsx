import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginResponse } from '../types/authTypes';
import { saveToStorage, getFromStorage, removeFromStorage } from '../utils/storage';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: any | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getFromStorage('accessToken') || null);
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();
  const sessionTimeout = 2 * 60 * 60 * 1000; 

  const isAuthenticated = !!token;

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    removeFromStorage('accessToken');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
  }, [token, logout]);

  const resetInactivityTimer = useCallback(() => {
    const logoutUser = () => {
      logout();
      navigate('/');
      alert('Your session has expired due to inactivity.');
    };

    let inactivityTimeout: NodeJS.Timeout | null = null;

    const handleUserActivity = () => {
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
      inactivityTimeout = setTimeout(logoutUser, sessionTimeout);
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('focus', handleUserActivity); // Consider when the tab becomes active again

    // Initial setup
    handleUserActivity();

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('focus', handleUserActivity);
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
    };
  }, [navigate, logout, sessionTimeout]);

  useEffect(() => {
    if (isAuthenticated) {
      return resetInactivityTimer();
    }
  }, [isAuthenticated, resetInactivityTimer]);

  const login = useCallback((data: LoginResponse) => {
    setToken(data.token);
    saveToStorage('accessToken', data.token);
    try {
      const decodedToken: any = jwtDecode(data.token);
      setUser(decodedToken);
    } catch (error) {
      console.error('Error decoding token on login:', error);
    }
  }, []);

  const value: AuthContextType = {
    token,
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

