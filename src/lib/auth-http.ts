import envVariables from '@/lib/env'

import type { ApiErrorResponse, ApiResponse } from '@/types/api'

type AuthRequestOptions = Pick<RequestInit, 'headers'>

export class AuthHttpError extends Error {
  readonly status: number
  readonly payload: ApiErrorResponse
  readonly retryAfter: string | null

  constructor(status: number, payload: ApiErrorResponse, retryAfter: string | null = null) {
    super(Array.isArray(payload.message) ? payload.message.join('\n') : payload.message)
    this.name = 'AuthHttpError'
    this.status = status
    this.payload = payload
    this.retryAfter = retryAfter
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const normalizeError = (status: number, payload: unknown): ApiErrorResponse => {
  const error: ApiErrorResponse = {
    statusCode: status,
    message: `Authentication request failed (${status})`,
  }

  if (isRecord(payload)) {
    if (typeof payload.message === 'string' && payload.message.length > 0) {
      error.message = payload.message
    } else if (Array.isArray(payload.message) && payload.message.length > 0 && payload.message.every((message) => typeof message === 'string')) {
      error.message = payload.message
    }

    if (typeof payload.error === 'string') error.error = payload.error
    if (typeof payload.code === 'string') error.code = payload.code
  }

  return error
}

const request = async <T>(method: 'GET' | 'POST', path: string, body: unknown, options?: AuthRequestOptions): Promise<ApiResponse<T>> => {
  const headers = new Headers(options?.headers)
  headers.set('Accept', 'application/json')

  if (method === 'POST') {
    headers.set('X-App-Request', '1')
    if (body !== undefined) headers.set('Content-Type', 'application/json')
  }

  const baseUrl = envVariables.NEXT_PUBLIC_API_ENDPOINT.replace(/\/+$/, '')
  const response = await fetch(`${baseUrl}/${path.replace(/^\/+/, '')}`, {
    method,
    headers,
    credentials: 'include',
    cache: 'no-store',
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const text = await response.text()
  let payload: unknown
  try {
    payload = JSON.parse(text)
  } catch {
    // Proxy error pages and empty responses are not part of the JSON contract.
  }

  if (!response.ok) {
    throw new AuthHttpError(response.status, normalizeError(response.status, payload), response.headers.get('Retry-After'))
  }

  if (!isRecord(payload) || typeof payload.statusCode !== 'number' || typeof payload.message !== 'string' || !('data' in payload) || typeof payload.timestamp !== 'string') {
    throw new Error('Invalid response from authentication API')
  }

  // Validate the envelope here; endpoint-specific payloads are typed by the caller.
  return payload as unknown as ApiResponse<T>
}

const authHttp = {
  get: <T = Record<string, unknown>>(path: string, options?: AuthRequestOptions) => {
    return request<T>('GET', path, undefined, options)
  },
  post: <T = Record<string, unknown>>(path: string, body?: unknown, options?: AuthRequestOptions) => {
    return request<T>('POST', path, body, options)
  },
}

export default authHttp
