import http from '@/lib/http'

const userApiRequest = {
  me: (accessToken: string) =>
    http.get('token', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  meClient: () => http.get('token'),
  // updateMe: (body: UpdateUserBodyType) => http.put<UserResType>('account/me', body),
}

export default userApiRequest
