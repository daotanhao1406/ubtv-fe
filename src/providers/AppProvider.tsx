import React from 'react'

import AuthProvider from '@/providers/AuthProvider'
import ThemeProvider from '@/providers/ThemeProvider'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}

export default AppProvider
