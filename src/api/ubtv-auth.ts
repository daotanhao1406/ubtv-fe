import authHttp from '@/lib/auth-http'

import type { LoginInput, RegisterInput, ResendVerificationInput, VerifyEmailInput } from '@/schema/auth-api.schema'

import type { AccessTokenData, AuthMessageData, AuthUser, RegistrationData, VerifyEmailData } from '@/types/auth'

const ubtvAuthApi = {
  register: ({ name, email, password }: RegisterInput) => authHttp.post<RegistrationData>('/auth/register', { name, email, password }),

  verifyEmail: ({ email, code }: VerifyEmailInput) => authHttp.post<VerifyEmailData>('/auth/verify-email', { email, code }),

  resendVerification: ({ email }: ResendVerificationInput) => authHttp.post<AuthMessageData>('/auth/resend-verification', { email }),

  login: ({ email, password }: LoginInput) => authHttp.post<AccessTokenData>('/auth/login', { email, password }),

  refresh: () => authHttp.post<AccessTokenData>('/auth/refresh'),

  me: (accessToken: string) =>
    authHttp.get<AuthUser>('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  logout: () => authHttp.post<AuthMessageData>('/auth/logout'),
}

export default ubtvAuthApi
