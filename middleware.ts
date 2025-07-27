import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  console.log('🔐 MIDDLEWARE: Called for:', request.nextUrl.pathname)
  console.log('🔐 MIDDLEWARE: Full URL:', request.url)
  console.log('🔐 MIDDLEWARE: Method:', request.method)

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/vendor/dashboard', '/supplier/dashboard', '/profile', '/orders', '/products/add']
  const authRoutes = ['/auth/login', '/auth/signup', '/login', '/signup']
  
  const { pathname } = request.nextUrl
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // Get token from cookies or Authorization header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '')
  
  console.log('🔐 MIDDLEWARE: Token found:', token ? '✅ Yes' : '❌ No')
  console.log('🔐 MIDDLEWARE: Is protected route:', isProtectedRoute)
  console.log('🔐 MIDDLEWARE: Is auth route:', isAuthRoute)
  
  // Also check localStorage token (for client-side)
  if (!token && typeof window !== 'undefined') {
    const clientToken = localStorage.getItem('token')
    console.log('🔐 MIDDLEWARE: Client token found:', clientToken ? '✅ Yes' : '❌ No')
  }
  
  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    console.log('🚫 MIDDLEWARE: Redirecting to login - no token for protected route')
    console.log('🚫 MIDDLEWARE: Redirect URL:', new URL('/login', request.url).toString())
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If accessing protected route with token, verify it
  if (isProtectedRoute && token) {
    try {
      console.log('🔐 MIDDLEWARE: Verifying token for protected route')
      console.log('🔐 MIDDLEWARE: Token preview:', token.substring(0, 20) + '...')
      const user = verifyToken(token)
      console.log('🔐 MIDDLEWARE: Token verification result:', user ? 'Valid' : 'Invalid')
      if (!user) {
        console.log('🚫 MIDDLEWARE: Invalid token, redirecting to login')
        // Clear invalid token
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('token')
        return response
      }
      console.log('✅ MIDDLEWARE: Valid token for user:', user.name, 'role:', user.role)
    } catch (error) {
      console.log('🚫 MIDDLEWARE: Token verification failed:', error)
      // Clear invalid token
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }
  
  // If accessing auth routes with valid token, redirect to role-specific dashboard
  if (isAuthRoute && token) {
    try {
      const user = verifyToken(token)
      if (user) {
        console.log('✅ User already logged in, redirecting to role-specific dashboard')
        const dashboardUrl = user.role === 'vendor' ? '/vendor/dashboard' : '/supplier/dashboard'
        console.log('🎯 MIDDLEWARE: Redirecting to:', dashboardUrl)
        return NextResponse.redirect(new URL(dashboardUrl, request.url))
      }
    } catch (error) {
      // Invalid token, let them access auth routes
      console.log('Invalid token, allowing access to auth routes')
    }
  }
  
  console.log('✅ MIDDLEWARE: Allowing access to:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
