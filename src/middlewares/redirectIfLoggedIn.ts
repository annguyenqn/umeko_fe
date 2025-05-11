
import { NextRequest, NextResponse } from 'next/server'

export function redirectIfLoggedIn(request: NextRequest) {
  
  const refreshToken = request.cookies.get('refreshToken')?.value

  const pathname = request.nextUrl.pathname

  const authOnlyRoutes = ['/login', '/signup']
  const isAuthOnly = authOnlyRoutes.some(route => pathname.startsWith(route))

  if (refreshToken && isAuthOnly) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url))
  }

  return null 
}
