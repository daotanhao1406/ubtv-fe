'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItemProps = {
  href: string
  children: React.ReactNode
}
import { cn } from '@/lib/utils'

import LogoIcon from '@/components/icons/LogoIcon'

import { siteConfig } from '@/constant/config/site'

export function MainNav() {
  return (
    <div className='mr-4 hidden md:flex'>
      <Link href='/' className='mr-4 flex items-center space-x-2 lg:mr-6'>
        <LogoIcon className='h-9 w-9' />
        <span className='hidden font-bold lg:inline-block'>{siteConfig.name}</span>
      </Link>
      <nav className='flex items-center gap-4 text-sm lg:gap-6 ml-6'>
        <NavItem href='/'>Home</NavItem>
        <NavItem href='/profile'>Profile</NavItem>
        <NavItem href='/admin'>Admin</NavItem>
      </nav>
    </div>
  )
}

const NavItem = ({ href, children }: NavItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn('text-muted-foreground text-sm', {
        'text-secondary-foreground': isActive,
      })}
    >
      {children}
    </Link>
  )
}
