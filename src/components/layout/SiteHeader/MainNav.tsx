'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import LogoIcon from '@/components/icons/LogoIcon'

import { siteConfig } from '@/constant/config/site'

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className='mr-4 hidden md:flex'>
      <Link href='/' className='mr-4 flex items-center space-x-2 lg:mr-6'>
        <LogoIcon className='h-9 w-9' />
        <span className='hidden font-bold lg:inline-block'>{siteConfig.name}</span>
      </Link>
      <nav className='flex items-center gap-4 text-sm lg:gap-6 ml-6'>
        <Link href='/' className={cn('transition-colors hover:text-foreground/80', pathname === '/' ? 'text-foreground' : 'text-foreground/60')}>
          Home
        </Link>
        <Link href='/profile' className={cn('transition-colors hover:text-foreground/80', pathname?.startsWith('/profile') ? 'text-foreground' : 'text-foreground/60')}>
          Profile
        </Link>
      </nav>
    </div>
  )
}
