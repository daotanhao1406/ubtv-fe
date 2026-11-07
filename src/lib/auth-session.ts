import { HttpError } from '@/lib/http'

import authApi from '@/api/auth'
import type { LoginInput } from '@/schema/auth-api.schema'

import type { AuthUser } from '@/types/auth'

type SessionApi = Pick<typeof authApi, 'login' | 'refresh' | 'logout' | 'me'>

export const createAuthSession = (api: SessionApi = authApi) => {
  let accessToken: string | null = null
  let refreshRequest: Promise<AuthUser> | null = null
  let requestQueue = Promise.resolve()
  let sessionVersion = 0
  let refreshAllowed = true

  const enqueue = <T>(request: () => Promise<T>) => {
    const result = requestQueue.then(request)
    requestQueue = result.then(
      () => undefined,
      () => undefined,
    )
    return result
  }

  const checkVersion = (version: number) => {
    if (version !== sessionVersion) throw new Error('Authentication session changed')
  }

  const clearSession = () => {
    accessToken = null
    refreshAllowed = false
    sessionVersion++
  }

  const login = (input: LoginInput) => {
    clearSession()
    const version = sessionVersion
    return enqueue(async () => {
      checkVersion(version)
      const { data } = await api.login(input)
      checkVersion(version)
      accessToken = data.accessToken
      refreshAllowed = true
      return data.user
    })
  }

  const refresh = (): Promise<AuthUser> => {
    if (!refreshAllowed) return Promise.reject(new Error('Please sign in again'))
    if (!refreshRequest) {
      const version = sessionVersion
      refreshRequest = enqueue(async () => {
        checkVersion(version)
        const { data } = await api.refresh()
        checkVersion(version)
        accessToken = data.accessToken
        return data.user
      })
        .catch((error: unknown) => {
          checkVersion(version)
          clearSession()
          throw error
        })
        .finally(() => {
          refreshRequest = null
        })
    }
    return refreshRequest
  }

  const logout = () => {
    clearSession()
    const version = sessionVersion
    return enqueue(async () => {
      checkVersion(version)
      await api.logout()
      checkVersion(version)
    })
  }

  const fetchMe = async (): Promise<AuthUser> => {
    const version = sessionVersion
    for (let attempt = 0; attempt < 2; attempt++) {
      const token = accessToken
      if (!token) return refresh()
      try {
        const { data } = await api.me(token)
        checkVersion(version)
        return data
      } catch (error) {
        checkVersion(version)
        if (!(error instanceof HttpError) || error.status !== 401 || attempt === 1) {
          clearSession()
          throw error
        }
        if (token === accessToken) await refresh()
        checkVersion(version)
      }
    }
    throw new Error('Unable to load profile')
  }

  return { login, refresh, logout, fetchMe, clearSession }
}

let browserSession: ReturnType<typeof createAuthSession> | undefined

export const getAuthSession = () => {
  if (typeof window === 'undefined') throw new Error('Authentication sessions must be initialized in the browser')
  browserSession ??= createAuthSession()
  return browserSession
}
