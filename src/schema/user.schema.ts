import z from 'zod'

export const UserRes = z
  .object({
    status: z.string(),
    message: z.string(),
    data: z.object({
      username: z.string(),
      email: z.string(),
      active: z.boolean(),
      role: z.string(),
    }),
  })
  .strict()

export type UserResType = z.TypeOf<typeof UserRes>

export const UpdateUserBody = z.object({
  name: z.string().trim().min(2).max(256),
})

export type UpdateUserBodyType = z.TypeOf<typeof UpdateUserBody>
