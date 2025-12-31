import apiClient from './client'
import { Admin } from '../types'

export const getAdmins = async () => {
  const response = await apiClient.get<{ admins: Admin[] }>('/admin/admins')
  return response.data
}

export const getAdminById = async (id: string) => {
  const response = await apiClient.get<Admin>(`/admin/admins/${id}`)
  return response.data
}

export const createAdmin = async (data: Omit<Admin, '_id' | 'lastLogin'> & { password: string }) => {
  const response = await apiClient.post<Admin>('/admin/admins', data)
  return response.data
}

export const updateAdmin = async (id: string, data: Partial<Admin>) => {
  const response = await apiClient.put<Admin>(`/admin/admins/${id}`, data)
  return response.data
}

export const deleteAdmin = async (id: string) => {
  const response = await apiClient.delete(`/admin/admins/${id}`)
  return response.data
}
