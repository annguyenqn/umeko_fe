import {api} from '@/lib/axios'
import Cookies from 'js-cookie';
export async function loginService(payload: { email: string; password: string }) {
  console.log('is login');

  try {
    const response = await api.post('/auth/login', payload);
    return response.data;
  } catch (error: any) {
    console.log('Login failed:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Login failed. Please try again.'
    );
  }
}


export async function getMeService() {
  const response = await api.get('/auth/me')
  return response.data
}

export async function getUserDetail() {
  const response = await api.get('users/me/details')
  return response.data
}


export async function logoutService() {
  const response = await api.post('/auth/logout')
  return response.data
}

// Hàm refresh token được sử dụng khi access token hết hạn
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await api.post('/auth/refresh', { refreshToken });
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