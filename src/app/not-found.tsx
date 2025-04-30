import { Metadata } from 'next'
import * as React from 'react'

import { ErrorPageTemplate } from '@/components/layout/ErrorPageTemplate'

export const metadata: Metadata = {
  title: 'Not Found',
}

export default function NotFound() {
  return <ErrorPageTemplate code='404' title='Page Not Found' description="Look like you discovered a page that doesn't exist or you don't have access to." />
}
