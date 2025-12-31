import apiClient from './client'

export interface AdminUser {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'super-admin' | 'admin' | 'manager'
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export const getAdminUsers = async () => {
  const response = await apiClient.get<{ users: AdminUser[] }>('/admin-users')
  return response.data
}

export const getAdminUserById = async (id: string) => {
  const response = await apiClient.get<AdminUser>(`/admin-users/${id}`)
  return response.data
}

export const createAdminUser = async (data: Omit<AdminUser, '_id' | 'createdAt' | 'updatedAt' | 'lastLogin'>) => {
  const response = await apiClient.post<AdminUser>('/admin-users', data)
  return response.data
}

export const updateAdminUser = async (id: string, data: Partial<AdminUser>) => {
  const response = await apiClient.put<AdminUser>(`/admin-users/${id}`, data)
  return response.data
}

export const deleteAdminUser = async (id: string) => {
  const response = await apiClient.delete(`/admin-users/${id}`)
  return response.data
}

export const toggleAdminUserStatus = async (id: string) => {
  const response = await apiClient.put<AdminUser>(`/admin-users/${id}/toggle-status`)
  return response.data
}