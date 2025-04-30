'use client' // Error components must be Client Components

import { ErrorPageTemplate } from '@/components/layout/ErrorPageTemplate'

export default function Error({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPageTemplate code='500' title='Server Internal' description={error.message ?? 'Sorry, we couldn’t load the page you’re looking for at this time. Try coming back later.'} />
}
