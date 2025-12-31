import apiClient from './client'

export interface Chef {
  _id: string
  name: string
}

export const getChefs = async () => {
  const response = await apiClient.get<{ chefs: Chef[] }>('/admin/chefs')
  return response.data
}

export const getChefById = async (id: string) => {
  const response = await apiClient.get<{ chef: Chef }>(`/admin/chefs/${id}`)
  return response.data
}
