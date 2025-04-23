import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.json();

  // gọi NestJS login
  const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify(data), { status: res.status });
  }

  const cookieStore = cookies(); 
  (await cookieStore).set('refreshToken', data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return Response.json({ accessToken: data.accessToken });
}
