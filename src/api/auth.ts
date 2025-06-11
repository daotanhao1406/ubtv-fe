import http from '@/lib/http'

import { ForgotPasswordBodyType, LoginBodyType, ResetPasswordBodyType, SignUpBodyType } from '@/schema/auth.schema'

const authApiRequest = {
  login: (body: LoginBodyType) => http.post('/auth/login', body),

  register: (body: SignUpBodyType) => http.post('/auth/register', body),

  confirmResgisterOtp: (body: { otp: string; username: string }) => http.put('/auth/otp', body),

  confirmResetPasswordOtp: (body: { otp: string; email: string }) => http.post('/auth/otp/reset-password/confirm', body),

  forgotPassword: (body: ForgotPasswordBodyType) => http.post('/auth/reset-password', body),

  resetPassword: (body: ResetPasswordBodyType) => http.post('/auth/reset-password/submit', body),

  refreshToken: () => http.get('/auth/refresh'),

  // Set access token to cookies in next server
  authToNextServer: (body: { accessToken: string; refreshToken: string }) =>
    http.post('/api/auth', body, {
      baseUrl: '',
    }),

  logoutFromNextServerToServer: (accessToken: string) =>
    http.post(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ),

  logoutFromNextClientToNextServer: (force?: boolean | undefined, signal?: AbortSignal | undefined) =>
    http.post(
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
    http.post(
      '/auth/slide-session',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ),

  slideSessionFromNextClientToNextServer: () => http.post('/api/auth/slide-session', {}, { baseUrl: '' }),
}

export default authApiRequest
