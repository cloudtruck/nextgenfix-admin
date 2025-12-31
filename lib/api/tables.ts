import apiClient from './client'

export interface Table {
  _id: string
  tableNumber: string
  capacity: number
  location: string
  features: string[]
  isAvailableForReservation: boolean
  status: 'available' | 'reserved' | 'occupied'
  createdAt: string
  updatedAt: string
}

export interface Reservation {
  _id: string
  userId: string
  userName: string
  userPhone: string
  tableId: string
  tableNumber: string
  reservationDate: string
  reservationTime: string
  guestCount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  specialRequests?: string
  createdAt: string
  updatedAt: string
}

export interface BulkTableData {
  prefix: string
  startNumber: number
  endNumber: number
  capacity: number
  location: string
}

export const getTables = async (): Promise<{ tables: Table[]; total?: number }> => {
  const response = await apiClient.get('/tables')
  // Backend returns: { success: true, data: Table[], total }
  const tables = response.data?.data || []
  const total = response.data?.total
  return { tables, total }
}

export const getTableById = async (id: string): Promise<Table> => {
  const response = await apiClient.get(`/tables/${id}`)
  // Backend returns: { success: true, data: table }
  return response.data?.data
}

export const createTable = async (data: Omit<Table, '_id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Table> => {
  const response = await apiClient.post('/tables', data)
  // Backend returns: { success: true, message, data: table }
  return response.data?.data
}

export const updateTable = async (id: string, data: Partial<Table>): Promise<Table> => {
  const response = await apiClient.put(`/tables/${id}`, data)
  return response.data?.data
}

export const deleteTable = async (id: string) => {
  const response = await apiClient.delete(`/tables/${id}`)
  // Backend returns success message
  return response.data
}

export const bulkCreateTables = async (data: BulkTableData) => {
  const response = await apiClient.post('/tables/bulk', data)
  // Backend returns: { success: true, message, data: createdTables, errors? }
  return {
    tables: response.data?.data || [],
    errors: response.data?.errors
  }
}

export const getReservations = async (): Promise<{ reservations: Reservation[]; pagination?: unknown }> => {
  const response = await apiClient.get('/tables/reservations/all')
  // Backend returns: { success: true, data: reservations[], pagination }
  const reservations = response.data?.data || []
  const pagination = response.data?.pagination
  return { reservations, pagination }
}

export const updateReservationStatus = async (id: string, status: Reservation['status']) => {
  const response = await apiClient.put(`/tables/reservations/${id}`, { status })
  // Backend returns: { success: true, message, data: { table, reservation } }
  return response.data?.data
}
