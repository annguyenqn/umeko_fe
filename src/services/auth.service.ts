import {api} from '@/lib/axios'

export async function loginService(payload: { email: string; password: string }) {
    
  const response = await api.post('/auth/login', payload)
  return response.data
}

export async function getMeService() {
  const response = await api.get('/auth/me')
  return response.data
}

export async function logoutService() {
  const response = await api.post('/auth/logout')
  return response.data
}