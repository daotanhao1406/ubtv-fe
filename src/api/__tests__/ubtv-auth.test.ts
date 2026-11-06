/** @jest-environment node */

import { AuthHttpError } from '@/lib/auth-http'

import ubtvAuthApi from '@/api/ubtv-auth'

jest.mock('@/lib/env', () => ({
  __esModule: true,
  default: { NEXT_PUBLIC_API_ENDPOINT: 'https://backend.example' },
}))

const user = { id: 'user-1', name: 'User', email: 'user@example.com', emailVerified: true }
const session = { accessToken: 'access-token', expiresIn: 900, user }
const registrationForm = { name: 'User', email: user.email, password: '  secret  ', confirmPassword: '  secret  ', username: 'legacy-user' }
const verificationForm = { email: user.email, code: '012345', username: 'legacy-user', otp: '1234' }

const contracts = [
  {
    name: 'register',
    path: '/auth/register',
    method: 'POST',
    body: { name: registrationForm.name, email: user.email, password: registrationForm.password },
    status: 201,
    data: { ...user, emailVerified: false, verificationEmailSent: false },
    call: () => ubtvAuthApi.register(registrationForm),
  },
  {
    name: 'verifyEmail',
    path: '/auth/verify-email',
    method: 'POST',
    body: { email: user.email, code: '012345' },
    status: 200,
    data: { emailVerified: true, message: 'Email verified' },
    call: () => ubtvAuthApi.verifyEmail(verificationForm),
  },
  {
    name: 'resendVerification',
    path: '/auth/resend-verification',
    method: 'POST',
    body: { email: user.email },
    status: 200,
    data: { message: 'If eligible, a verification email will be sent' },
    call: () => ubtvAuthApi.resendVerification(registrationForm),
  },
  {
    name: 'login',
    path: '/auth/login',
    method: 'POST',
    body: { email: user.email, password: registrationForm.password },
    status: 200,
    data: session,
    call: () => ubtvAuthApi.login(registrationForm),
  },
  {
    name: 'refresh',
    path: '/auth/refresh',
    method: 'POST',
    body: undefined,
    status: 200,
    data: session,
    call: () => ubtvAuthApi.refresh(),
  },
  {
    name: 'me',
    path: '/auth/me',
    method: 'GET',
    body: undefined,
    status: 200,
    data: user,
    call: () => ubtvAuthApi.me(session.accessToken),
  },
  {
    name: 'logout',
    path: '/auth/logout',
    method: 'POST',
    body: undefined,
    status: 200,
    data: { message: 'Logged out' },
    call: () => ubtvAuthApi.logout(),
  },
]

describe('ubtvAuthApi backend contract', () => {
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

    const error = await ubtvAuthApi.login(registrationForm).catch((error: unknown) => error)

    expect(error).toBeInstanceOf(AuthHttpError)
    expect(error).toMatchObject({ status: 403, payload })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
