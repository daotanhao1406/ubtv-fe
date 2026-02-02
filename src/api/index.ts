import { z } from 'zod'

export const DefaultRes = z.object({
  status: z.string(),
  message: z.string(),
  data: z.record(z.any()),
})

export const CustomResponse = z.object({
  status: z.number(),
  payload: DefaultRes,
})

export type CustomResponseType = z.TypeOf<typeof CustomResponse>

export type DefaultResType = z.TypeOf<typeof DefaultRes>
