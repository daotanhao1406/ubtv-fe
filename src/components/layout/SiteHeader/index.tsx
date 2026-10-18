import { Navbar, NavbarContent } from '@heroui/react'

import { CommandMenu } from '@/components/layout/SiteHeader/CommandMenu'
import { MainNav } from '@/components/layout/SiteHeader/MainNav'
import { MobileMenu } from '@/components/layout/SiteHeader/MobileMenu'
import { UserBlock } from '@/components/layout/SiteHeader/UserBlock'

export default function SiteHeader({ isHome }: { isHome?: boolean }) {
  return (
    <Navbar shouldHideOnScroll position='static' isBordered maxWidth='full' className={`py-1 ${isHome && 'absolute'} w-full bg-transparent backdrop-blur-none`}>
      <NavbarContent justify='start' className='items-center data-[justify=start]:grow-0 data-[justify=start]:basis-auto md:data-[justify=start]:grow md:data-[justify=start]:basis-0'>
        <MainNav />
        <MobileMenu />
      </NavbarContent>
      <NavbarContent as='div' className='min-w-0 items-center' justify='end'>
        <CommandMenu />
        <UserBlock />
      </NavbarContent>
    </Navbar>
  )
}
