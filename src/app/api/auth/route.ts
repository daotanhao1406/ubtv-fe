import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const accessToken = body.accessToken as string
  const refreshToken = body.refreshToken as string

  if (!accessToken) {
    return NextResponse.json(
      { message: 'Không nhận được access token' },
      {
        status: 400,
      },
    )
  }

  const res = NextResponse.json({ message: 'Đã lưu token' }, { status: 200 })

  res.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 8 * 60,
    path: '/',
  })

  if (refreshToken) {
    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 7 * 24 * 60 * 60, // 7 ngày
      path: '/',
    })
  }

  return res
  // return NextResponse.json(body, {
  //   status: 200,
  //   headers: {
  //     'Set-Cookie': `accessToken=${accessToken}; Path=/; HttpOnly; max-age=${expiresAt}; SameSite=Lax; Secure`,
  //   },
  // })
}
