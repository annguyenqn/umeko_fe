'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';

export const GoogleLoginButton = () => {
    const { setAccessToken, fetchUser } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    return (
        <GoogleLogin
            onSuccess={async (credentialResponse) => {
                const id_token = credentialResponse.credential;
                if (!id_token) return;

                setLoading(true);

                try {
                    const res = await fetch('/api/social-login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            provider: 'google',
                            id_token,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || 'Social login failed');
                    }

                    setAccessToken(data.accessToken);
                    await fetchUser();
                    router.push('/');
                } catch (err: any) {
                    console.error('[GOOGLE_LOGIN_ERROR]', err);
                    toast.error('Đăng nhập Google thất bại', {
                        description: err.message,
                    });
                } finally {
                    setLoading(false);
                }
            }}
            onError={() => {
                toast.error('Google login thất bại');
            }}
            useOneTap={false}
        />
    );
};
