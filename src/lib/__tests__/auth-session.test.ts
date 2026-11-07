/** @jest-environment node */

import { AuthHttpError } from '@/lib/auth-http'
import { createAuthSession, getAuthSession } from '@/lib/auth-session'

import type { ApiResponse } from '@/types/api'
import type { AccessTokenData, AuthUser } from '@/types/auth'

jest.mock('@/lib/env', () => ({ __esModule: true, default: { NEXT_PUBLIC_API_ENDPOINT: 'https://backend.example' } }))

const user: AuthUser = { id: 'user-1', name: 'User', email: 'user@example.com', emailVerified: true }
const credentials = { email: user.email, password: 'secret' }
const envelope = <T>(data: T): ApiResponse<T> => ({ statusCode: 200, message: 'Success', data, timestamp: '2026-11-04T00:00:00Z' })
const tokens = (accessToken = 'token-1', profile = user) => envelope({ accessToken, expiresIn: 900, user: profile })
const httpError = (status: number, code?: string) => new AuthHttpError(status, { statusCode: status, message: 'Request failed', code })
const tick = () => new Promise<void>((resolve) => setImmediate(resolve))

const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

const setup = () => {
  const api = {
    login: jest.fn().mockResolvedValue(tokens()),
    refresh: jest.fn().mockResolvedValue(tokens('token-2')),
    logout: jest.fn().mockResolvedValue(envelope({ message: 'Logged out' })),
    me: jest.fn().mockResolvedValue(envelope(user)),
  }
  return { api, session: createAuthSession(api) }
}

