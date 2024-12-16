'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { createBrowserClient } from '@/lib/supabase/client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function LogoutButton() {
  const supabase = createBrowserClient()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
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
