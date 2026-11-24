'use client'

import { Button, ButtonProps } from '@heroui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function LoginButton(props: ButtonProps) {
  const pathname = usePathname()

  return pathname !== '/login' ? (
    <Link href='/login'>
      <Button className='font-semibold' color='primary' {...props}>
        Login
      </Button>
    </Link>
  ) : null
}
