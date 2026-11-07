import http from '@/lib/http'

import type { ForgotPasswordInput, LoginInput, RegisterInput, ResendVerificationInput, ResetPasswordInput, VerifyEmailInput, VerifyResetPasswordInput } from '@/schema/auth-api.schema'

import type { AccessTokenData, AuthMessageData, AuthUser, RegistrationData, VerifyEmailData, VerifyResetPasswordData } from '@/types/auth'

const authApi = {
  register: ({ name, email, password }: RegisterInput) => http.post<RegistrationData>('/auth/register', { name, email, password }),

  verifyEmail: ({ email, code }: VerifyEmailInput) => http.post<VerifyEmailData>('/auth/verify-email', { email, code }),

  resendVerification: ({ email }: ResendVerificationInput) => http.post<AuthMessageData>('/auth/resend-verification', { email }),

  forgotPassword: ({ email }: ForgotPasswordInput) => http.post<AuthMessageData>('/auth/forgot-password', { email }),

  verifyResetPassword: ({ email, code }: VerifyResetPasswordInput) => http.post<VerifyResetPasswordData>('/auth/verify-reset-password', { email, code }),

  resetPassword: ({ email, resetToken, password }: ResetPasswordInput) => http.post<AuthMessageData>('/auth/reset-password', { email, resetToken, password }),

  login: ({ email, password }: LoginInput) => http.post<AccessTokenData>('/auth/login', { email, password }),

  refresh: () => http.post<AccessTokenData>('/auth/refresh'),

  me: (accessToken: string) =>
    http.get<AuthUser>('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  logout: () => http.post<AuthMessageData>('/auth/logout'),
}

export default authApi
