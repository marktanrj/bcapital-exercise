import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/chat',
]

const isApiRequest = (request: NextRequest) => {
  return request.nextUrl.pathname.startsWith('/api') || 
    request.nextUrl.hostname.startsWith('api.') ||
    request.headers.get('accept')?.includes('application/json');
}

export async function middleware(request: NextRequest) {
  // skip middleware for API requests
  if (isApiRequest(request)) {
    return NextResponse.next();
  }

  const path = request.nextUrl.pathname
  const sessionCookie = request.cookies.get('sessionId')?.value
  
  // check if this is a logout redirect
  const isLoggingOut = request.headers.get('referer')?.includes('/logout') || 
                      request.headers.get('x-logout') === 'true';

  // if logging out, allow redirect to login without checking session
  if (isLoggingOut) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route)
  )

  // if protected route and has sessionId, validate it with backend
  if (isProtectedRoute && sessionCookie) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Cookie: `sessionId=${sessionCookie}`
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        // invalid session - clear cookie and redirect
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('sessionId')
        return response
      }
    } catch {
      // API error - redirect to login?
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('sessionId')
      return response
    }
  }

  // handle redirects for unauthenticated users
  if ((isProtectedRoute || path === '/') && !sessionCookie) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  // redirect authenticated users away from login
  if (['/login', '/'].includes(path) && sessionCookie) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/chat/:path*'
  ]
}