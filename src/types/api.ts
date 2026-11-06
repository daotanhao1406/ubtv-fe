export interface ApiResponse<T = Record<string, unknown>> {
  statusCode: number
  message: string
  data: T
  timestamp: string
}

export interface ApiErrorResponse {
  statusCode: number
  message: string | string[]
  error?: string
  code?: string
}
