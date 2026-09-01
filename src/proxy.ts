import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

const publicRoutes = ['/login', '/signup', '/booking', '/student']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Update session and get user
  const { supabaseResponse, user } = await updateSession(request)

  // 2. Logic for authenticated users
  if (user) {
    // If logged in and trying to access login/signup, redirect to dashboard
    if (pathname === '/login' || pathname === '/signup') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    // Allow all other routes for authenticated users
    return supabaseResponse
  }

  // 3. Logic for unauthenticated users
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/student') {
      return /^\/student\/[^\/]+\/public$/.test(pathname);
    }
    return pathname.startsWith(route);
  })
  const isRoot = pathname === '/'

  if (!isRoot && !isPublicRoute) {
    // Not logged in and trying to access a protected route
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 4. Force no-cache for login page to prevent back-button issues
  if (pathname === '/login') {
    supabaseResponse.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate')
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
