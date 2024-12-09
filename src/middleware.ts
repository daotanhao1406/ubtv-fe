import { NextRequest, NextResponse } from 'next/server'

// 1. Specify protected and public routes
const protectedRoutes = ['/profile', '/']
const publicRoutes = ['/login', '/signup']

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
