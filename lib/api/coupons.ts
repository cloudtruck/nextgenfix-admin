import apiClient from './client'

export interface Coupon {
  _id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderValue: number
  maxDiscount?: number
  usageLimit: number
  usageLimitPerUser: number
  usedCount: number
  validFrom: string
  validUntil: string
  isActive: boolean
  applicableTiers: ('all' | 'bronze' | 'silver' | 'gold')[]
  meta?: {
    origin?: string
    originType?: string
  }
  createdAt: string
  updatedAt: string
}

export const getCoupons = async () => {
  const response = await apiClient.get<{ coupons: Coupon[] }>('/coupons/admin/all')
  console.log(response.data)
  return response.data
}

export const getCouponById = async (id: string) => {
  const response = await apiClient.get<Coupon>(`/coupons/${id}`)
  return response.data
}

export const createCoupon = async (data: Omit<Coupon, '_id' | 'usedCount' | 'createdAt' | 'updatedAt'>) => {
  const response = await apiClient.post<Coupon>('/coupons', data)
  return response.data
}

export const updateCoupon = async (id: string, data: Partial<Coupon>) => {
  const response = await apiClient.put<Coupon>(`/coupons/${id}`, data)
  return response.data
}

export const deleteCoupon = async (id: string) => {
  const response = await apiClient.delete(`/coupons/${id}`)
  return response.data
}

export const toggleCouponStatus = async (id: string) => {
  const response = await apiClient.put<Coupon>(`/coupons/${id}/toggle`)
  return response.data
}

export const getReferralAudit = async () => {
  const response = await apiClient.get<{ referrers: any[]; coupons: Coupon[] }>('/coupons/admin/referrals')
  return response.data
}

export const generateCouponCode = async () => {
  const response = await apiClient.get<{ code: string }>('/coupons/generate-code')
  return response.data
}
