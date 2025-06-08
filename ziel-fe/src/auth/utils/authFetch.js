// src/utils/authFetch.js
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

// Configure axios instance
const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_BASE,
    withCredentials: true,
});

// Request interceptor to add auth token if available
authAxios.interceptors.request.use(config => {
    // If you're using cookies, they'll be sent automatically with withCredentials: true
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor to handle token refresh
authAxios.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            await useAuth().refreshToken();
            return authAxios(originalRequest);
        } catch (refreshError) {
            useAuth().logout();
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default authAxios;