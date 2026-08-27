import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('applinex_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('applinex_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      authApi.getProfile()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('applinex_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { user: userData, tokens } = res.data;
      setUser(userData);
      setToken(tokens.access);
      localStorage.setItem('applinex_token', tokens.access);
      localStorage.setItem('applinex_refresh', tokens.refresh);
      localStorage.setItem('applinex_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.error || err.response?.data?.errors?.non_field_errors?.[0] || 'Invalid credentials.';
      return { success: false, error: errMsg };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      const { user: newUser, tokens } = res.data;
      setUser(newUser);
      setToken(tokens.access);
      localStorage.setItem('applinex_token', tokens.access);
      localStorage.setItem('applinex_refresh', tokens.refresh);
      localStorage.setItem('applinex_user', JSON.stringify(newUser));
      setLoading(false);
      return { success: true, user: newUser };
    } catch (err) {
      setLoading(false);
      return { success: false, errors: err.response?.data?.errors || { general: 'Registration failed.' } };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('applinex_token');
    localStorage.removeItem('applinex_refresh');
    localStorage.removeItem('applinex_user');
  };

  const updateProfile = async (data) => {
    try {
      const res = await authApi.updateProfile(data);
      setUser(res.data.user);
      localStorage.setItem('applinex_user', JSON.stringify(res.data.user));
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, errors: err.response?.data?.errors };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'guest',
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
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
