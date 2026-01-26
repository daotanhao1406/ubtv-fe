export const sanitizeInput = (input: string): string => {
  // Regex này chỉ cho phép:
  // 1. Chữ cái (a-z, A-Z)
  // 2. Số (0-9)
  // 3. Khoảng trắng (\s)
  // 4. Các ký tự tiếng Việt (Unicode range \u00C0-\u1EF9)
  // Các ký tự khác sẽ bị thay thế bằng chuỗi rỗng
  return input.replace(/[^\w\s\u00C0-\u1EF9]/g, '').trim()
}
