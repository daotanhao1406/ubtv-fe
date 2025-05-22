import z from 'zod'

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

export type SignUpBodyType = z.TypeOf<typeof SignUpBody>

export const SignUpRes = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    token: z.string(),
    tokenType: z.string(),
    expireTime: z.date(),
  }),
})

export type SignUpResType = z.TypeOf<typeof SignUpRes>

export const LoginBody = z
  .object({
    username: z.string().min(2).max(48),
    password: z.string().min(6).max(100),
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginRes = SignUpRes

export type LoginResType = z.TypeOf<typeof LoginRes>

// create Forgot password body, forgot password type
export const ForgotPasswordBody = z
  .object({
    email: z.string().email(),
  })
  .strict()

export type ForgotPasswordBodyType = z.TypeOf<typeof ForgotPasswordBody>

export const SlideSessionBody = z.object({}).strict()

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>
export const SlideSessionRes = SignUpRes

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>
