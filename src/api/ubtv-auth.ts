import authHttp from '@/lib/auth-http'

import type { ForgotPasswordInput, LoginInput, RegisterInput, ResendVerificationInput, ResetPasswordInput, VerifyEmailInput, VerifyResetPasswordInput } from '@/schema/auth-api.schema'

import type { AccessTokenData, AuthMessageData, AuthUser, RegistrationData, VerifyEmailData, VerifyResetPasswordData } from '@/types/auth'

const ubtvAuthApi = {
  register: ({ name, email, password }: RegisterInput) => authHttp.post<RegistrationData>('/auth/register', { name, email, password }),

  verifyEmail: ({ email, code }: VerifyEmailInput) => authHttp.post<VerifyEmailData>('/auth/verify-email', { email, code }),

  resendVerification: ({ email }: ResendVerificationInput) => authHttp.post<AuthMessageData>('/auth/resend-verification', { email }),

  forgotPassword: ({ email }: ForgotPasswordInput) => authHttp.post<AuthMessageData>('/auth/forgot-password', { email }),

  verifyResetPassword: ({ email, code }: VerifyResetPasswordInput) => authHttp.post<VerifyResetPasswordData>('/auth/verify-reset-password', { email, code }),

  resetPassword: ({ email, resetToken, password }: ResetPasswordInput) => authHttp.post<AuthMessageData>('/auth/reset-password', { email, resetToken, password }),

  login: ({ email, password }: LoginInput) => authHttp.post<AccessTokenData>('/auth/login', { email, password }),

  refresh: () => authHttp.post<AccessTokenData>('/auth/refresh'),

  me: (accessToken: string) =>
    authHttp.get<AuthUser>('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  logout: () => authHttp.post<AuthMessageData>('/auth/logout'),
}

export default ubtvAuthApi
