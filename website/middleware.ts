import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/chat']
const isProduction = process.env.NODE_ENV === 'production'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const sessionCookie = request.cookies.get('sessionId')
  
  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route)
  )

  // if protected route and has sessionId, validate it with backend
  if (isProtectedRoute && sessionCookie) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Cookie: `sessionId=${sessionCookie.value}`,
          'Content-Type': 'application/json',
          'Origin': 'https://app.marksite.xyz'
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url))
        // Only set cookie attributes, don't delete
        if (sessionCookie) {
          redirectResponse.cookies.set({
            name: 'sessionId',
            value: sessionCookie.value,
            domain: isProduction ? '.marksite.xyz' : undefined,
            secure: isProduction,
            sameSite: 'none',
            httpOnly: true
          })
        }
        return redirectResponse
      }
    } catch (error) {
      console.error('Auth check error:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // handle redirects for unauthenticated users
  if ((isProtectedRoute || path === '/') && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // redirect authenticated users away from login
  if (['/login', '/'].includes(path) && sessionCookie) {
    const response = NextResponse.redirect(new URL('/chat', request.url))
    // Preserve cookie when redirecting
    if (sessionCookie) {
      response.cookies.set({
        name: 'sessionId',
        value: sessionCookie.value,
        domain: isProduction ? '.marksite.xyz' : undefined,
        secure: isProduction,
        sameSite: 'none',
        httpOnly: true
      })
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/sign-up',
    '/chat',
    '/chat/:path*'
  ]
}