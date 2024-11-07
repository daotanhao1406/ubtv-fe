'use client'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { handleErrorApi } from '@/lib/helper'
import { useLocalStorage } from '@/hooks'
import { toast } from '@/hooks/useToast'

import authApiRequest from '@/api/auth'
import userApiRequest from '@/api/user'
import { LoginBodyType, RegisterBodyType } from '@/schema/auth.schema'

type AuthContextType = {
  user?: User | null
  setUser: (user: User | null) => void
  login: (body: LoginBodyType) => Promise<void>
  logout: () => Promise<void>
  register: (body: RegisterBodyType) => Promise<void>
  status: undefined | 'loggedIn' | 'loggedOut'
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<undefined | 'loggedIn' | 'loggedOut'>()
  const [accessToken, setAccessToken] = useLocalStorage<string | undefined>('accessToken', {
    onError(error) {
      const errorValue = error as Error
      return toast({
        title: 'Get local storage error',
        description: errorValue.message,
        variant: 'destructive',
      })
    },
    serializer: (v) => v ?? '',
    deserializer: (v) => v,
  })

  const fetchMe = async () => {
    try {
      const res = await userApiRequest.meClient()
      setUser(res.payload || null)
      setStatus(res.payload ? 'loggedIn' : undefined)
    } catch (error) {
      // logout()
      handleErrorApi({ error })
    }
  }
  const login = useCallback(
    async (body: LoginBodyType) => {
      try {
        const result = await authApiRequest.login(body)
        await authApiRequest.authToNextServer({
          accessToken: result.payload.accessToken,
          expiresAt: '1800',
        })
        setAccessToken(result.payload.accessToken)
        setStatus('loggedIn')
      } catch (error) {
        handleErrorApi({
          error,
        })
      }
    },
    [setAccessToken],
  )

  const logout = useCallback(async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer()
      router.push('/login')
    } catch (error) {
      handleErrorApi({
        error,
      })
      authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        router.push(`/login?redirectFrom=${pathname}`)
      })
    } finally {
      router.refresh()
      setAccessToken(undefined)
      setUser(null)
      setStatus('loggedOut')
    }
  }, [pathname, router, setAccessToken])

  const register = useCallback(async () => {}, [])

  useEffect(() => {
    if (accessToken) {
      fetchMe()
    }
  }, [accessToken])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        status,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
