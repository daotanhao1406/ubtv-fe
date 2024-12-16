import { UseFormSetError } from 'react-hook-form'

import { EntityError } from '@/lib/http'
import { toast } from '@/hooks/useToast'

export const handleErrorApi = ({ error, setError, duration }: { error: Error; setError?: UseFormSetError<any>; duration?: number }) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach(({ field, message }) => setError(field, { type: 'server', message }))
  } else {
    toast({
      title: 'Lỗi',
      description: error?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000,
    })
  }
}
