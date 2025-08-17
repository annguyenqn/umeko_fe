// src/app/api/refresh/route.ts (Next.js App Router)
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // Không có refreshToken => buộc logout
  if (!refreshToken) {
    const res = NextResponse.json(
      { message: 'No refresh token', shouldLogout: true },
      { status: 401 }
    );
    // clear cookie (match các attr khi set)
    res.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Nếu cross-site hãy dùng 'none'
      path: '/',
      maxAge: 0,
    });
    return res;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const ct = res.headers.get('content-type') ?? '';
    let payload: unknown = null;
    if (ct.includes('application/json')) {
      try {
        payload = await res.json();
      } catch {
        payload = null;
      }
    } else {
      try {
        payload = await res.text();
      } catch {
        payload = null;
      }
    }

    if (!res.ok) {
      console.log('[REFRESH] Failed:', payload);

      const errResp = NextResponse.json(
        {
          message: 'Token refresh failed',
          shouldLogout: true,
        },
        { status: res.status }
      );
      errResp.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', 
        path: '/',
        maxAge: 0,
      });
      return errResp;
    }

    const data = (payload ?? {}) as { accessToken?: string; refreshToken?: string };

    const okResp = NextResponse.json(
      { accessToken: data.accessToken },
      { status: 200 }
    );

    if (data.refreshToken) {
      okResp.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // nếu FE/BE khác domain -> 'none'
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 ngày
      });
    }

    return okResp;
  } catch (error: any) {
    console.error('[REFRESH] Error:', error?.message || error);

    const res = NextResponse.json(
      { message: 'Failed to refresh token', shouldLogout: true },
      { status: 500 }
    );
    res.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    return res;
  }
}
