import { isBrowser } from '@/lib/utils'
import { createUseStorage } from '@/hooks/createUseStorage'

const useLocalStorage = createUseStorage(() => (isBrowser ? localStorage : undefined))

export default useLocalStorage
