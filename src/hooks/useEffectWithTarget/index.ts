import { useEffect } from 'react'

import createEffectWithTarget from '@/hooks/useEffectWithTarget/createEffectWithTarget'

const useEffectWithTarget = createEffectWithTarget(useEffect)

export default useEffectWithTarget
