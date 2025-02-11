import z from 'zod'

export const SignUpBody = z
  .object({
    name: z.string().trim().min(2, { message: 'Full Name must be at least 2 characters' }).max(256),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(100)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/),
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
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type SignUpResType = z.TypeOf<typeof SignUpRes>

export const LoginBody = z
  .object({
    email: z.string().min(2).max(100),
    password: z.string().min(6).max(100),
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginRes = SignUpRes

export type LoginResType = z.TypeOf<typeof LoginRes>
export const SlideSessionBody = z.object({}).strict()

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>
export const SlideSessionRes = SignUpRes

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>
