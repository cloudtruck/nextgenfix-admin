/**
 * Analytics API Module
 * 
 * Centralized analytics API functions using the shared apiClient.
 * All functions automatically include adminToken from localStorage.
 */

import apiClient from './client'

// ==================== TYPES ====================

export type TimePeriod = '1d' | '7d' | '30d' | '90d' | '1y'

export interface AnalyticsResponse<T = Record<string, unknown>> {
  success: boolean
  data: T
  breakdown?: Record<string, unknown>
  trend?: TrendData[]
  cached?: boolean
  metadata: {
    dateRange: {
      start: string
      end: string
    }
    calculatedAt: string
  }
}

export interface TrendData {
  period: string
  value: number
  change?: number
  changeDirection?: 'up' | 'down' | 'stable'
}

// Order Analytics Types
export interface OrderOverview {
  totalOrders: number
  completedOrders: number
  cancelledOrders: number
  completionRate: number
  averageOrderValue: number
  basketSize: number
  totalRevenue: number
  firstTimeOrderRate?: number
  repeatOrderRate?: number
}

export interface AbandonedCartMetrics {
  totalAbandonedCarts: number
  totalAbandonedValue: number
  avgCartValue: number
  recovered: number
  recoveredValue: number
  recoveryRate: number
  recoveryValueRate: number
  abandonmentReasons?: { _id: string; count: number }[]
}

export interface PeakOrderTimes {
  totalDataPoints: number
  peakOrderTime: {
    dayOfWeek: string
    hour: number
    dayPart: string
    orderCount: number
    totalRevenue: number
    avgOrderValue: number
  } | null
  avgOrdersPerHour: number
}

// Revenue Analytics Types
export interface RevenueOverview {
  totalRevenue: number
  netRevenue: number
  totalOrders: number
  avgOrderValue: number
  totalDiscounts: number
  totalRefunds: number
}

// User Analytics Types
export interface UserOverview {
  totalUsers: number
  activeUsers: number
  newUsers: number
  returningUsers: number
  DAU?: number
  WAU?: number
  MAU?: number
}

export interface UserDemographics {
  genderDistribution: Record<string, number>
  ageGroupDistribution: Record<string, number>
  locationDistribution: Record<string, number>
  deviceTypeDistribution: Record<string, number>
  loginMethodDistribution: Record<string, number>
}

export interface UserRetention {
  retentionRate: number
  churnRate: number
  cohortAnalysis?: Record<string, unknown>[]
}

// Product Analytics Types
export interface TopSellingProduct {
  productId: string
  productName: string
  category: string
  totalSold: number
  totalRevenue: number
  avgPrice: number
}

export interface CategoryPerformance {
  category: string
  totalSales: number
  totalRevenue: number
  avgOrderValue: number
  itemCount: number
}

export interface SearchAnalytics {
  totalSearches: number
  uniqueSearchTerms: number
  failedSearches: number
  failedSearchRate: number
  avgClickThroughRate: number
}

export interface CustomizationAnalytics {
  totalItems: number
  customizedItems: number
  customizationRate: number
  avgAddOnsPerItem: number
  customizedRevenue: number
  customizationRevenueShare: number
}

// Engagement Analytics Types
export interface SessionAnalytics {
  totalSessions: number
  avgSessionDuration: number
  bounceRate?: number
}

export interface FavoritesAnalytics {
  totalFavorites: number
  topFavorites: { productName: string; count: number }[]
}

export interface PushNotificationAnalytics {
  totalNotificationsSent: number
  totalOpened: number
  totalClicked: number
  avgOpenRate: number
  avgClickThroughRate: number
}

// Loyalty Analytics Types
export interface LoyaltyAnalytics {
  enrollmentRate: number
  redemptionRate: number
  tierDistribution: Record<string, number>
  totalPointsEarned: number
  totalPointsRedeemed: number
  referralStats: {
    totalReferrals: number
    successfulReferrals: number
    conversionRate: number
  }
}

// Advanced Analytics Types
export interface CustomerLTV {
  avgLTV: number
  medianLTV: number
  totalCustomers: number
  avgOrdersPerCustomer: number
  avgCustomerLifespanDays: number
}

export interface GenderTrends {
  totalTrends: number
  topTrends: {
    gender: string
    dayOfWeek: string
    dayPart: string
    category: string
    orders: number
    quantity: number
    revenue: number
  }[]
}

export interface HighValueCustomers {
  totalCustomers: number
  totalRevenue: number
  top20PercentCount: number
  top20PercentRevenue: number
  top20Share: number
  avgRevenuePerCustomer: number
}

export interface TimeToSecondOrder {
  avgDaysToSecondOrder: number
  medianDaysToSecondOrder: number
  totalRepeatCustomers: number
  minDays: number
  maxDays: number
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number
  activeSubscriptions: number
  subscriptionRevenue: number
  churnRate: number
}

// ==================== API FUNCTIONS ====================

