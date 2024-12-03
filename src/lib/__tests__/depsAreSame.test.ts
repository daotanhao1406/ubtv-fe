import { depsAreSame } from '@/lib/utils'

// Test cases
describe('depsAreSame', () => {
  it('should return true when oldDeps and deps are the same reference', () => {
    const deps = [1, 2, 3]
    expect(depsAreSame(deps, deps)).toBe(true)
  })

  it('should return true when oldDeps and deps have identical primitive values', () => {
    const oldDeps = [1, 2, 3]
    const newDeps = [1, 2, 3]
    expect(depsAreSame(oldDeps, newDeps)).toBe(true)
  })

  it('should return false when oldDeps and deps have different values', () => {
    const oldDeps = [1, 2, 3]
    const newDeps = [1, 2, 4]
    expect(depsAreSame(oldDeps, newDeps)).toBe(false)
  })

  it('should return true for arrays with identical objects (same references)', () => {
    const obj = { key: 'value' }
    const oldDeps = [obj]
    const newDeps = [obj]
    expect(depsAreSame(oldDeps, newDeps)).toBe(true)
  })

  it('should return false for arrays with different objects (even with identical values)', () => {
    const oldDeps = [{ key: 'value' }]
    const newDeps = [{ key: 'value' }]
    expect(depsAreSame(oldDeps, newDeps)).toBe(false)
  })

  it('should return true when both oldDeps and deps are empty arrays', () => {
    expect(depsAreSame([], [])).toBe(true)
  })

  it('should return false when one array is longer than the other', () => {
    const oldDeps = [1, 2]
    const newDeps = [1, 2, 3]
    expect(depsAreSame(oldDeps, newDeps)).toBe(false)
  })
})
