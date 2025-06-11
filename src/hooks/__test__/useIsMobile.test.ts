import { act, renderHook } from '@testing-library/react'

import { useIsMobile } from '@/hooks'

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  const listeners: Array<() => void> = []

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: jest.fn((event, callback) => {
        if (event === 'change') {
          listeners.push(callback)
        }
      }),
      removeEventListener: jest.fn((event, callback) => {
        const index = listeners.indexOf(callback)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }),
      dispatchEvent: jest.fn(),
      // Helper function to trigger change events
      triggerChange: () => {
        listeners.forEach((listener) => listener())
      },
    })),
  })

  return {
    triggerChange: () => {
      const mql = window.matchMedia('(max-width: 767px)')
      ;(mql as any).triggerChange()
    },
  }
}

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

describe('useIsMobile', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Clean up
    delete (window as any).matchMedia
    delete (window as any).innerWidth
  })

  it('should return false for desktop width (>= 768px)', () => {
    mockInnerWidth(1024)
    mockMatchMedia(false)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('should return true for mobile width (< 768px)', () => {
    mockInnerWidth(375)
    mockMatchMedia(true)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('should return true for exact breakpoint minus 1 (767px)', () => {
    mockInnerWidth(767)
    mockMatchMedia(true)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('should return false for exact breakpoint (768px)', () => {
    mockInnerWidth(768)
    mockMatchMedia(false)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('should initially return false when isMobile is undefined', () => {
    mockInnerWidth(1024)
    mockMatchMedia(false)

    const { result } = renderHook(() => useIsMobile())

    // The hook returns !!isMobile, so undefined becomes false
    expect(result.current).toBe(false)
  })

  it('should update when window is resized', () => {
    mockInnerWidth(1024)
    const { triggerChange } = mockMatchMedia(false)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)

    // Simulate window resize to mobile
    act(() => {
      mockInnerWidth(375)
      triggerChange()
    })

    expect(result.current).toBe(true)
  })

  it('should set up media query listener with correct breakpoint', () => {
    mockInnerWidth(1024)
    mockMatchMedia(false)

    renderHook(() => useIsMobile())

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
  })

  it('should clean up event listener on unmount', () => {
    mockInnerWidth(1024)

    // Create a more detailed mock that tracks calls
    const addEventListenerMock = jest.fn()
    const removeEventListenerMock = jest.fn()

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        dispatchEvent: jest.fn(),
      })),
    })

    const { unmount } = renderHook(() => useIsMobile())

    // Verify addEventListener was called
    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))

    unmount()

    // Verify removeEventListener was called with the same function
    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))
    expect(addEventListenerMock.mock.calls[0][1]).toBe(removeEventListenerMock.mock.calls[0][1])
  })

  it('should handle multiple resize events correctly', () => {
    mockInnerWidth(1024)
    const { triggerChange } = mockMatchMedia(false)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)

    // Resize to mobile
    act(() => {
      mockInnerWidth(375)
      triggerChange()
    })

    expect(result.current).toBe(true)

    // Resize back to desktop
    act(() => {
      mockInnerWidth(1200)
      triggerChange()
    })

    expect(result.current).toBe(false)

    // Resize to tablet/mobile again
    act(() => {
      mockInnerWidth(600)
      triggerChange()
    })

    expect(result.current).toBe(true)
  })

  it('should work with edge case widths', () => {
    // Test with very small width
    mockInnerWidth(320)
    mockMatchMedia(true)

    const { result: result1 } = renderHook(() => useIsMobile())
    expect(result1.current).toBe(true)

    // Test with very large width
    mockInnerWidth(1920)
    mockMatchMedia(false)

    const { result: result2 } = renderHook(() => useIsMobile())
    expect(result2.current).toBe(false)
  })
})
