import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

// The protected routes that require authentication
const protectedRoutes = ['/', '/profile', '/bookings', '/dashboard', '/settings']

export async function middleware(request: NextRequest) {
  try {
    // Create a Supabase client configured to use cookies
    const { supabase, response } = createClient(request)

    // Refresh session if expired & still valid in Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If we have a session but we're on a non-protected route, do nothing
    if (session && !isProtectedRoute(request.nextUrl.pathname)) {
      return response
    }

    // If we don't have a session but we're on a protected route, redirect to /auth/signin
    if (!session && isProtectedRoute(request.nextUrl.pathname)) {
      const redirectUrl = new URL('/auth/signin', request.nextUrl.origin)
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // For other scenarios, continue with the request
    return response
  } catch (e) {
    // If something unexpected happened, continue with the request
    return NextResponse.next()
  }
}

// Check if the current path is in our protected routes list
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * But do match the paths starting with /auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 