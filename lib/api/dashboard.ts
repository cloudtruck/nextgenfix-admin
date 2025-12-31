import apiClient from './client'

export interface OrderItem {
  id?: string
  name: string
  quantity: number
  price: number
}

export interface RecentOrder {
  id: string
  date: string
  total: number
  status: string
  customer?: { id?: string; name?: string }
  items?: OrderItem[]
}

export interface DashboardStats {
  totalRevenue: number
  revenueGrowth: number
  totalOrders: number
  ordersGrowth: number
  totalUsers: number
  usersGrowth: number
  averageOrderValue: number
  revenueChart: { date: string; revenue: number }[]
  orderStatusDistribution: { status: string; count: number }[]
  recentOrders: RecentOrder[]
  topMenuItems: { name: string; orders: number; revenue: number }[]
}

export const getDashboardStats = async (dateRange?: { from: string; to: string }) => {
  const params = dateRange ? { from: dateRange.from, to: dateRange.to } : {}
  const response = await apiClient.get<DashboardStats>('/admin/dashboard/stats', { params })
  return response.data
}

export const getOverviewStats = async () => {
  const response = await apiClient.get('/admin/overview')
  return response.data
}
