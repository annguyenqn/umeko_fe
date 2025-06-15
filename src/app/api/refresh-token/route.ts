import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  // Add await here to resolve the Promise
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    console.log('[REFRESH] No refresh token found in cookies');

    const response = NextResponse.json(
      { message: 'No refresh token', shouldLogout: true },
      { status: 401 }
    );

    // Xóa refreshToken nếu có
    response.cookies.set('refreshToken', '', {
      path: '/',
      maxAge: 0,
    });

    return response;
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log('[REFRESH] Token refresh failed:', data);

      const response = NextResponse.json(
        { message: 'Token refresh failed', shouldLogout: true },
        { status: res.status }
      );

      response.cookies.set('refreshToken', '', {
        path: '/',
        maxAge: 0,
      });

      return response;
    }

    // Nếu có refreshToken mới thì cập nhật cookie
    const response = NextResponse.json({ accessToken: data.accessToken });

    if (data.refreshToken) {
      response.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || false,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 ngày
      });
    }

    return response;
  } catch (error) {
    console.error('[REFRESH] Error during token refresh:', error);

    const response = NextResponse.json(
      { message: 'Failed to refresh token', shouldLogout: true },
      { status: 500 }
    );

    response.cookies.set('refreshToken', '', {
      path: '/',
      maxAge: 0,
    });

    return response;
  }
}