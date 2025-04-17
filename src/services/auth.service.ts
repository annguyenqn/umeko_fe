import {api} from '@/lib/axios'

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