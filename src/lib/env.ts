/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Configuration for type-safe environment variables.
 * Imported through src/app/page.tsx
 * @see https://x.com/mattpocockuk/status/1760991147793449396
 */
import { z } from 'zod'

const configSchemaEnv = z.object({
  NEXT_PUBLIC_SHOW_LOGGER: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_DEV_URL: z.string(),
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
})

const envConfig = configSchemaEnv.safeParse({
  NEXT_PUBLIC_SHOW_LOGGER: process.env.NEXT_PUBLIC_SHOW_LOGGER,
  NEXT_PUBLIC_DEV_URL: process.env.NEXT_PUBLIC_DEV_URL,
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
})
if (!envConfig.success) {
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}

const envVariables = envConfig.data
export default envVariables
