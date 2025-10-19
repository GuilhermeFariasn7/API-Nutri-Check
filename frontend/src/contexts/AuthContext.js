// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../service/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const userData = authService.getUserData();
    if (authService.isAuthenticated() && userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    userType: user?.tipo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};