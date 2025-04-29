'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function InitAuth() {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const clearAccessToken = useAuthStore((s) => s.clearAccessToken);

    useEffect(() => {
        async function refreshToken() {
            try {
                const res = await fetch('/api/refresh-token');

                if (res.ok) {
                    const data = await res.json();
                    if (data?.accessToken) {
                        setAccessToken(data.accessToken);
                        localStorage.setItem('accessToken', data.accessToken);
                        return;
                    }
                }

                // Nếu không ok hoặc không có accessToken → gọi logout
                console.warn('[InitAuth] Refresh token failed, calling logout...');
                await fetch('/api/logout', { method: 'POST' });

                // Clear store local state
                clearAccessToken();
                localStorage.removeItem('accessToken');

            } catch (error) {
                console.error('[InitAuth] Error refreshing token:', error);
                // Nếu lỗi mạng hoặc lỗi khác cũng gọi logout
                await fetch('/api/logout', { method: 'POST' });

                clearAccessToken();
                localStorage.removeItem('accessToken');
            }
        }

        refreshToken();
    }, [setAccessToken, clearAccessToken]);

    return null;
}
