'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import type { ComponentType, FC } from 'react'

// ✅ FIX: ràng buộc P mở rộng object thay vì IntrinsicAttributes
export function withAuth<P extends Record<string, unknown>>(Component: ComponentType<P>): FC<P> {
    const ProtectedComponent: FC<P> = (props) => {
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

    ProtectedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`

    return ProtectedComponent
}
