import { normalizePath } from '@/lib/utils'

describe('normalizePath', () => {
  it('should remove leading slash if present', () => {
    const path = '/some/path'
    expect(normalizePath(path)).toBe('some/path')
  })

  it('should not modify path if there is no leading slash', () => {
    const path = 'some/path'
    expect(normalizePath(path)).toBe('some/path')
  })

  it('should return an empty string if path is just a single slash', () => {
    const path = '/'
    expect(normalizePath(path)).toBe('')
  })

  it('should return an empty string if path is already empty', () => {
    const path = ''
    expect(normalizePath(path)).toBe('')
  })

  it('should handle paths with multiple leading slashes by removing only the first one', () => {
    const path = '//multiple/slashes'
    expect(normalizePath(path)).toBe('/multiple/slashes')
  })
})
