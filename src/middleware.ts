import { NextRequest, NextResponse } from 'next/server'

const middleware = (request: NextRequest) => {
  const response = NextResponse.next()

  // These cookies belong to the previous flow. The backend owns ubtv.refresh;
  // the client layout checks authentication after restoring the in-memory session.
  for (const name of ['accessToken', 'refreshToken']) {
    if (request.cookies.has(name)) response.cookies.delete(name)
  }

  return response
}

export default middleware

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
