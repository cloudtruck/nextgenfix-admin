import apiClient from './client'

export interface Complaint {
  _id: string
  complaintId?: string
  user?: {
    _id: string
    name: string
    email: string
  }
  userId?: string
  userName?: string
  userEmail?: string
  subject: string
  description: string
  category: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'In-progress' | 'Resolved' | 'Closed'
  orderId?: string
  attachments?: string[]
  media?: string[]
  responses?: ComplaintResponse[]
  response?: string
  respondedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ComplaintResponse {
  adminId: string
  adminName: string
  message: string
  createdAt: string
}

export interface ComplaintFilters {
  status?: string
  category?: string
  priority?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export const getComplaints = async (filters?: ComplaintFilters) => {
  const response = await apiClient.get<{ 
    success: boolean; 
    data: Complaint[]; 
    pagination: { total: number; page: number; limit: number; pages: number; hasMore: boolean } 
  }>('/complaints/all', {
    params: filters,
  })
  return response.data
}

export const getComplaintById = async (id: string) => {
  const response = await apiClient.get<Complaint>(`/complaints/admin/${id}`)
  return response.data
}

export const updateComplaintStatus = async (id: string, status: Complaint['status']) => {
  const response = await apiClient.put<Complaint>(`/complaints/${id}/status`, { status })
  return response.data
}

export const respondToComplaint = async (id: string, message: string) => {
  const response = await apiClient.put<Complaint>(`/complaints/${id}/respond`, { message })
  return response.data
}

export const createComplaint = async (data: Partial<Complaint>) => {
  const response = await apiClient.post<Complaint>('/complaints/admin', data)
  return response.data
}

export const updateComplaint = async (id: string, data: Partial<Complaint>) => {
  const response = await apiClient.put<Complaint>(`/complaints/admin/${id}`, data)
  return response.data
}

export const deleteComplaint = async (id: string) => {
  const response = await apiClient.delete(`/complaints/admin/${id}`)
  return response.data
}

export const exportComplaints = async (filters?: ComplaintFilters) => {
  const response = await apiClient.get('/complaints/admin/export', {
    params: filters,
    responseType: 'blob',
  })
  return response.data
}
