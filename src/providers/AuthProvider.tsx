'use client'
import { addToast } from '@heroui/react'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { handleErrorApi } from '@/lib/helper'
import { useLocalStorage } from '@/hooks'

import { CustomResponseType } from '@/api'
import authApiRequest from '@/api/auth'
import userApiRequest from '@/api/user'
import { publicRoutes } from '@/middleware'
import { ForgotPasswordBodyType, LoginBodyType, ResetPasswordBodyType, SignUpBodyType } from '@/schema/auth.schema'

type AuthContextType = {
  user?: User | null
  setUser: (user: User | null) => void
  login: (body: LoginBodyType) => Promise<void>
  logout: () => Promise<void>
  register: (body: SignUpBodyType) => Promise<void>
  forgotPassword: (body: ForgotPasswordBodyType) => Promise<void>
  resetPassword: (body: ResetPasswordBodyType) => Promise<void>
  confirmResgisterOtp: (body: { otp: string; username: string }) => Promise<void>
  confirmResetPasswordOtp: (body: { otp: string; email: string }) => Promise<CustomResponseType>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [accessToken, setAccessToken] = useLocalStorage<string | undefined>('accessToken', {
    onError(error) {
      const errorValue = error as Error
      return addToast({
        title: 'Get local storage error',
        description: errorValue.message,
        color: 'danger',
      })
    },
    serializer: (v) => v ?? '',
    deserializer: (v) => v,
  })

  const logout = useCallback(async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer()
      router.push('/login')
    } catch (error: any) {
      handleErrorApi({ error })
      authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        router.push(`/login?redirectFrom=${pathname}`)
      })
    } finally {
      router.refresh()
      setAccessToken(undefined)
      setUser(null)
    }
  }, [pathname, router, setAccessToken])

  const login = useCallback(
    async (body: LoginBodyType) => {
      const result = await authApiRequest.login(body)
      await authApiRequest.authToNextServer({
        accessToken: result.payload.data.token,
        refreshToken: result.payload.data.refreshToken,
      })
      setAccessToken(result.payload.data.token)
      const res = await userApiRequest.meClient()
      setUser(res.payload.data || null)
    },
    [setAccessToken],
  )

  const register = async (body: SignUpBodyType) => {
    await authApiRequest.register(body)
  }

  const confirmResgisterOtp = useCallback(
    async (body: { otp: string; username: string }) => {
      const result = await authApiRequest.confirmResgisterOtp(body)
      await authApiRequest.authToNextServer({
        accessToken: result.payload.data.token,
        refreshToken: result.payload.data.refreshToken,
      })
      setAccessToken(result.payload.data.token)
    },
    [setAccessToken],
  )
  const confirmResetPasswordOtp = async (body: { otp: string; email: string }) => {
    return await authApiRequest.confirmResetPasswordOtp(body)
  }
  const forgotPassword = async (body: ForgotPasswordBodyType) => {
    await authApiRequest.forgotPassword(body)
  }

  const resetPassword = async (body: ResetPasswordBodyType) => {
    await authApiRequest.resetPassword(body)
  }

  const fetchMe = useCallback(
    async (accessToken?: string) => {
      if (!accessToken) {
        if (publicRoutes.includes(pathname)) {
          return
        }
        setUser(null)
        // router.push('/login')
        return
      }

      await userApiRequest
        .meClient()
        .then((res) => setUser(res.payload.data || null))
        .catch((error: any) => {
          if (!publicRoutes.includes(pathname)) {
            logout()
          }
          handleErrorApi({ error })
        })
    },
    [logout, pathname],
  )

  useEffect(() => {
    fetchMe(accessToken)
  }, [accessToken, fetchMe])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        register,
        confirmResgisterOtp,
        confirmResetPasswordOtp,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