// ORDER ANALYTICS

export const getOrderOverview = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<OrderOverview>> => {
  const response = await apiClient.get('/admin/analytics/orders/overview', { params: { period } })
  return response.data
}

export const getAbandonedCarts = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<AbandonedCartMetrics>> => {
  const response = await apiClient.get('/admin/analytics/orders/abandoned-carts', { params: { period } })
  return response.data
}

export const getPeakOrderTimes = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<PeakOrderTimes>> => {
  const response = await apiClient.get('/admin/analytics/orders/peak-times', { params: { period } })
  return response.data
}

// REVENUE ANALYTICS

export const getRevenueOverview = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<RevenueOverview>> => {
  const response = await apiClient.get('/admin/analytics/revenue/overview', { params: { period } })
  return response.data
}

// USER ANALYTICS

export const getUserOverview = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<UserOverview>> => {
  const response = await apiClient.get('/admin/analytics/users/overview', { params: { period } })
  return response.data
}

export const getUserDemographics = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<UserDemographics>> => {
  const response = await apiClient.get('/admin/analytics/users/demographics', { params: { period } })
  return response.data
}

export const getUserRetention = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<UserRetention>> => {
  const response = await apiClient.get('/admin/analytics/users/retention', { params: { period } })
  return response.data
}

// PRODUCT ANALYTICS

export const getTopSellingProducts = async (
  period: TimePeriod = '30d',
  limit: number = 10
): Promise<AnalyticsResponse<TopSellingProduct[]>> => {
  const response = await apiClient.get('/admin/analytics/products/top-selling', { params: { period, limit } })
  return response.data
}

export const getProductCategoryPerformance = async (
  period: TimePeriod = '30d'
): Promise<AnalyticsResponse<CategoryPerformance[]>> => {
  const response = await apiClient.get('/admin/analytics/products/category-performance', { params: { period } })
  return response.data
}

export const getSearchAnalytics = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<SearchAnalytics>> => {
  const response = await apiClient.get('/admin/analytics/products/search-analytics', { params: { period } })
  return response.data
}

export const getCustomizationAnalytics = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<CustomizationAnalytics>> => {
  const response = await apiClient.get('/admin/analytics/products/customization-usage', { params: { period } })
  return response.data
}

// ENGAGEMENT ANALYTICS

export const getSessionAnalytics = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<SessionAnalytics>> => {
  const response = await apiClient.get('/admin/analytics/engagement/sessions', { params: { period } })
  return response.data
}

export const getFavoritesAnalytics = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<FavoritesAnalytics>> => {
  const response = await apiClient.get('/admin/analytics/engagement/favorites', { params: { period } })
  return response.data
}

export const getPushNotificationAnalytics = async (
  period: TimePeriod = '30d'
): Promise<AnalyticsResponse<PushNotificationAnalytics>> => {
  const response = await apiClient.get('/admin/analytics/engagement/push-notifications', { params: { period } })
  return response.data
}

// LOYALTY ANALYTICS

export const getLoyaltyAnalytics = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<LoyaltyAnalytics>> => {
  const response = await apiClient.get('/admin/analytics/loyalty/overview', { params: { period } })
  return response.data
}

// ADVANCED ANALYTICS

export const getCustomerLTV = async (period: TimePeriod = '90d'): Promise<AnalyticsResponse<CustomerLTV>> => {
  const response = await apiClient.get('/admin/analytics/advanced/ltv', { params: { period } })
  return response.data
}

export const getGenderTrends = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<GenderTrends>> => {
  const response = await apiClient.get('/admin/analytics/advanced/gender-trends', { params: { period } })
  return response.data
}

export const getHighValueCustomers = async (period: TimePeriod = '90d'): Promise<AnalyticsResponse<HighValueCustomers>> => {
  const response = await apiClient.get('/admin/analytics/advanced/high-value-customers', { params: { period } })
  return response.data
}

export const getTimeToSecondOrder = async (period: TimePeriod = '90d'): Promise<AnalyticsResponse<TimeToSecondOrder>> => {
  const response = await apiClient.get('/admin/analytics/advanced/time-to-second-order', { params: { period } })
  return response.data
}

export const getSubscriptionAnalytics = async (period: TimePeriod = '30d'): Promise<AnalyticsResponse<SubscriptionAnalytics>> => {
  const response = await apiClient.get('/admin/analytics/advanced/subscriptions', { params: { period } })
  return response.data
}

// BATCH OPERATIONS

/**
 * Fetch multiple analytics at once for dashboard overview
 */
export const getDashboardOverview = async (period: TimePeriod = '30d') => {
  const [orders, revenue, users, products] = await Promise.all([
    getOrderOverview(period),
    getRevenueOverview(period),
    getUserOverview(period),
    getTopSellingProducts(period, 5),
  ])

  return {
    orders: orders.data,
    revenue: revenue.data,
    users: users.data,
    products: products.data,
  }
}
