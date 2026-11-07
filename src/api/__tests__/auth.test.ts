/** @jest-environment node */

import { HttpError } from '@/lib/http'

import authApi from '@/api/auth'

jest.mock('@/lib/env', () => ({
  __esModule: true,
  default: { NEXT_PUBLIC_API_ENDPOINT: 'https://backend.example' },
}))

const user = { id: 'user-1', name: 'User', email: 'user@example.com', emailVerified: true }
const session = { accessToken: 'access-token', expiresIn: 900, user }
const registrationForm = { name: 'User', email: user.email, password: '  secret  ', confirmPassword: '  secret  ', username: 'legacy-user' }
const verificationForm = { email: user.email, code: '012345', username: 'legacy-user', otp: '1234' }
const resetForm = { email: user.email, resetToken: 'reset+token&value', password: '  secret  ', confirmPassword: '  secret  ' }

const contracts = [
  {
    name: 'forgotPassword',
    path: '/auth/forgot-password',
    method: 'POST',
    body: { email: user.email },
    status: 200,
    data: { message: 'If eligible, a reset code will be sent' },
    call: () => authApi.forgotPassword(registrationForm),
  },
  {
    name: 'verifyResetPassword',
    path: '/auth/verify-reset-password',
    method: 'POST',
    body: { email: user.email, code: '012345' },
    status: 200,
    data: { resetToken: resetForm.resetToken },
    call: () => authApi.verifyResetPassword(verificationForm),
  },
  {
    name: 'resetPassword',
    path: '/auth/reset-password',
    method: 'POST',
    body: { email: user.email, resetToken: resetForm.resetToken, password: resetForm.password },
    status: 200,
    data: { message: 'Password reset successfully' },
    call: () => authApi.resetPassword(resetForm),
  },
  {
    name: 'register',
    path: '/auth/register',
    method: 'POST',
    body: { name: registrationForm.name, email: user.email, password: registrationForm.password },
    status: 201,
    data: { ...user, emailVerified: false, verificationEmailSent: false },
    call: () => authApi.register(registrationForm),
  },
  {
    name: 'verifyEmail',
    path: '/auth/verify-email',
    method: 'POST',
    body: { email: user.email, code: '012345' },
    status: 200,
    data: { emailVerified: true, message: 'Email verified' },
    call: () => authApi.verifyEmail(verificationForm),
  },
  {
    name: 'resendVerification',
    path: '/auth/resend-verification',
    method: 'POST',
    body: { email: user.email },
    status: 200,
    data: { message: 'If eligible, a verification email will be sent' },
    call: () => authApi.resendVerification(registrationForm),
  },
  {
    name: 'login',
    path: '/auth/login',
    method: 'POST',
    body: { email: user.email, password: registrationForm.password },
    status: 200,
    data: session,
    call: () => authApi.login(registrationForm),
  },
  {
    name: 'refresh',
    path: '/auth/refresh',
    method: 'POST',
    body: undefined,
    status: 200,
    data: session,
    call: () => authApi.refresh(),
  },
  {
    name: 'me',
    path: '/auth/me',
    method: 'GET',
    body: undefined,
    status: 200,
    data: user,
    call: () => authApi.me(session.accessToken),
  },
  {
    name: 'logout',
    path: '/auth/logout',
    method: 'POST',
    body: undefined,
    status: 200,
    data: { message: 'Logged out' },
    call: () => authApi.logout(),
  },
]

describe('authApi backend contract', () => {
  let fetchMock: jest.SpyInstance<ReturnType<typeof fetch>, Parameters<typeof fetch>>

  beforeEach(() => {
    fetchMock = jest.spyOn(globalThis, 'fetch')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it.each(contracts)('$name sends only contract fields and returns the complete envelope', async ({ path, method, body, status, data, call }) => {
    const envelope = { statusCode: status, message: 'Success', data, timestamp: '2026-11-04T00:00:00.000Z' }
    fetchMock.mockResolvedValue(Response.json(envelope, { status }))
    await expect(call()).resolves.toEqual(envelope)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe(`https://backend.example${path}`)
    expect(options).toMatchObject({ method, credentials: 'include' })
    expect(options).not.toHaveProperty('signal')
    expect(options?.body).toBe(body === undefined ? undefined : JSON.stringify(body))
    const headers = new Headers(options?.headers)
    expect(headers.get('Authorization')).toBe(method === 'GET' ? 'Bearer access-token' : null)
    expect(headers.get('X-App-Request')).toBe(method === 'POST' ? '1' : null)
    expect(headers.has('Cookie')).toBe(false)
    expect(headers.has('Origin')).toBe(false)
  })

  it('passes email verification errors to the caller without retrying or starting another auth flow', async () => {
    const payload = { statusCode: 403, message: 'Email verification is required', code: 'EMAIL_NOT_VERIFIED', error: 'Forbidden' }
    fetchMock.mockResolvedValue(Response.json(payload, { status: 403 }))

    const error = await authApi.login(registrationForm).catch((error: unknown) => error)

    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({ status: 403, payload })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it.each([400, 401, 403, 410, 422, 429])('passes reset verification failures through without retries: %s', async (status) => {
    const payload = { statusCode: status, message: 'Reset code is expired, invalid, or locked' }
    fetchMock.mockResolvedValue(Response.json(payload, { status, headers: { 'Retry-After': '90' } }))

    const error = await authApi.verifyResetPassword({ email: user.email, code: '012345' }).catch((error: unknown) => error)

    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({ status, payload, retryAfter: '90' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('does not retry a reset token after the backend rejects it as expired or used', async () => {
    const payload = { statusCode: 400, message: 'Reset token is expired or already used' }
    fetchMock.mockResolvedValue(Response.json(payload, { status: 400 }))

    await expect(authApi.resetPassword(resetForm)).rejects.toMatchObject({ status: 400, payload })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
