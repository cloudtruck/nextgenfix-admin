import apiClient from './client'
import { Coupon } from './coupons'

export interface Prize {
  _id?: string
  type: 'blank' | 'points' | 'coupon' | 'bogo'
  label: string
  probability: number
  message?: string
  pointsRange?: {
    min: number
    max: number
  }
  couponConfig?: {
    discountType: 'percentage' | 'fixed' | 'free_delivery'
    discountRange: {
      min: number
      max: number
    }
    validityDays: number
    minOrderValue: number
    maxDiscount?: number
  }
}

export interface SpinWheelConfig {
  _id: string
  name: string
  isActive: boolean
  frequency: {
    type: 'daily' | 'weekly'
    limit: number
  }
  eligibility: {
    minOrders: number
    tiers: ('all' | 'bronze' | 'silver' | 'gold')[]
    allowGuests: boolean
  }
  prizes: Prize[]
  createdAt: string
  updatedAt: string
}

export interface SpinHistory {
  _id: string
  user?: {
    _id: string
    name: string
    phone: string
    email: string
  }
  isGuest: boolean
  guestId?: string
  prizeWon: {
    type: 'blank' | 'points' | 'coupon' | 'bogo'
    label: string
    value: any
    couponCode?: string
  }
  couponGenerated?: Coupon
  ipAddress: string
  deviceInfo: string
  flaggedForReview: {
    isFlagged: boolean
    reason?: string
    reviewedAt?: string
    reviewedBy?: string
  }
  createdAt: string
}

export interface SpinHistoryResponse {
  success: boolean
  history: SpinHistory[]
  total: number
  pages: number
}

export const getSpinConfig = async () => {
  const response = await apiClient.get<{ success: boolean; config: SpinWheelConfig }>('/spin-wheel/admin/config')
  return response.data
}

export const updateSpinConfig = async (data: Partial<SpinWheelConfig>) => {
  const response = await apiClient.put<{ success: boolean; config: SpinWheelConfig; message: string }>('/spin-wheel/admin/config', data)
  return response.data
}

export const getSpinHistory = async (params: { page?: number; limit?: number; isFlagged?: boolean; userId?: string }) => {
  const response = await apiClient.get<SpinHistoryResponse>('/spin-wheel/admin/history', { params })
  return response.data
}

export const revokeSpinCoupon = async (id: string, reason: string) => {
  const response = await apiClient.put<{ success: boolean; message: string }>(`/spin-wheel/admin/revoke/${id}`, { reason })
  return response.data
}

export const getSpinAnalytics = async () => {
  const response = await apiClient.get<{ 
    success: boolean; 
    stats: {
      totalSpins: number;
      recentSpins: number;
      redemptionRate: string;
      flaggedCount: number;
      distribution: { _id: string; count: number }[];
    }
  }>('/spin-wheel/admin/analytics')
  return response.data
}
