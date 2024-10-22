'use client'
import { createContext, useContext, useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks'
import { toast } from '@/hooks/useToast'

import userApiRequest from '@/api/user'
import { UserResType } from '@/schema/user.schema'

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
}

type User = UserResType

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
})
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    return null
  })
  const isAuthenticated = Boolean(user)
  const [accessToken] = useLocalStorage<string | undefined>('accessToken', {
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

  // console.log(user);

  useEffect(() => {
    if (accessToken) {
      getMe()
    }
  }, [accessToken])

  const getMe = () => {
    userApiRequest.meClient().then((res) => {
      setUser(res.payload)
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
