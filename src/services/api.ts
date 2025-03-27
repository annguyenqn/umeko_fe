import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: process.env.NEST_PUBLIC_API_URL || 'http://14.225.217.126:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // You can add auth tokens here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        // Handle errors here
        return Promise.reject(error);
    }
);

export default api; 