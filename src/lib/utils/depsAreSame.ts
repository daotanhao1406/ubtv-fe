import type { DependencyList } from 'react'

export const depsAreSame = (oldDeps: DependencyList, deps: DependencyList): boolean => {
  if (oldDeps === deps) return true
  if (oldDeps.length !== deps.length) return false //daotanhao code
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false
  }
  return true
}
