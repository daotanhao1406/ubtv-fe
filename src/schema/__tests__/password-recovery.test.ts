/** @jest-environment node */

import { ResetPasswordFormSchema } from '@/schema/auth.schema'
import { ForgotPasswordInputSchema, VerifyResetPasswordInputSchema } from '@/schema/auth-api.schema'

const input = { email: '  USER+RESET@EXAMPLE.COM  ', resetToken: 'reset-token', password: '  secret  ', confirmPassword: '  secret  ' }

describe('password recovery validation', () => {
  it('normalizes email across all three steps while preserving codes and credentials', () => {
    expect(ForgotPasswordInputSchema.parse({ email: input.email })).toEqual({ email: 'user+reset@example.com' })
    expect(VerifyResetPasswordInputSchema.parse({ email: input.email, code: '012345' })).toEqual({ email: 'user+reset@example.com', code: '012345' })
    expect(ResetPasswordFormSchema.parse(input)).toEqual({ ...input, email: 'user+reset@example.com' })
  })

  it.each(['12345', '1234567', 'abcdef', ' 12345'])('rejects invalid reset codes: %s', (code) => {
    expect(VerifyResetPasswordInputSchema.safeParse({ email: input.email, code }).success).toBe(false)
  })

  it.each([{ email: '' }, { resetToken: '' }, { confirmPassword: 'secret' }, { password: '\u00e9'.repeat(37), confirmPassword: '\u00e9'.repeat(37) }])('rejects incomplete reset details or invalid passwords: %p', (fields) => {
    expect(ResetPasswordFormSchema.safeParse({ ...input, ...fields }).success).toBe(false)
  })
})
