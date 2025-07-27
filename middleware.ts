import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('🔐 MIDDLEWARE: Called for:', pathname)
  
  // Define protected routes
  const protectedRoutes = ['/vendor/dashboard', '/supplier/dashboard', '/profile', '/orders', '/products/add']
  const authRoutes = ['/login', '/signup']
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value
  
  console.log('🔐 MIDDLEWARE: Token found:', token ? '✅ Yes' : '❌ No')
  console.log('🔐 MIDDLEWARE: Is protected route:', isProtectedRoute)
  console.log('🔐 MIDDLEWARE: Is auth route:', isAuthRoute)
  
  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    console.log('🚫 MIDDLEWARE: No token for protected route, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
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
