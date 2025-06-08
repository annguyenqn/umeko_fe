'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function InitAuth() {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const clearAccessToken = useAuthStore((s) => s.clearAccessToken);

    useEffect(() => {
        async function refreshToken() {
            try {
                const res = await fetch('/api/refresh-token', {
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data?.accessToken) {
                        setAccessToken(data.accessToken);
                        localStorage.setItem('accessToken', data.accessToken);
                        return;
                    }
                }

                console.warn('[InitAuth] Refresh token failed, calling logout...');

                await fetch('/api/refresh-token', {
                    method: 'POST',
                    credentials: 'include',
                });

                clearAccessToken();
                localStorage.removeItem('accessToken');

            } catch (error) {
                console.error('[InitAuth] Error refreshing token:', error);

                await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/logout`, {
                    method: 'POST',
                    credentials: 'include',
                });

                clearAccessToken();
                localStorage.removeItem('accessToken');
            }
        }

        refreshToken();
    }, [setAccessToken, clearAccessToken]);

    return null;
}
