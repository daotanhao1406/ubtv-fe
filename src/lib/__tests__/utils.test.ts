import { isBoolean, isFunction, isNumber, isObject, isString, isUndefined } from '@/lib/utils'

describe('shared utils methods', () => {
  test('isBoolean', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)

    expect(isBoolean('')).toBe(false)
    expect(isBoolean([])).toBe(false)
  })

  test('isFunction', () => {
    expect(isFunction(function foo() {})).toBe(true)
    expect(isFunction(() => {})).toBe(true)

    expect(isFunction({})).toBe(false)
    expect(isFunction(1)).toBe(false)
  })

  test('isNumber', () => {
    expect(isNumber(1)).toBe(true)
    expect(isNumber(Infinity)).toBe(true)
    expect(isNumber(NaN)).toBe(true)

    expect(isNumber('str')).toBe(false)
    expect(isNumber({})).toBe(false)
  })

  test('isObject', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(true)
    expect(isObject(new RegExp(''))).toBe(true)
    expect(isObject(new Date())).toBe(true)

    expect(isObject(null)).toBe(false)
    expect(isObject(function foo() {})).toBe(false)
    expect(isObject(123)).toBe(false)
  })

  test('isString', () => {
    expect(isString('1')).toBe(true)
    expect(isString(String('1'))).toBe(true)

    expect(isString(1)).toBe(false)
    expect(isString({})).toBe(false)
  })

  test('isUndef', () => {
    expect(isUndefined(undefined)).toBe(true)

    expect(isUndefined(0)).toBe(false)
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(NaN)).toBe(false)
    expect(isUndefined('')).toBe(false)
  })
})
