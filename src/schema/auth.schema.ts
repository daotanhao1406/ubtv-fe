import z from 'zod'

import { RegisterInputSchema, ResetPasswordInputSchema } from '@/schema/auth-api.schema'

export const SignUpBody = z
  .object({
    username: RegisterInputSchema.shape.name,
    email: RegisterInputSchema.shape.email,
    password: RegisterInputSchema.shape.password,
    confirmPassword: RegisterInputSchema.shape.password,
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: "Password confirmation doesn't match Password",
        path: ['confirmPassword'],
      })
    }
  })

export type SignUpBodyType = z.TypeOf<typeof SignUpBody>

export const ResetPasswordFormSchema = ResetPasswordInputSchema.extend({
  confirmPassword: ResetPasswordInputSchema.shape.password,
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({ code: 'custom', message: "Password confirmation doesn't match Password", path: ['confirmPassword'] })
  }
})

export type ResetPasswordFormInput = z.infer<typeof ResetPasswordFormSchema>
