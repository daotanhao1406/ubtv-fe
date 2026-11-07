'use client'
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import { useRouter } from 'next/navigation'

import { LoginButton } from '@/components/layout/SiteHeader/LoginButton'

import { useAuth } from '@/providers/AuthProvider'

export const UserBlock = () => {
  const { user, logout, isInitializing } = useAuth()
  const router = useRouter()
  if (isInitializing || !user) return <LoginButton isLoading={isInitializing} />
  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar isBordered as='button' aria-label='Open account menu' className='transition-transform' color='secondary' name={user.name?.trim().charAt(0).toUpperCase() || 'U'} size='sm' />
      </DropdownTrigger>
      <DropdownMenu aria-label='Profile Actions' variant='flat'>
        <DropdownItem key='profile' className='h-14 gap-2'>
          <p className='font-semibold'>Signed in as</p>
          <p className='font-semibold'>{user.email}</p>
        </DropdownItem>
        <DropdownItem key='account' onPress={() => router.push('/profile')}>
          My profile
        </DropdownItem>
        <DropdownItem onPress={logout} key='logout' color='danger'>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
