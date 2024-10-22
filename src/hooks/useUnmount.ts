import { useEffect } from 'react'

import { isDev, isFunction } from '@/lib/utils'
import { useLatest } from '@/hooks'

const useUnmount = (fn: () => void) => {
  if (isDev) {
    if (!isFunction(fn)) {
      throw new Error(`useUnmount expected parameter is a function, got ${typeof fn}`)
    }
  }

  const fnRef = useLatest(fn)

  useEffect(
    () => () => {
      fnRef.current()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
}

export default useUnmount
