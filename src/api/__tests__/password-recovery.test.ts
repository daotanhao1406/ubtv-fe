/** @jest-environment node */

import { EntityError, HttpError } from '@/lib/http'

import authApiRequest from '@/api/auth'

jest.mock('@/lib/env', () => ({ __esModule: true, default: { NEXT_PUBLIC_API_ENDPOINT: 'https://backend.example' } }))

const email = 'test@example.com'
const contracts = [
  { path: '/auth/reset-password', body: { email }, call: () => authApiRequest.forgotPassword({ email }) },
  { path: '/auth/otp/reset-password/confirm', body: { otp: '012345', email }, call: () => authApiRequest.confirmResetPasswordOtp({ otp: '012345', email }) },
  {
    path: '/auth/reset-password/submit',
    body: { resetToken: 'reset-token', password: '  secret  ', confirmPassword: '  secret  ' },
    call: () => authApiRequest.resetPassword({ resetToken: 'reset-token', password: '  secret  ', confirmPassword: '  secret  ' }),
  },
]

describe('legacy password recovery after auth migration', () => {
  let fetchMock: jest.SpyInstance<ReturnType<typeof fetch>, Parameters<typeof fetch>>

  beforeEach(() => {
    fetchMock = jest.spyOn(globalThis, 'fetch')
  })

  afterEach(() => jest.restoreAllMocks())

  it.each(contracts)('preserves the request and response contract for $path', async ({ path, body, call }) => {
    const payload = { status: 'success', message: 'Success', data: { token: 'legacy-reset-token' } }
    fetchMock.mockResolvedValue(Response.json(payload))
    await expect(call()).resolves.toEqual({ status: 200, payload })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe(`https://backend.example${path}`)
    expect(options).toMatchObject({ method: 'POST', credentials: 'include', body: JSON.stringify(body) })
    expect(new Headers(options?.headers).has('Authorization')).toBe(false)
    expect(options).not.toHaveProperty('signal')
  })

  it('reports a legacy token error without refreshing, redirecting, logging out, or replaying the request', async () => {
    const payload = { status: 'error', message: 'Token invalid', errorCode: '4' }
    fetchMock.mockResolvedValue(Response.json(payload, { status: 401 }))

    const error = await authApiRequest.forgotPassword({ email }).catch((error: unknown) => error)
    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({ status: 401, payload })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('preserves field validation errors for the existing recovery forms', async () => {
    const payload = { message: 'Validation failed', errors: [{ field: 'email', message: 'Invalid email' }] }
    fetchMock.mockResolvedValue(Response.json(payload, { status: 422 }))

    const error = await authApiRequest.forgotPassword({ email }).catch((error: unknown) => error)
    expect(error).toBeInstanceOf(EntityError)
    expect(error).toMatchObject({ status: 422, payload })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('passes a network failure through without retrying', async () => {
    const error = new TypeError('Network failed')
    fetchMock.mockRejectedValue(error)

    await expect(authApiRequest.forgotPassword({ email })).rejects.toBe(error)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
