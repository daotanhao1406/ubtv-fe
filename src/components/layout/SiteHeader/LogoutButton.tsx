'use client'

import { LogOut } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useAuth } from '@/providers/AuthProvider'

export function LogoutButton() {
  const { logout } = useAuth()

  return (
    <DropdownMenuItem onClick={logout}>
      <LogOut />
      <span>Log out</span>
    </DropdownMenuItem>
  )
}
