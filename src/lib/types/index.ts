// Common types for the application

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export type Theme = 'light' | 'dark' | 'system'

export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

