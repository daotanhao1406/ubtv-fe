/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Configuration for type-safe environment variables.
 * Imported through src/app/page.tsx
 * @see https://x.com/mattpocockuk/status/1760991147793449396
 */
import { z } from 'zod'

const configSchemaEnv = z.object({
  NEXT_PUBLIC_MOVIE_API: z.string(),
  NEXT_PUBLIC_API_ENDPOINT: z.string().url(),
})

const envConfig = configSchemaEnv.safeParse({
  NEXT_PUBLIC_MOVIE_API: process.env.NEXT_PUBLIC_MOVIE_API,
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
})
if (!envConfig.success) {
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}

const envVariables = envConfig.data
export default envVariables
