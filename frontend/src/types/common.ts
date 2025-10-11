// Common utility types
export type Status = 'idle' | 'loading' | 'success' | 'error'
export type ID = string
export type Timestamp = Date | number
export type Position = { lat: number; lng: number }
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// API Response structure
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  success: boolean
  token?: string
  error?: string
}

// Navigation types
export type NavigationSection = 'home' | 'orders' | 'live-orders' | 'history'

// Generic state structure
export interface BaseState {
  isLoading: boolean
  error: string | null
}