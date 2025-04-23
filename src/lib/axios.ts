// lib/axios.ts
import axios from 'axios';
import { refreshAccessToken } from '@/services/auth.service';
const baseURL = process.env.NEXT_PUBLIC_NEST_API_URL;
const vocabBaseURL = process.env.NEXT_PUBLIC_NEST_API_VOCAB_URL;

console.log('[AXIOS] Base URL:', baseURL);
console.log('[AXIOS] Vocab Base URL:', vocabBaseURL);

// Axios instance cho API cần token
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// async function refreshAccessToken(): Promise<string | null> {
//   if (typeof window === 'undefined') return null;

//   try {
//     const res = await fetch('/api/refresh-token');
//     if (!res.ok) throw new Error('Refresh token failed');

//     const data = await res.json();
//     localStorage.setItem('accessToken', data.accessToken);
//     return data.accessToken;
//   } catch (err) {
//     console.error('[AXIOS] Failed to refresh token:', err);
//     return null;
//   }
// }

// ✅ Gắn accessToken vào request header
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

// ✅ Interceptor để xử lý lỗi 401 và tự động refresh
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

// Không cần token
const vocabApi = axios.create({
  baseURL: vocabBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { api, vocabApi };
