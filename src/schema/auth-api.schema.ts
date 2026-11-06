import { z } from 'zod'

const emailSchema = z.string().trim().toLowerCase().email().max(254)

const passwordSchema = z
  .string()
  .refine((value) => Array.from(value).length >= 6, { message: 'Password must be at least 6 characters' })
  .refine((value) => new TextEncoder().encode(value).length <= 72, { message: 'Password cannot exceed 72 bytes in UTF-8' })

export const LoginInputSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict()

export const RegisterInputSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: emailSchema,
    password: passwordSchema,
  })
  .strict()

export const VerifyEmailInputSchema = z
  .object({
    email: emailSchema,
    code: z.string().regex(/^[0-9]{6}$/, { message: 'Verification code must be exactly 6 digits' }),
  })
  .strict()

export const ResendVerificationInputSchema = z
  .object({
    email: emailSchema,
  })
  .strict()

export type LoginInput = z.infer<typeof LoginInputSchema>
export type RegisterInput = z.infer<typeof RegisterInputSchema>
export type VerifyEmailInput = z.infer<typeof VerifyEmailInputSchema>
export type ResendVerificationInput = z.infer<typeof ResendVerificationInputSchema>
