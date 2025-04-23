'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function InitAuth() {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);

    useEffect(() => {
        fetch('/api/refresh-token')
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (data?.accessToken) {
                    setAccessToken(data.accessToken);
                    localStorage.setItem('accessToken', data.accessToken);
                }
            });
    }, []);

    return null;
}
