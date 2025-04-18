import { Navbar, NavbarContent } from '@heroui/react'

import { CommandMenu } from '@/components/layout/SiteHeader/CommandMenu'
import { MainNav } from '@/components/layout/SiteHeader/MainNav'
import { MobileMenu } from '@/components/layout/SiteHeader/MobileMenu'
import { UserBlock } from '@/components/layout/SiteHeader/UserBlock'

export default function SiteHeader() {
  return (
    <Navbar shouldHideOnScroll isBordered maxWidth='full' className='py-1'>
      <NavbarContent justify='start' className='items-center'>
        <MainNav />
        <MobileMenu />
      </NavbarContent>
      <NavbarContent as='div' className='items-center' justify='end'>
        <CommandMenu />
        <UserBlock />
      </NavbarContent>
    </Navbar>
  )
}
