'use client'

import { Button } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { getAuthSession } from '@/lib/auth-session'

import { CustomResponseType } from '@/api'
import authApiRequest from '@/api/auth'
import ubtvAuthApi from '@/api/ubtv-auth'
import { ForgotPasswordBodyType, ResetPasswordBodyType } from '@/schema/auth.schema'
import type { LoginInput } from '@/schema/auth-api.schema'

import type { AuthUser } from '@/types/auth'

type AuthContextType = {
  user: AuthUser | null
  isInitializing: boolean
  isLoggingOut: boolean
  restoreSession: () => Promise<void>
  login: (body: LoginInput) => Promise<void>
  logout: () => Promise<void>
  register: typeof ubtvAuthApi.register
  forgotPassword: (body: ForgotPasswordBodyType) => Promise<void>
  resetPassword: (body: ResetPasswordBodyType) => Promise<void>
  confirmResetPasswordOtp: (body: { otp: string; email: string }) => Promise<CustomResponseType>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState(false)

  const restoreSession = useCallback(async () => {
    setIsInitializing(true)
    try {
      setUser(await getAuthSession().fetchMe())
    } catch (error) {
      // A newer login/logout owns the UI now; ignore the older request's result.
      if (error instanceof Error && error.message === 'Authentication session changed') return
      setUser(null)
    } finally {
      setIsInitializing(false)
    }
  }, [])

  useEffect(() => {
    // Remove tokens saved by the previous frontend auth flow.
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('accessTokenExpiresAt')
    } catch {
      // Authentication also works when browser storage is unavailable.
    }
    void restoreSession()
  }, [restoreSession])

  const login = async (body: LoginInput) => {
    setUser(null)
    setLogoutError(false)
    setUser(await getAuthSession().login(body))
  }

  const logout = async () => {
    setUser(null)
    setIsLoggingOut(true)
    setLogoutError(false)
    router.replace('/login')
    try {
      await getAuthSession().logout()
    } catch {
      setLogoutError(true)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Password recovery stays on the existing API until the backend supports it.
  const confirmResetPasswordOtp = (body: { otp: string; email: string }) => authApiRequest.confirmResetPasswordOtp(body)
  const forgotPassword = async (body: ForgotPasswordBodyType) => {
    await authApiRequest.forgotPassword(body)
  }
  const resetPassword = async (body: ResetPasswordBodyType) => {
    await authApiRequest.resetPassword(body)
  }

  return (
    <AuthContext.Provider value={{ user, isInitializing, isLoggingOut, restoreSession, login, logout, register: ubtvAuthApi.register, confirmResetPasswordOtp, forgotPassword, resetPassword }}>
      {logoutError && (
        <div role='alert' className='flex flex-wrap items-center justify-center gap-3 bg-warning-100 p-3 text-warning-900'>
          <p>You are signed out locally. We could not confirm sign-out with the server.</p>
          <Button variant='light' color='warning' onPress={logout} isDisabled={isLoggingOut}>
            Retry logout
          </Button>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
export const useAuth = () => useContext(AuthContext)
