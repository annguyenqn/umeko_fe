import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginService, logoutService, getMeService } from '@/services/auth.service'
import { User } from '@/types/User'
import Cookies from 'js-cookie'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  hasHydrated: boolean // ✅ Thêm dòng này
  fetchUser: () => Promise<void>
  login: (email: string, password: string, router?: any) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: null,
      isAuthenticated: false,
      hasHydrated: false, // ✅ Khởi tạo mặc định

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
        const result = await loginService({ email, password })

        Cookies.set('accessToken', result.accessToken, { expires: 7 })
        Cookies.set('refreshToken', result.refreshToken, { expires: 7 })
        localStorage.setItem('accessToken', result.accessToken)
        localStorage.setItem('refreshToken', result.refreshToken)

        await get().fetchUser()

        if (router) router.push('/')
      },

      logout: async () => {
        try {
          await logoutService()
        } catch (err) {
          console.error('Logout lỗi:', err)
        }
        localStorage.clear()
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => () => {
        // ✅ Dùng get/set như sau để không lỗi
        useAuthStore.setState({ hasHydrated: true })
      },
    }
  )
)
