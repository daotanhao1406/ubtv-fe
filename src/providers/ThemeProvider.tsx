import { HeroUIProvider, ToastProvider } from '@heroui/react'
import React from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  )
}
