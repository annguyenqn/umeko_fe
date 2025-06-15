import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/social-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const response = NextResponse.json({ accessToken: data.accessToken });

    if (data.refreshToken) {
      response.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 ngày
      });
    }

    return response;
  } catch (error: any) {
    console.error('[SOCIAL_LOGIN_ERROR]', error);
    return NextResponse.json(
      { message: 'Internal server error during social login' },
      { status: 500 }
    );
  }
}