describe('auth session', () => {
  it('clears a session locally after a password reset and requires an explicit login', async () => {
    const { api, session } = setup()
    await session.login(credentials)

    session.clearSession()

    await expect(session.fetchMe()).rejects.toThrow('Please sign in again')
    await expect(session.refresh()).rejects.toThrow('Please sign in again')
    expect(api.logout).not.toHaveBeenCalled()
    expect(api.me).not.toHaveBeenCalled()
    expect(api.refresh).not.toHaveBeenCalled()

    await session.login(credentials)
    await expect(session.fetchMe()).resolves.toEqual(user)
  })

  it('ignores an in-flight refresh after the session is cleared locally', async () => {
    const { api, session } = setup()
    const pending = deferred<ApiResponse<AccessTokenData>>()
    api.refresh.mockReturnValueOnce(pending.promise)
    const refresh = session.refresh().catch((error: unknown) => error)
    await tick()

    session.clearSession()
    pending.resolve(tokens('stale-token'))

    await expect(refresh).resolves.toEqual(new Error('Authentication session changed'))
    await expect(session.fetchMe()).rejects.toThrow('Please sign in again')
    expect(api.refresh).toHaveBeenCalledTimes(1)
  })

  it('returns the login user and uses the token in memory for profile requests', async () => {
    const { api, session } = setup()
    await expect(session.login(credentials)).resolves.toEqual(user)
    expect(api.me).not.toHaveBeenCalled()
    await expect(session.fetchMe()).resolves.toEqual(user)

    expect(api.me).toHaveBeenCalledWith('token-1')
    expect(api.refresh).not.toHaveBeenCalled()
  })

  it('restores a missing token through one shared refresh without an extra profile request', async () => {
    const { api, session } = setup()

    await expect(Promise.all([session.fetchMe(), session.fetchMe(), session.refresh()])).resolves.toEqual([user, user, user])

    expect(api.refresh).toHaveBeenCalledTimes(1)
    expect(api.me).not.toHaveBeenCalled()
  })

  it.each([401, 403])('passes login errors through without trying refresh: %s', async (status) => {
    const { api, session } = setup()
    const error = httpError(status, status === 403 ? 'EMAIL_NOT_VERIFIED' : undefined)
    api.login.mockRejectedValueOnce(error)

    await expect(session.login(credentials)).rejects.toBe(error)
    expect(api.refresh).not.toHaveBeenCalled()

    await expect(session.login(credentials)).resolves.toEqual(user)
  })

  it('shares refresh across concurrent 401s and replays each profile request once', async () => {
    const { api, session } = setup()
    await session.login(credentials)
    api.me.mockImplementation(async (token: string) => {
      if (token === 'token-1') throw httpError(401)
      return envelope(user)
    })

    await expect(Promise.all([session.fetchMe(), session.fetchMe(), session.fetchMe()])).resolves.toEqual([user, user, user])

    expect(api.refresh).toHaveBeenCalledTimes(1)
    expect(api.me.mock.calls.filter(([token]) => token === 'token-2')).toHaveLength(3)
  })

  it('retries a late 401 using the new token without another refresh', async () => {
    const { api, session } = setup()
    await session.login(credentials)
    const pending = deferred<ApiResponse<AuthUser>>()
    api.me.mockReturnValueOnce(pending.promise)
    const profile = session.fetchMe()
    await tick()

    await session.refresh()
    pending.reject(httpError(401))

    await expect(profile).resolves.toEqual(user)
    expect(api.refresh).toHaveBeenCalledTimes(1)
    expect(api.me).toHaveBeenLastCalledWith('token-2')
  })

  it('stops after one retry and clears an invalid token', async () => {
    const { api, session } = setup()
    await session.login(credentials)
    const error = httpError(401)
    api.me.mockRejectedValue(error)

    await expect(session.fetchMe()).rejects.toBe(error)
    await expect(session.fetchMe()).rejects.toThrow('Please sign in again')

    expect(api.me).toHaveBeenCalledTimes(2)
    expect(api.refresh).toHaveBeenCalledTimes(1)
  })

  it.each([new TypeError('Network failed'), httpError(403), httpError(429), httpError(500)])('clears the session after any refresh failure and requires a new login: %p', async (error) => {
    const { api, session } = setup()
    await session.login(credentials)
    api.refresh.mockRejectedValueOnce(error)

    await expect(session.refresh()).rejects.toBe(error)
    await expect(session.fetchMe()).rejects.toThrow('Please sign in again')
    await expect(session.refresh()).rejects.toThrow('Please sign in again')
    expect(api.refresh).toHaveBeenCalledTimes(1)
    expect(api.me).not.toHaveBeenCalled()

    await session.login(credentials)
    await expect(session.fetchMe()).resolves.toEqual(user)
    expect(api.me).toHaveBeenCalledWith('token-1')
  })

  it.each([401, 403])('blocks restore after a terminal refresh error: %s', async (status) => {
    const { api, session } = setup()
    const error = httpError(status, status === 403 ? 'EMAIL_NOT_VERIFIED' : undefined)
    api.refresh.mockRejectedValue(error)

    await expect(session.refresh()).rejects.toBe(error)
    await expect(session.fetchMe()).rejects.toThrow('Please sign in again')
    expect(api.refresh).toHaveBeenCalledTimes(1)
  })

  it.each([httpError(403), httpError(429), httpError(500), new TypeError('Network failed')])('clears the session without refreshing after a non-401 profile error: %p', async (error) => {
    const { api, session } = setup()
    await session.login(credentials)
    api.me.mockRejectedValue(error)

    await expect(session.fetchMe()).rejects.toBe(error)
    await expect(session.fetchMe()).rejects.toThrow('Please sign in again')
    expect(api.me).toHaveBeenCalledTimes(1)
    expect(api.refresh).not.toHaveBeenCalled()
  })

  it('does not clear a new session when an older profile request fails', async () => {
    const { api, session } = setup()
    await session.login(credentials)
    const pending = deferred<ApiResponse<AuthUser>>()
    api.me.mockReturnValueOnce(pending.promise)
    const profile = session.fetchMe().catch((error: unknown) => error)
    await tick()

    api.login.mockResolvedValueOnce(tokens('new-token'))
    await session.login(credentials)
    pending.reject(new TypeError('Old request failed'))

    await expect(profile).resolves.toEqual(new Error('Authentication session changed'))
    await expect(session.fetchMe()).resolves.toEqual(user)
    expect(api.me).toHaveBeenLastCalledWith('new-token')
    expect(api.refresh).not.toHaveBeenCalled()
  })

  it('waits for refresh before logout and does not accept the stale token', async () => {
    const { api, session } = setup()
    await session.login(credentials)
    const pending = deferred<ApiResponse<AccessTokenData>>()
    api.refresh.mockReturnValueOnce(pending.promise)
    const refresh = session.refresh().catch((error: unknown) => error)
    await tick()

    const logout = session.logout()
    expect(api.logout).not.toHaveBeenCalled()
    pending.resolve(tokens('stale-token'))

    await expect(refresh).resolves.toEqual(new Error('Authentication session changed'))
    await logout
    await expect(session.fetchMe()).rejects.toThrow('Please sign in again')
    expect(api.logout).toHaveBeenCalledTimes(1)
  })

  it('clears the token even when logout fails and permits retrying logout', async () => {
    const { api, session } = setup()
    await session.login(credentials)
    const error = new TypeError('Network failed')
    api.logout.mockRejectedValueOnce(error)

    await expect(session.logout()).rejects.toBe(error)
    await expect(session.fetchMe()).rejects.toThrow('Please sign in again')
    expect(api.me).not.toHaveBeenCalled()
    expect(api.refresh).not.toHaveBeenCalled()
    await session.logout()
    expect(api.logout).toHaveBeenCalledTimes(2)
  })

  it('rejects a profile response belonging to an old session', async () => {
    const { api, session } = setup()
    await session.login(credentials)
    const pending = deferred<ApiResponse<AuthUser>>()
    api.me.mockReturnValueOnce(pending.promise)
    const profile = session.fetchMe().catch((error: unknown) => error)
    await tick()

    await session.logout()
    pending.resolve(envelope(user))

    await expect(profile).resolves.toEqual(new Error('Authentication session changed'))
  })

  it('does not let a pending login restore the session after logout', async () => {
    const { api, session } = setup()
    const pending = deferred<ApiResponse<AccessTokenData>>()
    api.login.mockReturnValueOnce(pending.promise)
    const login = session.login(credentials).catch((error: unknown) => error)
    await tick()

    const logout = session.logout()
    expect(api.logout).not.toHaveBeenCalled()
    pending.resolve(tokens())

    await expect(login).resolves.toEqual(new Error('Authentication session changed'))
    await logout
    await expect(session.fetchMe()).rejects.toThrow('Please sign in again')
  })

  it('rejects old profile data after changing accounts', async () => {
    const { api, session } = setup()
    await session.login(credentials)
    const pending = deferred<ApiResponse<AuthUser>>()
    api.me.mockReturnValueOnce(pending.promise)
    const profile = session.fetchMe().catch((error: unknown) => error)
    await tick()
    const otherUser = { ...user, id: 'user-2', email: 'other@example.com' }
    api.login.mockResolvedValueOnce(tokens('other-token', otherUser))

    await expect(session.login({ ...credentials, email: otherUser.email })).resolves.toEqual(otherUser)
    pending.resolve(envelope(user))

    await expect(profile).resolves.toEqual(new Error('Authentication session changed'))
    await session.fetchMe()
    expect(api.me).toHaveBeenLastCalledWith('other-token')
  })

  it('does not create a shared session on the server', () => {
    expect(() => getAuthSession()).toThrow('Authentication sessions must be initialized in the browser')
  })
})
