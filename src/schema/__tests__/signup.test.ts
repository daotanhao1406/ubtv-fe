/** @jest-environment node */

import { SignUpBody } from '@/schema/auth.schema'

const input = { username: '  Nguyễn An  ', email: '  USER@EXAMPLE.COM  ', password: '  secret  ', confirmPassword: '  secret  ' }

describe('signup validation', () => {
  it('normalizes the display name and email while preserving passwords exactly', () => {
    expect(SignUpBody.parse(input)).toEqual({ ...input, username: 'Nguyễn An', email: 'user@example.com' })
  })

  it('requires an exact password confirmation, including whitespace', () => {
    const result = SignUpBody.safeParse({ ...input, confirmPassword: 'secret' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['confirmPassword'], message: "Password confirmation doesn't match Password" })]))
  })

  it('accepts a password of exactly 72 UTF-8 bytes', () => {
    const password = 'é'.repeat(36)
    expect(SignUpBody.safeParse({ ...input, password, confirmPassword: password }).success).toBe(true)
  })

  it('rejects a password longer than 72 UTF-8 bytes even when it has fewer than 72 characters', () => {
    const password = 'é'.repeat(37)
    const result = SignUpBody.safeParse({ ...input, password, confirmPassword: password })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['password'], message: 'Password cannot exceed 72 bytes in UTF-8' })]))
  })

  it.each([
    ['😀'.repeat(5), false],
    ['😀'.repeat(6), true],
  ])('counts Unicode characters for password %s', (password, valid) => {
    expect(SignUpBody.safeParse({ ...input, password, confirmPassword: password }).success).toBe(valid)
  })

  it.each(['', 'a'.repeat(101)])('rejects an empty or oversized name', (username) => {
    expect(SignUpBody.safeParse({ ...input, username }).success).toBe(false)
  })
})
