'use client'

import { useAuth } from '@/providers/AuthProvider'

export default function HomePage() {
  const { user } = useAuth()
  return <h1>Hello {user?.username}</h1>
}
