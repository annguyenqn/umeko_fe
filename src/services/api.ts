import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_NEST_API_URL || 'https://umeko.io.vn',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
    // Production optimizations
    validateStatus: (status: number) => status >= 200 && status < 500, // Don't reject if status is not 2xx
    maxRedirects: 5,
    withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Optional: Add auth token if available
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle errors here
        if (error.response) {
            // Server responded with error status
            console.error('API Error Response:', error.response.status, error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error('API No Response:', error.request);
        } else {
            // Error in setting up the request
            console.error('API Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
