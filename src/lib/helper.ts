import { addToast } from '@heroui/react'
import { UseFormSetError } from 'react-hook-form'

import { EntityError } from '@/lib/http'

export const handleErrorApi = ({ error, setError, duration }: { error: Error; setError?: UseFormSetError<any>; duration?: number }) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach(({ field, message }) => setError(field, { type: 'server', message }))
  } else {
    addToast({
      title: 'Error',
      description: error?.message ?? 'Undefined error!',
      timeout: duration ?? 5000,
      shouldShowTimeoutProgress: true,
      color: 'danger',
    })
  }
}
