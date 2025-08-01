// /store/auth.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginService, logoutService } from '@/services/auth.service'
import { User } from '@/types/User'
import { getUser } from '@/services/user.service'

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
  clearAccessToken: () => void 
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
          const data = await getUser()
          set({
            user: {
              ...data,
              // avatar: data.avatarUrl || data.avatar,

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
        localStorage.setItem('accessToken', result.accessToken)
        set({ accessToken: result.accessToken })

        await get().fetchUser()

        if (router) router.push('/')
      },

      logout: async () => {
        try {
          await logoutService() 
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
      clearAccessToken: () => {
        localStorage.removeItem('accessToken')
        set({ accessToken: null, isAuthenticated: false })
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


