// /app/api/logout/route.ts
import { cookies } from 'next/headers';

export async function POST() {
  // Optionally gọi logout bên Nest nếu bạn có logic server
  (await
        // Optionally gọi logout bên Nest nếu bạn có logic server
        cookies()).delete('refreshToken');
  return new Response('Logged out', { status: 200 });
}
