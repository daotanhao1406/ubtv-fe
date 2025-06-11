import { redirect } from 'next/navigation'

import envVariables from '@/lib/env'
import { isBrowser, normalizePath } from '@/lib/utils'

import { CustomResponseType, DefaultResType } from '@/api'

const errorCodes = {
  TOKEN_INVALID: '4',
}

// Define error response interface (for non-success cases)
interface ErrorResponse {
  status: string
  message: string
  errorCode: string
}

// Union type for all possible responses
type ApiResponse = DefaultResType | ErrorResponse | EntityErrorPayload

// Type guard to check if response is error (but not 422 entity error)
function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return 'errorCode' in response && !('errors' in response)
}

// Type guard to check if response is success (DefaultResType)
function isSuccessResponse(response: ApiResponse): response is DefaultResType {
  return 'data' in response && 'status' in response && 'message' in response && !('errorCode' in response) && !('errors' in response)
}

// Type guard to check if response is entity error (422)
function isEntityErrorResponse(response: ApiResponse): response is EntityErrorPayload {
  return 'errors' in response && Array.isArray((response as any).errors)
}

type CustomOptions = Omit<RequestInit, 'method'> & {
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

let clientLogoutRequest: null | Promise<any> = null
let refreshTokenRequest: null | Promise<any> = null

const request = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: CustomOptions | undefined, isRetry: boolean = false): Promise<CustomResponseType> => {
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
  if (isBrowser) {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
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

  const payload: ApiResponse = await res.json()

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
    } else if (isErrorResponse(payload) && payload.errorCode === errorCodes.TOKEN_INVALID && !isRetry) {
      if (isBrowser) {
        // Try to refresh token
        if (!refreshTokenRequest) {
          refreshTokenRequest = fetch(`${baseUrl}/token/refresh-token`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for refresh token
          })
          try {
            const refreshRes = await refreshTokenRequest
            const refreshData: ApiResponse = await refreshRes.json()

            if (!refreshRes.ok || isErrorResponse(refreshData)) {
              throw new Error('Refresh token failed')
            }

            // Update access token
            if (isSuccessResponse(refreshData)) {
              const {
                data: { token },
              } = refreshData
              localStorage.setItem('accessToken', token as string)
            } else {
              throw new Error('Invalid refresh token response format')
            }

            // Reset refresh token request
            refreshTokenRequest = null

            // Retry original request with new token
            return request(method, url, options, true)
          } catch (error: Error | any) {
            // Handle refresh token failure
            if (!clientLogoutRequest) {
              clientLogoutRequest = fetch('/api/auth/logout', {
                method: 'POST',
                body: JSON.stringify({ force: true }),
                headers: {
                  ...baseHeaders,
                } as any,
              })

              try {
                await clientLogoutRequest
              } catch (logoutError: Error | any) {
                throw new Error(logoutError.message || error.message)
              } finally {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('accessTokenExpiresAt')
                clientLogoutRequest = null
                refreshTokenRequest = null
                // location.href = '/login'
              }
            }
          }
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization?.split('Bearer ')[1]
        redirect(`/logout?accessToken=${accessToken}`)
      }
    } else {
      throw new HttpError(data)
    }
  }

  if (isBrowser) {
    if (['auth/login', 'auth/refresh-token'].some((item) => item === normalizePath(url))) {
      if (isSuccessResponse(payload)) {
        const {
          data: { token },
        } = payload
        localStorage.setItem('accessToken', token as string)
      }
    } else if ('auth/logout' === normalizePath(url)) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('accessTokenExpiresAt')
    }
  }

  // At this point, we know the request was successful, so we can safely return
  return {
    status: res.status,
    payload: payload as DefaultResType,
  }
}

const http = {
  get(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request('GET', url, options)
  },
  post(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request('POST', url, { ...options, body })
  },
  put(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request('PUT', url, { ...options, body })
  },
  delete(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request('DELETE', url, { ...options })
  },
}

export default http
