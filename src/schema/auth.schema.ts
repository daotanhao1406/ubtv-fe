import z from 'zod'

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict()

export const SignUpBody = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, { message: 'Username must be at least 2 characters' })
      .max(48, { message: 'Username cannot exceed 48 characters' })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: 'Username can only contain letters (a-z, A-Z) and numbers (0-9)',
      }),
    email: z.string().email(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(100),
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(100),
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

export const ForgotPasswordBody = z
  .object({
    email: z.string().email(),
  })
  .strict()

export const ResetPasswordBody = z
  .object({
    resetToken: z.string(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(100),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(100),
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

export type LoginBodyType = z.TypeOf<typeof LoginBody>
export type SignUpBodyType = z.TypeOf<typeof SignUpBody>
export type ForgotPasswordBodyType = z.TypeOf<typeof ForgotPasswordBody>
export type ResetPasswordBodyType = z.TypeOf<typeof ResetPasswordBody>
