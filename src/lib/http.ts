import { redirect } from 'next/navigation'

import envVariables from '@/lib/env'
import { isBrowser, normalizePath } from '@/lib/utils'

import { LoginResType } from '@/schema/auth.schema'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 408

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

const request = async <Response>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: CustomOptions | undefined, isRetry: boolean = false) => {
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
  })
  const payload: Response = await res.json()

  const data = {
    status: res.status,
    payload,
  }
  // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422
          payload: EntityErrorPayload
        },
      )
    } else if (res.status === AUTHENTICATION_ERROR_STATUS && !isRetry) {
      if (isBrowser) {
        // Try to refresh token
        if (!refreshTokenRequest) {
          refreshTokenRequest = fetch(`${baseUrl}/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for refresh token
          })

          try {
            const refreshRes = await refreshTokenRequest
            const refreshData = await refreshRes.json()

            if (!refreshRes.ok) {
              throw new Error('Refresh token failed')
            }

            // Update access token
            const {
              data: { token },
            } = refreshData as LoginResType
            localStorage.setItem('accessToken', token)

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
                location.href = '/login'
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
      const {
        data: { token },
      } = payload as LoginResType
      localStorage.setItem('accessToken', token)
    } else if ('auth/logout' === normalizePath(url)) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('accessTokenExpiresAt')
    }
  }

  return data
}

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('GET', url, options)
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('DELETE', url, { ...options })
  },
}

export default http
