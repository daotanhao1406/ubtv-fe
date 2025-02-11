import { HeroUIProvider } from '@heroui/react'
import React from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>
}
