// /store/auth.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginService, logoutService } from '@/services/auth.service'
import { User } from '@/types/User'
import { getUserDetails } from '@/services/user.service'

interface AuthState {
  user: User | null
  accessToken: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  hasHydrated: boolean
  fetchUser: () => Promise<void>
  login: (email: string, password: string, router?: any) => Promise<void>
  logout: () => Promise<void>
  setAccessToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      loading: true,
      error: null,
      isAuthenticated: false,
      hasHydrated: false,

      fetchUser: async () => {
        try {
          const data = await getUserDetails()
          set({
            user: {
              ...data,
              // avatar: data.avatarUrl || data.avatar,
              id: '',
              email: '',
              refreshToken: '',
              firstName: '',
              lastName: '',
              role: 'user',
              isEmailVerified: false,
              createdAt: '',
              updatedAt: ''
            },
            isAuthenticated: true,
            loading: false,
          })
        } catch (err: any) {
          set({ user: null, isAuthenticated: false, error: err.message, loading: false })
        }
      },

      login: async (email, password, router) => {
        const result = await loginService({ email, password }) // Gọi API Next.js => lưu refreshToken vào cookie server
        localStorage.setItem('accessToken', result.accessToken)
        set({ accessToken: result.accessToken })

        await get().fetchUser()

        if (router) router.push('/')
      },

      logout: async () => {
        try {
          await logoutService() // Gọi API Next.js để xóa cookie server
        } catch (err) {
          console.error('Logout lỗi:', err)
        }
        localStorage.removeItem('accessToken')
        set({ user: null, accessToken: null, isAuthenticated: false })
      },

      setAccessToken: (token) => {
        set({ accessToken: token })
        localStorage.setItem('accessToken', token)
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true })
      },
    }
  )
)


