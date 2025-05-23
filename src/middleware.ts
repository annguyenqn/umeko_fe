import { redirectIfLoggedIn } from './middlewares/redirectIfLoggedIn'
// import { requireAuth } from './middlewares/requireAuth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const redirect1 = redirectIfLoggedIn(request)
  if (redirect1) return redirect1

  // const redirect2 = requireAuth(request)
  // if (redirect2) return redirect2

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/user/dashboard/:path*',
  ],
}
