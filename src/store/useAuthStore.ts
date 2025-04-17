// 📁 stores/useAuthStore.ts
import { create } from 'zustand'
import { loginService, logoutService, getMeService } from '@/services/auth.service'
import { User } from '@/types/User'
import Cookies from 'js-cookie';
interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  fetchUser: () => Promise<void>
  login: (email: string, password: string, router?: any) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  fetchUser: async () => {
    try {
      const data = await getMeService()
      set({
        user: {
          ...data,
          avatar: data.avatarUrl || data.avatar,
        },
        isAuthenticated: true,
        loading: false,
      })
    } catch (err: any) {
      set({ user: null, isAuthenticated: false, error: err.message, loading: false })
    }
  },

  login: async (email, password, router) => {
    try {
      console.log('login',email, password);
      
      const result = await loginService({ email, password })

          // Lưu vào cookie (để Server Component có thể dùng)
    Cookies.set('accessToken', result.accessToken, { expires: 7 });
    Cookies.set('refreshToken', result.refreshToken, { expires: 7 });

      localStorage.setItem('accessToken', result.accessToken)
      localStorage.setItem('refreshToken', result.refreshToken)
      await useAuthStore.getState().fetchUser()

      if (router) router.push('/')
    } catch (err: any) {
      throw err
    }
  },

  logout: async () => {
    try {
      await logoutService()
    } catch (err) {
      console.error('Logout lỗi:', err)
    }
    localStorage.clear()
    set({ user: null, isAuthenticated: false })
  },
}))
