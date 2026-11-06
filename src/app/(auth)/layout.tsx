'use client'

import { Spinner } from '@heroui/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'

import { useAuth } from '@/providers/AuthProvider'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitializing } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const query = useSearchParams().toString()
  const loginUrl = `/login?redirectFrom=${encodeURIComponent(pathname + (query ? `?${query}` : ''))}`

  useEffect(() => {
    if (!isInitializing && !user) router.replace(loginUrl)
  }, [isInitializing, user, loginUrl, router])

  return (
    <>
      <SiteHeader />
      <main className='flex-1'>{isInitializing ? <Spinner label='Loading...' className='w-full p-10' /> : user ? <section>{children}</section> : null}</main>
      <SiteFooter />
    </>
  )
}

export default AuthLayout
