import axios from 'axios';
import { useAuth } from '../hooks/useAuth';


const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_BASE,
    withCredentials: true,
});


authAxios.interceptors.request.use(config => {

    return config;
}, error => {
    return Promise.reject(error);
});


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