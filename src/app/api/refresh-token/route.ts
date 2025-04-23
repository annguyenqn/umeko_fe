// /app/api/refresh-token/route.ts
import { cookies } from 'next/headers';

export async function GET() {
  const refreshToken = (await cookies()).get('refreshToken')?.value;

  if (!refreshToken) {
    return new Response(JSON.stringify({ message: 'No refresh token' }), { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify(data), { status: res.status });
  }

  // ✅ Trả về accessToken cho client dùng (Zustand setAccessToken ở client)
  return Response.json({ accessToken: data.accessToken });
}
