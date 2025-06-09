import axios from 'axios';
import { refreshAccessToken } from '@/services/auth.service';

// 🌐 Biến môi trường
const baseURL = process.env.NEXT_PUBLIC_NEST_API_URL;
const vocabBaseURL = process.env.NEXT_PUBLIC_NEST_API_VOCAB_URL;

console.log('[AXIOS] Base URL:', baseURL);
console.log('[AXIOS] Vocab Base URL:', vocabBaseURL);

// 📦 Instance cho API cần token
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Gắn accessToken vào request (chạy trên browser)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Tự động refresh token nếu bị 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        console.warn('[AXIOS] Unable to refresh token. Redirect or logout needed.');
        return Promise.reject(error);
      }

      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

// 📦 Instance cho Vocab không cần token
const vocabApi = axios.create({
  baseURL: vocabBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { api, vocabApi };
