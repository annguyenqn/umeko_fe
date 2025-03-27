export interface User{
    id: string
    email: string
    refreshToken: string
    firstName: string
    lastName: string
    role: 'user' | 'admin' // hoặc string nếu không rõ toàn bộ role
    isEmailVerified: boolean
    avatar?: string
    createdAt: string // ISO date string
    updatedAt: string
  }