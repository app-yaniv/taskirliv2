import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

// The protected routes that require authentication
// Home page is now public, but specific actions like renting or listing items require auth
const protectedRoutes = [
  '/profile',
  '/bookings',
  '/dashboard',
  '/settings',
  '/rentals/create',  // Creating a rental listing
  '/rentals/manage',  // Managing rental listings
  '/checkout',        // Payment/checkout process
  '/messages'         // User messages
]

// Auth-related routes that should not be restricted (to prevent redirect loops)
const authRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/callback',
  '/auth/update-password'
]

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const path = request.nextUrl.pathname

  // Allow access to auth routes without further processing
  if (authRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next()
  }

  try {
    // Create a Supabase client configured to use cookies
    const { supabase, response } = createClient(request)

    // Refresh session if expired & still valid in Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Special case for rent/[id] pages - these are view-only until rental action
    if (path.match(/^\/rent\/[^\/]+$/) && !request.nextUrl.searchParams.has('checkout')) {
      // Allow viewing rental item details without login
      return NextResponse.next()
    }
    
    // If we don't have a session but we're on a protected route, redirect to /auth/signin
    if (!session && isProtectedRoute(path)) {
      const redirectUrl = new URL('/auth/signin', request.nextUrl.origin)
      redirectUrl.searchParams.set('redirectedFrom', path)
      return NextResponse.redirect(redirectUrl)
    }

    // For all other scenarios, continue with the request
    return response
  } catch (error) {
    // If something unexpected happened, continue with the request
    return NextResponse.next()
  }
}

// Check if the current path is in our protected routes list
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => 
    pathname === route || 
    pathname.startsWith(`${route}/`)
  )
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 