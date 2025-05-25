import { NextRequest, NextResponse } from 'next/server'

// 1. Specify protected and public routes
const protectedRoutes = ['/profile']
export const publicRoutes = ['/login', '/signup', '/forgot-password', '/email-verification']

export default async function middleware(request: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // 3. Decrypt the session from the cookie
  const accessToken = request.cookies.get('accessToken')?.value

  // 4. Redirect
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // if (isPublicRoute && accessToken && !request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
