'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import type { ComponentType, JSX } from 'react'
export function withAuth<T extends JSX.IntrinsicAttributes>(Component: ComponentType<T>) {
    return function ProtectedComponent(props: T) {
        const router = useRouter()
        const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

        useEffect(() => {
            if (!isAuthenticated) {
                router.replace('/login')
            }
        }, [isAuthenticated, router])

        if (!isAuthenticated) return null

        return <Component {...props} />
    }
}
