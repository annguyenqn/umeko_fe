import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  // Add await here to resolve the Promise
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    console.log('[REFRESH] No refresh token found in cookies');
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  console.log('[REFRESH] Using refresh token from cookie');
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log('[REFRESH] Token refresh failed:', data);
      return NextResponse.json(data, { status: res.status });
    }

    // If you need to update the refresh token as well, use NextResponse to set cookies
    if (data.refreshToken) {
      const response = NextResponse.json({ accessToken: data.accessToken });
      
      response.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || false,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
      
      return response;
    }

    // If no new refresh token is provided, just return the access token
    return NextResponse.json({ accessToken: data.accessToken });
  } catch (error) {
    console.error('[REFRESH] Error during token refresh:', error);
    return NextResponse.json({ message: 'Failed to refresh token' }, { status: 500 });
  }
}