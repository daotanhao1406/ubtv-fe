'use client'

import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { LogOut as LogOutIcon } from 'lucide-react'
import Link from 'next/link'

import { useAuth } from '@/providers/AuthProvider'

export function UserBlock() {
  const { user, logout } = useAuth()
  const iconClasses = 'w-5 h-5'
  if (!user)
    return (
      <Button className='font-semibold' color='primary'>
        <Link href='/login'>Login</Link>
      </Button>
    )
  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar isBordered as='button' className='transition-transform' color='secondary' name='Jason Hughes' size='sm' src='https://i.pravatar.cc/150?u=a042581f4e29026704d' />
      </DropdownTrigger>
      <DropdownMenu aria-label='Profile Actions' variant='flat'>
        <DropdownItem key='profile' className='h-14 gap-2'>
          <p className='font-semibold'>Signed in as</p>
          <p className='font-semibold'>{user.email}</p>
        </DropdownItem>
        <DropdownItem key='settings'>My Settings</DropdownItem>
        <DropdownItem key='team_settings'>Team Settings</DropdownItem>
        <DropdownItem key='analytics'>Analytics</DropdownItem>
        <DropdownItem key='system'>System</DropdownItem>
        <DropdownItem key='configurations'>Configurations</DropdownItem>
        <DropdownItem key='help_and_feedback'>Help & Feedback</DropdownItem>
        <DropdownItem className='text-danger' startContent={<LogOutIcon className={iconClasses} />} key='logout' color='danger' onClick={() => logout()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
