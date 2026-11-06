'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import LoginForm from '@/app/(unauth)/login/login-form'
import UnAuthTemplate from '@/app/(unauth)/template'
import { useAuth } from '@/providers/AuthProvider'

const getRedirectTo = (value: string | null) => {
  if (!value?.startsWith('/')) return '/'
  try {
    const url = new URL(value, 'https://ubtv.local')
    if (url.origin !== 'https://ubtv.local' || url.pathname.replace(/\/+$/, '') === '/login') return '/'
    return url.pathname + url.search + url.hash
  } catch {
    return '/'
  }
}

const LoginPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const email = (searchParams.get('email') || '').trim().toLowerCase()
  const redirectTo = getRedirectTo(searchParams.get('redirectFrom'))

  useEffect(() => {
    if (user) router.replace(redirectTo)
  }, [user, redirectTo, router])

  return (
    <UnAuthTemplate title='Login to Your Account' description='Log in to enjoy unlimited entertainment. Your cinematic world at your fingertips.'>
      <LoginForm key={email} email={email} redirectTo={redirectTo} />
    </UnAuthTemplate>
  )
}

export default LoginPage
