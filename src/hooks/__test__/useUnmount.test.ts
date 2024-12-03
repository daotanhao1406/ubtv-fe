import { renderHook } from '@testing-library/react'

import { useUnmount } from '@/hooks'

describe('useUnmount', () => {
  // alibaba code has function toBeCalledTimes() deprecated
  // it('useUnmount should work', async () => {
  //   const fn = jest.fn();
  //   const hook = renderHook(() => useUnmount(fn));
  //   expect(fn).toBeCalledTimes(0);
  //   hook.rerender();
  //   expect(fn).toBeCalledTimes(0);
  //   hook.unmount();
  //   expect(fn).toBeCalledTimes(1);
  // });

  // daotanhao code to fix function toBeCalledTimes() deprecated
  it('useUnmount should work', async () => {
    const fn = jest.fn()
    const hook = renderHook(() => useUnmount(fn))
    expect(fn).toHaveBeenCalledTimes(0)
    hook.rerender()
    expect(fn).toHaveBeenCalledTimes(0)
    hook.unmount()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  // it('should output error when fn is not a function', () => {
  //   const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  //   renderHook(() => useUnmount(1 as any));
  //   expect(errSpy).toBeCalledWith('useUnmount expected parameter is a function, got number');
  //   errSpy.mockRestore();
  // });
})
