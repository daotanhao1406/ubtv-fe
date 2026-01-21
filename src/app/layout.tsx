import { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { Suspense } from 'react'

import '@/styles/globals.css'

import LoadingComponent from '@/components/LoadingComponent'

import { siteConfig } from '@/constant/config/site'
import AppProvider from '@/providers/AppProvider'

const dm_sans = DM_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-dm_sans',
})

// !STARTERCONF Change these default meta
// !STARTERCONF Look at @/constant/config to change them
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
  // ! copy to /favicon folder
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={dm_sans.variable} suppressHydrationWarning>
      <body className='dark min-h-screen bg-background --font-dm_sans antialiased'>
        <AppProvider>
          <div className='mx-auto relative flex flex-col min-h-screen w-full'>
            <Suspense fallback={<LoadingComponent />}>{children}</Suspense>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
