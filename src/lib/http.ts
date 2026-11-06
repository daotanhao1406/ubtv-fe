import envVariables from '@/lib/env'

import { CustomResponseType, DefaultResType } from '@/api'

// Define error response interface (for non-success cases)
interface ErrorResponse {
  status: string
  message: string
  errorCode: string
}

// Union type for all possible responses
type LegacyResponse = DefaultResType | ErrorResponse | EntityErrorPayload

// Type guard to check if response is entity error (422)
const isEntityErrorResponse = (response: LegacyResponse): response is EntityErrorPayload => {
  return 'errors' in response && Array.isArray((response as any).errors)
}

type CustomOptions = Omit<RequestInit, 'method' | 'signal'> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }
  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error')
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: 422
  payload: EntityErrorPayload
  constructor({ status, payload }: { status: 422; payload: EntityErrorPayload }) {
    super({ status, payload })
    this.status = status
    this.payload = payload
  }
}

// Kept for the legacy password recovery API; authentication belongs to auth-session.ts.
const request = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: CustomOptions | undefined): Promise<CustomResponseType> => {
  let body: FormData | string | undefined = undefined
  if (options?.body instanceof FormData) {
    body = options.body
  } else if (options?.body) {
    body = JSON.stringify(options.body)
  }
  const baseHeaders: {
    [key: string]: string
  } =
    body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json',
        }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl = options?.baseUrl === undefined ? envVariables.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
    credentials: 'include',
  })

  const payload: LegacyResponse = await res.json()

  const data: CustomResponseType = {
    status: res.status,
    payload: payload as DefaultResType,
  }

  // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      // For 422 errors, we expect EntityErrorPayload format
      if (isEntityErrorResponse(payload)) {
        throw new EntityError({
          status: 422,
          payload: payload,
        })
      } else {
        // Fallback for unexpected 422 format
        throw new EntityError({
          status: 422,
          payload: {
            message: 'Validation error',
            errors: [],
          },
        })
      }
    } else {
      throw new HttpError(data)
    }
  }

  // At this point, we know the request was successful, so we can safely return
  return data
}

const http = {
  get: (url: string, options?: Omit<CustomOptions, 'body'> | undefined) => {
    return request('GET', url, options)
  },
  post: (url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) => {
    return request('POST', url, { ...options, body })
  },
  put: (url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) => {
    return request('PUT', url, { ...options, body })
  },
  delete: (url: string, options?: Omit<CustomOptions, 'body'> | undefined) => {
    return request('DELETE', url, { ...options })
  },
}

export default http
