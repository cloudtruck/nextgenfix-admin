import apiClient from './client'
import { MenuItem } from '../types'

export type { MenuItem } from '../types'

export interface MenuItemFilters {
  search?: string
  category?: string
  isAvailable?: boolean
  isVegetarian?: boolean
  page?: number
  limit?: number
}

export const getMenuItems = async (filters?: MenuItemFilters) => {
  const response = await apiClient.get<{ menuItems: MenuItem[]; total: number }>('/admin/menu-items', {
    params: filters,
  })
  return response.data
}

export const getMenuItemById = async (id: string) => {
  const response = await apiClient.get<MenuItem>(`/admin/menu-items/${id}`)
  return response.data
}

export const createMenuItem = async (data: Omit<MenuItem, '_id'> | FormData) => {
  const response = await apiClient.post<MenuItem>('/admin/menu-items', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    timeout: data instanceof FormData ? 120000 : 60000, // 2 minutes for file uploads, 1 minute otherwise
  })
  return response.data
}

export const updateMenuItem = async (id: string, data: Partial<MenuItem> | FormData) => {
  const response = await apiClient.put<MenuItem>(`/admin/menu-items/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    timeout: data instanceof FormData ? 120000 : 60000, // 2 minutes for file uploads, 1 minute otherwise
  })
  return response.data
}

export const deleteMenuItem = async (id: string) => {
  const response = await apiClient.delete(`/admin/menu-items/${id}`)
  return response.data
}

export const exportMenuItems = async (filters?: MenuItemFilters) => {
  const response = await apiClient.get('/admin/menu-items-export', {
    params: filters,
    responseType: 'blob',
  })
  return response.data
}
