'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    router.push('/login')
    router.refresh()
  }

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut />
      <span>Log out</span>
    </DropdownMenuItem>
  )
}
