import apiClient from './client'

export interface Order {
  _id: string
  userId: string
  userName: string
  orderType: 'scheduled' | 'dining'
  tableNumber?: string
  scheduledTime?: string
  items: OrderItem[]
  subtotal: number
  tierDiscount: number
  couponDiscount: number
  tax: number
  deliveryCharges: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
}

export interface OrderFilters {
  search?: string
  status?: string
  orderType?: 'scheduled' | 'dining'
  paymentStatus?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export const getOrders = async (filters?: OrderFilters) => {
  const response = await apiClient.get<{ orders: Order[]; total: number }>('/orders', {
    params: filters,
  })
  return response.data
}

export const getOrderById = async (id: string) => {
  const response = await apiClient.get<Order>(`/orders/${id}`)
  return response.data
}

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  const response = await apiClient.put<Order>(`/orders/${id}/status`, { status })
  return response.data
}
