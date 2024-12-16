import React from 'react'

import ThemeProvider from '@/providers/ThemeProvider'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>
}

export default AppProvider
