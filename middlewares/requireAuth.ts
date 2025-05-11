import { NextRequest, NextResponse } from 'next/server'

export function requireAuth(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value
  const pathname = request.nextUrl.pathname

  const protectedRoutes = ['/user/dashboard', '/user/dashboard']
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  if (!refreshToken && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return null
}
