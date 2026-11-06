/** @jest-environment node */

import authHttp, { AuthHttpError } from '@/lib/auth-http'

jest.mock('@/lib/env', () => ({
  __esModule: true,
  default: { NEXT_PUBLIC_API_ENDPOINT: 'https://backend.example/' },
}))

const success = {
  statusCode: 200,
  message: 'Success',
  data: { id: 'user-1' },
  timestamp: '2026-11-04T00:00:00.000Z',
}

describe('authHttp', () => {
  let fetchMock: jest.SpyInstance<ReturnType<typeof fetch>, Parameters<typeof fetch>>

  beforeEach(() => {
    fetchMock = jest.spyOn(globalThis, 'fetch')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns the success envelope once and forwards explicit Bearer credentials', async () => {
    fetchMock.mockResolvedValue(Response.json(success))

    const result = await authHttp.get<{ id: string }>('/auth/me', {
      headers: new Headers({ Authorization: 'Bearer access-token' }),
    })

    expect(result).toEqual(success)
    expect(result.data.id).toBe('user-1')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://backend.example/auth/me')
    expect(options).toMatchObject({ method: 'GET', credentials: 'include', cache: 'no-store' })
    expect(options).not.toHaveProperty('signal')
    const headers = new Headers(options?.headers)
    expect(headers.get('Accept')).toBe('application/json')
    expect(headers.get('Authorization')).toBe('Bearer access-token')
    expect(headers.has('Cookie')).toBe(false)
    expect(headers.has('Origin')).toBe(false)
  })

  it('serializes JSON and sets the required POST header without altering the request data', async () => {
    const body = { email: 'user@example.com', password: '  secret  ' }
    const envelope = { ...success, statusCode: 201, message: 'Created' }
    fetchMock.mockResolvedValue(Response.json(envelope, { status: 201 }))

    await expect(authHttp.post('auth/register', body, { headers: { 'x-app-request': '0', 'X-Custom': 'value' } })).resolves.toEqual(envelope)

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://backend.example/auth/register')
    expect(options).toMatchObject({ method: 'POST', credentials: 'include', body: JSON.stringify(body) })
    const headers = new Headers(options?.headers)
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(headers.get('X-App-Request')).toBe('1')
    expect(headers.get('X-Custom')).toBe('value')
    expect(headers.has('Authorization')).toBe(false)
    expect(headers.has('Cookie')).toBe(false)
    expect(headers.has('Origin')).toBe(false)
  })

  it('supports cookie-based POST requests without a body or Bearer token', async () => {
    fetchMock.mockResolvedValue(Response.json(success))

    await authHttp.post('/auth/refresh')

    const options = fetchMock.mock.calls[0][1]
    expect(options).toMatchObject({ method: 'POST', credentials: 'include' })
    expect(options?.body).toBeUndefined()
    const headers = new Headers(options?.headers)
    expect(headers.get('X-App-Request')).toBe('1')
    expect(headers.has('Authorization')).toBe(false)
  })

  it.each([null, ['item'], { data: { id: 'nested' } }])('preserves the endpoint payload without unwrapping it again: %p', async (data) => {
    const envelope = { ...success, data }
    fetchMock.mockResolvedValue(Response.json(envelope))

    await expect(authHttp.get('/auth/me')).resolves.toEqual(envelope)
  })

  it('preserves validation messages as an array and provides a readable Error message', async () => {
    const payload = { statusCode: 400, message: ['email must be an email', 'password is too short'], error: 'Bad Request' }
    fetchMock.mockResolvedValue(Response.json(payload, { status: 400 }))

    const error = await authHttp.post('/auth/register', {}).catch((error: unknown) => error)

    expect(error).toBeInstanceOf(AuthHttpError)
    expect(error).toMatchObject({ name: 'AuthHttpError', status: 400, payload, message: payload.message.join('\n') })
  })

  it('preserves the top-level email verification code on 403', async () => {
    const payload = { statusCode: 403, message: 'Email verification is required', error: 'Forbidden', code: 'EMAIL_NOT_VERIFIED' }
    fetchMock.mockResolvedValue(Response.json(payload, { status: 403 }))

    await expect(authHttp.post('/auth/login', {})).rejects.toMatchObject({ status: 403, payload, message: payload.message })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('does not invent an email verification code for other 403 responses', async () => {
    fetchMock.mockResolvedValue(Response.json({ message: 'Invalid request origin' }, { status: 403 }))

    await expect(authHttp.post('/auth/login', {})).rejects.toMatchObject({
      status: 403,
      payload: { statusCode: 403, message: 'Invalid request origin' },
    })
  })

  it.each(['/auth/login', '/auth/refresh', '/auth/logout', '/auth/me'])('rejects 401 without refreshing, retrying or logging out: %s', async (path) => {
    fetchMock.mockResolvedValue(Response.json({ statusCode: 401, message: 'Unauthorized' }, { status: 401 }))

    const result = path === '/auth/me' ? authHttp.get(path) : authHttp.post(path)

    await expect(result).rejects.toMatchObject({ status: 401, payload: { statusCode: 401, message: 'Unauthorized' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('keeps Retry-After when the response exposes it', async () => {
    fetchMock.mockResolvedValue(Response.json({ message: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '60' } }))

    await expect(authHttp.post('/auth/login', {})).rejects.toMatchObject({ status: 429, retryAfter: '60' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('uses the real HTTP status rather than a conflicting body statusCode', async () => {
    fetchMock.mockResolvedValue(Response.json({ statusCode: 200, message: 'Unauthorized' }, { status: 401 }))

    await expect(authHttp.get('/auth/me')).rejects.toMatchObject({ status: 401, payload: { statusCode: 401 } })
  })

  it.each(['<html>Private proxy diagnostic</html>', '', '{invalid json'])('normalizes non-JSON HTTP errors without exposing their raw body: %p', async (body) => {
    fetchMock.mockResolvedValue(new Response(body, { status: 502 }))

    await expect(authHttp.post('/auth/refresh')).rejects.toMatchObject({
      status: 502,
      payload: { statusCode: 502, message: 'Authentication request failed (502)' },
      retryAfter: null,
    })
  })

  it('ignores malformed error fields instead of passing arbitrary values to callers', async () => {
    fetchMock.mockResolvedValue(Response.json({ message: ['message', 123], code: {}, error: [] }, { status: 500 }))

    await expect(authHttp.post('/auth/login', {})).rejects.toMatchObject({
      status: 500,
      payload: { statusCode: 500, message: 'Authentication request failed (500)' },
    })
  })

  it.each(['<html>Hosting error</html>', '', '{invalid json'])('rejects a non-JSON successful response: %p', async (body) => {
    fetchMock.mockResolvedValue(new Response(body, { status: 200 }))

    await expect(authHttp.post('/auth/login', {})).rejects.toThrow('Invalid response from authentication API')
  })

  it.each([null, [], { ...success, data: undefined }, { ...success, statusCode: '200' }, { ...success, message: [] }, { ...success, timestamp: undefined }])('rejects an invalid success envelope: %p', async (payload) => {
    fetchMock.mockResolvedValue(Response.json(payload))

    await expect(authHttp.get('/auth/me')).rejects.toThrow('Invalid response from authentication API')
  })

  it('preserves network errors without treating them as an expired session', async () => {
    const error = new TypeError('Failed to fetch')
    fetchMock.mockRejectedValue(error)

    await expect(authHttp.post('/auth/refresh')).rejects.toBe(error)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('preserves response body read failures as transport errors', async () => {
    const error = new TypeError('Connection closed')
    const response = Response.json(success)
    jest.spyOn(response, 'text').mockRejectedValue(error)
    fetchMock.mockResolvedValue(response)

    await expect(authHttp.post('/auth/refresh')).rejects.toBe(error)
  })
})
