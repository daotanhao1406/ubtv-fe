export { default as cn } from './cn'
export { depsAreSame } from './depsAreSame'
export { isBrowser } from './isBrowser'
export { isDev } from './isDev'
export { noop } from './noop'
export { normalizePath } from './normalizePath'

export const isObject = (value: unknown): value is Record<any, any> => value !== null && typeof value === 'object'
export const isFunction = (value: unknown): value is (...args: any) => any => typeof value === 'function'

export const isString = (value: unknown): value is string => typeof value === 'string'
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
export const isNumber = (value: unknown): value is number => typeof value === 'number'
export const isUndefined = (value: unknown): value is undefined => typeof value === 'undefined'
