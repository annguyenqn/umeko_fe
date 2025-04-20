import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_NEST_API_URL;
const vocabBaseURL = process.env.NEXT_PUBLIC_NEST_API_VOCAB_URL;

console.log('[AXIOS] Base URL:', baseURL);
console.log('[AXIOS] Vocab Base URL:', vocabBaseURL);

// API có token
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm làm mới accessToken
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Lưu lại token mới vào localStorage và cookies
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    Cookies.set('accessToken', accessToken, { expires: 7 });
    Cookies.set('refreshToken', newRefreshToken, { expires: 7 });

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw new Error('Failed to refresh token');
  }
}

// Interceptor yêu cầu API có token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý khi có lỗi 401 và làm mới token
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Kiểm tra lỗi 401 và tránh gọi lại nhiều lần
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the original request
      } catch (err) {
        console.error('Error refreshing token:', err);
        throw err;
      }
    }

    return Promise.reject(error);
  }
);

// API không cần token
const vocabApi = axios.create({
  baseURL: vocabBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { api, vocabApi };
