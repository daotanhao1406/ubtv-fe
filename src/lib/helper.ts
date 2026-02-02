import { addToast } from '@heroui/react'
import { UseFormSetError } from 'react-hook-form'

import { EntityError, HttpError } from '@/lib/http'

export const handleErrorApi = ({ error, setError, duration }: { error: HttpError | any; setError?: UseFormSetError<any>; duration?: number }) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach(({ field, message }) => setError(field, { type: 'server', message }))
  } else {
    addToast({
      title: error?.payload?.status ?? 'Error',
      description: error?.payload?.message ?? 'Undefined error!',
      timeout: duration ?? 5000,
      color: 'danger',
    })
  }
}
