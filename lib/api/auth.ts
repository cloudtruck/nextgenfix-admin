import apiClient from './client'
import type { Admin } from '../types'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  message: string
  admin: Admin
  token: string
}

export const loginAdmin = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await apiClient.post('/admin/auth/login', data)
  return res.data ?? res
}

export const getProfile = async (): Promise<Admin> => {
  const res = await apiClient.get('/admin/auth/profile')
  return res.data ?? res
}

export const logout = async (): Promise<void> => {
  await apiClient.post('/admin/auth/logout')
}
