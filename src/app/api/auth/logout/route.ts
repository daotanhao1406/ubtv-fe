import { cookies } from 'next/headers'

import { HttpError } from '@/lib/http'

import authApiRequest from '@/api/auth'

export async function POST(request: Request) {
  const res = await request.json()
  const force = res.force as boolean | undefined
  if (force) {
    return Response.json(
      {
        message: 'Buộc đăng xuất thành công',
      },
      {
        status: 200,
        headers: {
          // Xóa cookie accessToken
          'Set-Cookie': `accessToken=; Path=/; HttpOnly; Max-Age=0`,
        },
      },
    )
  }
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')
  if (!accessToken) {
    return Response.json(
      { message: 'Không nhận được access token' },
      {
        status: 401,
      },
    )
  }
  try {
    const result = await authApiRequest.logoutFromNextServerToServer(accessToken.value)
    return Response.json(result.payload, {
      status: 200,
      headers: {
        // Xóa cookie accessToken
        'Set-Cookie': `accessToken=; Path=/; HttpOnly; Max-Age=0`,
      },
    })
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      })
    } else {
      return Response.json(
        {
          message: 'Lỗi không xác định',
        },
        {
          status: 500,
        },
      )
    }
  }
}
