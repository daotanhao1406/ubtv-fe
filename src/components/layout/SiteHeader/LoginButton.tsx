'use client'

import { Button } from '@heroui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function LoginButton() {
  const pathname = usePathname()

  return pathname !== '/login' ? (
    <Link href='/login'>
      <Button className='font-semibold' color='primary'>
        Login
      </Button>
    </Link>
  ) : null
}
