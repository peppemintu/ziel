import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/me');
      setUser(response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      if (err.response && err.response.status === 401) {
        await refreshToken();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/login', credentials);
      await fetchUser();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', userData);
      await fetchUser();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    }
  };

  const refreshToken = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/refresh');
      await fetchUser();
      return true;
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await fetchUser();
    };
    initializeAuth();

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshed = await refreshToken();
          if (refreshed) {
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [fetchUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
  };
};