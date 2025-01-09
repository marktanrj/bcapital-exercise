import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/chat',
]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('authToken')?.value
  
  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route)
  )

  // redirect to login if user is in root
  if (path === '/' && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // if user is trying to access protected route without token
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', path)
    return NextResponse.redirect(url)
  }

  // if user goes to login, but has token
  if (path === '/login' && token) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/chat',
  ]
}