import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Configure axios to send credentials (cookies) with every request
  axios.defaults.withCredentials = true;

  // Function to fetch current user data
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
        // Token might be expired, try to refresh
        await refreshToken();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to handle login
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/login', credentials);
      await fetchUser(); // Fetch user data after successful login
      navigate('/'); // Redirect to home page after login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle registration
  const register = async (userData) => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/register', userData);
      await fetchUser(); // Fetch user data after successful registration
      navigate('/'); // Redirect to home page after registration
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      // You might want to add a logout endpoint in your backend
      // that clears the HttpOnly cookies
      await axios.post('http://localhost:8080/api/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    }
  };

  // Function to refresh access token
  const refreshToken = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/refresh');
      await fetchUser(); // Try to fetch user again after token refresh
      return true;
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      await fetchUser();
    };
    initializeAuth();

    // Set up axios response interceptor to handle token refresh
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