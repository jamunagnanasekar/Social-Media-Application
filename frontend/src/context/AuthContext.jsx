import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('connecthub_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('connecthub_token') || null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('connecthub_token', token);
    } else {
      localStorage.removeItem('connecthub_token');
    }
  }, [token]);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('connecthub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('connecthub_user');
    }
  }, [user]);

  // Fetch Current Logged-in User profile & notifications on initial render
  const fetchCurrentUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await API.get('/users/me');
      setUser(response.data.data);
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to fetch user session:', error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!token) return;
    try {
      const res = await API.get('/notifications');
      setUnreadNotifications(res.data.unreadCount || 0);
    } catch (error) {
      // Ignore background notification fetch errors
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  // Login handler
  const login = async (emailOrUsername, password) => {
    const response = await API.post('/users/login', { emailOrUsername, password });
    const { token: authToken, ...userData } = response.data.data;
    setToken(authToken);
    setUser(userData);
    return response.data;
  };

  // Register handler
  const register = async (formData) => {
    const response = await API.post('/users/register', formData);
    const { token: authToken, ...userData } = response.data.data;
    setToken(authToken);
    setUser(userData);
    return response.data;
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token) {
        await API.post('/users/logout');
      }
    } catch (e) {
      // Ignore logout backend errors
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('connecthub_token');
      localStorage.removeItem('connecthub_user');
    }
  };

  // Update current user state helper
  const updateUserState = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        unreadNotifications,
        setUnreadNotifications,
        login,
        register,
        logout,
        updateUserState,
        fetchCurrentUser,
        fetchUnreadCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
