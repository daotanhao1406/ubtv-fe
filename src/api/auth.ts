import http from '@/lib/http'

import { LoginBodyType, LoginResType, RegisterBodyType, RegisterResType, SlideSessionResType } from '@/schema/auth.schema'
import { MessageResType } from '@/schema/common.schema'

const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),

  register: (body: RegisterBodyType) => http.post<RegisterResType>('/auth/register', body),

  refreshToken: (body: { refreshToken: string }) => http.post<LoginResType>('/auth/refresh', body),

  // Set access token to cookies in next server
  authToNextServer: (body: { accessToken: string; expiresAt: string }) =>
    http.post('/api/auth', body, {
      baseUrl: '',
    }),

  logoutFromNextServerToServer: (accessToken: string) =>
    http.post<MessageResType>(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ),

  logoutFromNextClientToNextServer: (force?: boolean | undefined, signal?: AbortSignal | undefined) =>
    http.post<MessageResType>(
      '/api/auth/logout',
      {
        force,
      },
      {
        baseUrl: '',
        signal,
      },
    ),

  slideSessionFromNextServerToServer: (accessToken: string) =>
    http.post<SlideSessionResType>(
      '/auth/slide-session',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ),

  slideSessionFromNextClientToNextServer: () => http.post<SlideSessionResType>('/api/auth/slide-session', {}, { baseUrl: '' }),
}

export default authApiRequest
