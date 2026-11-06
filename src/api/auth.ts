import http from '@/lib/http'

import { ForgotPasswordBodyType, ResetPasswordBodyType } from '@/schema/auth.schema'

// Legacy password recovery endpoints stay unchanged until their backend APIs are ready.
const authApiRequest = {
  confirmResetPasswordOtp: (body: { otp: string; email: string }) => http.post('/auth/otp/reset-password/confirm', body),

  forgotPassword: (body: ForgotPasswordBodyType) => http.post('/auth/reset-password', body),

  resetPassword: (body: ResetPasswordBodyType) => http.post('/auth/reset-password/submit', body),
}

export default authApiRequest
