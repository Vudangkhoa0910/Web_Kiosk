import type { ID } from './common'

export interface User {
  id: ID
  email: string
  firstName: string
  lastName: string
  role: 'user' | 'operator' | 'admin'
  avatar?: string
  phone?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}