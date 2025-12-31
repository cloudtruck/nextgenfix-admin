/**
 * Analytics API Service
 * 
 * This module provides TypeScript functions to interact with all analytics endpoints.
 * Based on KPI_QUICK_REFERENCE.md and KPI_ENDPOINT_MAP.md
 */

import axios, { AxiosInstance } from 'axios';
import { getCookie } from './utils';

// ==================== TYPES ====================

export type TimePeriod = '1d' | '7d' | '30d' | '90d' | '1y';

export interface AnalyticsResponse<T = Record<string, unknown>> {
  success: boolean;
  data: T;
  breakdown?: Record<string, unknown>;
  trend?: TrendData[];
  cached?: boolean;
  metadata: {
    dateRange: {
      start: string;
      end: string;
    };
    calculatedAt: string;
  };
}

export interface TrendData {
  period: string;
  value: number;
  change?: number;
  changeDirection?: 'up' | 'down' | 'stable';
}

// Order Analytics Types
export interface OrderOverview {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  completionRate: number;
  averageOrderValue: number;
  basketSize: number;
  totalRevenue: number;
}

export interface AbandonedCartMetrics {
  totalAbandonedCarts: number;
  totalAbandonedValue: number;
  avgCartValue: number;
  recovered: number;
  recoveredValue: number;
  recoveryRate: number;
  recoveryValueRate: number;
  abandonmentReasons?: { _id: string; count: number }[];
}

export interface PeakOrderTimes {
  totalDataPoints: number;
  peakOrderTime: {
    dayOfWeek: string;
    hour: number;
    dayPart: string;
    orderCount: number;
    totalRevenue: number;
    avgOrderValue: number;
  } | null;
  avgOrdersPerHour: number;
}

// Revenue Analytics Types
export interface RevenueOverview {
  totalRevenue: number;
  netRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalDiscounts: number;
  totalRefunds: number;
}

// User Analytics Types
export interface UserOverview {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  DAU?: number;
  WAU?: number;
  MAU?: number;
}

export interface UserDemographics {
  genderDistribution: Record<string, number>;
  ageGroupDistribution: Record<string, number>;
  locationDistribution: Record<string, number>;
  deviceTypeDistribution: Record<string, number>;
  loginMethodDistribution: Record<string, number>;
}

export interface UserRetention {
  retentionRate: number;
  churnRate: number;
  cohortAnalysis?: Record<string, unknown>[];
}

// Product Analytics Types
export interface TopSellingProduct {
  productId: string;
  productName: string;
  category: string;
  totalSold: number;
  totalRevenue: number;
  avgPrice: number;
}

export interface CategoryPerformance {
  category: string;
  totalSales: number;
  totalRevenue: number;
  avgOrderValue: number;
  itemCount: number;
}

export interface SearchAnalytics {
  totalSearches: number;
  uniqueSearchTerms: number;
  failedSearches: number;
  failedSearchRate: number;
  avgClickThroughRate: number;
}

export interface CustomizationAnalytics {
  totalItems: number;
  customizedItems: number;
  customizationRate: number;
  avgAddOnsPerItem: number;
  customizedRevenue: number;
  customizationRevenueShare: number;
}

// Engagement Analytics Types
export interface SessionAnalytics {
  totalSessions: number;
  avgSessionDuration: number;
  bounceRate?: number;
}

export interface FavoritesAnalytics {
  totalFavorites: number;
  topFavorites: { productName: string; count: number }[];
}

export interface PushNotificationAnalytics {
  totalNotificationsSent: number;
  totalOpened: number;
  totalClicked: number;
  avgOpenRate: number;
  avgClickThroughRate: number;
}

// Loyalty Analytics Types
export interface LoyaltyAnalytics {
  enrollmentRate: number;
  redemptionRate: number;
  tierDistribution: Record<string, number>;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  referralStats: {
    totalReferrals: number;
    successfulReferrals: number;
    conversionRate: number;
  };
}

// Advanced Analytics Types
export interface CustomerLTV {
  avgLTV: number;
  medianLTV: number;
  totalCustomers: number;
  avgOrdersPerCustomer: number;
  avgCustomerLifespanDays: number;
}

export interface GenderTrends {
  totalTrends: number;
  topTrends: {
    gender: string;
    dayOfWeek: string;
    dayPart: string;
    category: string;
    orders: number;
    quantity: number;
    revenue: number;
  }[];
}

export interface HighValueCustomers {
  totalCustomers: number;
  totalRevenue: number;
  top20PercentCount: number;
  top20PercentRevenue: number;
  top20Share: number;
  avgRevenuePerCustomer: number;
}

export interface TimeToSecondOrder {
  avgDaysToSecondOrder: number;
  medianDaysToSecondOrder: number;
  totalRepeatCustomers: number;
  minDays: number;
  maxDays: number;
}

// ==================== API CLIENT ====================

class AnalyticsAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token interceptor
    this.api.interceptors.request.use((config) => {
      const token = getCookie('na_admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ==================== ORDER ANALYTICS ====================

  async getOrderOverview(period: TimePeriod = '30d'): Promise<AnalyticsResponse<OrderOverview>> {
    const response = await this.api.get(`/orders/overview`, { params: { period } });
    return response.data;
  }

  async getAbandonedCarts(period: TimePeriod = '30d'): Promise<AnalyticsResponse<AbandonedCartMetrics>> {
    const response = await this.api.get(`/orders/abandoned-carts`, { params: { period } });
    return response.data;
  }

  async getPeakOrderTimes(period: TimePeriod = '30d'): Promise<AnalyticsResponse<PeakOrderTimes>> {
    const response = await this.api.get(`/orders/peak-times`, { params: { period } });
    return response.data;
  }

  // ==================== REVENUE ANALYTICS ====================

  async getRevenueOverview(period: TimePeriod = '30d'): Promise<AnalyticsResponse<RevenueOverview>> {
    const response = await this.api.get(`/revenue/overview`, { params: { period } });
    return response.data;
  }

  // ==================== USER ANALYTICS ====================

  async getUserOverview(period: TimePeriod = '30d'): Promise<AnalyticsResponse<UserOverview>> {
    const response = await this.api.get(`/users/overview`, { params: { period } });
    return response.data;
  }

  async getUserDemographics(period: TimePeriod = '30d'): Promise<AnalyticsResponse<UserDemographics>> {
    const response = await this.api.get(`/users/demographics`, { params: { period } });
    return response.data;
  }

  async getUserRetention(period: TimePeriod = '30d'): Promise<AnalyticsResponse<UserRetention>> {
    const response = await this.api.get(`/users/retention`, { params: { period } });
    return response.data;
  }

  // ==================== PRODUCT ANALYTICS ====================

  async getTopSellingProducts(
    period: TimePeriod = '30d',
    limit: number = 10
  ): Promise<AnalyticsResponse<TopSellingProduct[]>> {
    const response = await this.api.get(`/products/top-selling`, { params: { period, limit } });
    return response.data;
  }

  async getProductCategoryPerformance(
    period: TimePeriod = '30d'
  ): Promise<AnalyticsResponse<CategoryPerformance[]>> {
    const response = await this.api.get(`/products/category-performance`, { params: { period } });
    return response.data;
  }

  async getSearchAnalytics(period: TimePeriod = '30d'): Promise<AnalyticsResponse<SearchAnalytics>> {
    const response = await this.api.get(`/products/search-analytics`, { params: { period } });
    return response.data;
  }

  async getCustomizationAnalytics(period: TimePeriod = '30d'): Promise<AnalyticsResponse<CustomizationAnalytics>> {
    const response = await this.api.get(`/products/customization-usage`, { params: { period } });
    return response.data;
  }

  // ==================== ENGAGEMENT ANALYTICS ====================

  async getSessionAnalytics(period: TimePeriod = '30d'): Promise<AnalyticsResponse<SessionAnalytics>> {
    const response = await this.api.get(`/engagement/sessions`, { params: { period } });
    return response.data;
  }

  async getFavoritesAnalytics(period: TimePeriod = '30d'): Promise<AnalyticsResponse<FavoritesAnalytics>> {
    const response = await this.api.get(`/engagement/favorites`, { params: { period } });
    return response.data;
  }

  async getPushNotificationAnalytics(
    period: TimePeriod = '30d'
  ): Promise<AnalyticsResponse<PushNotificationAnalytics>> {
    const response = await this.api.get(`/engagement/push-notifications`, { params: { period } });
    return response.data;
  }

  // ==================== LOYALTY ANALYTICS ====================

  async getLoyaltyAnalytics(period: TimePeriod = '30d'): Promise<AnalyticsResponse<LoyaltyAnalytics>> {
    const response = await this.api.get(`/loyalty/overview`, { params: { period } });
    return response.data;
  }

  // ==================== ADVANCED ANALYTICS ====================

  async getCustomerLTV(period: TimePeriod = '90d'): Promise<AnalyticsResponse<CustomerLTV>> {
    const response = await this.api.get(`/advanced/ltv`, { params: { period } });
    return response.data;
  }

  async getGenderTrends(period: TimePeriod = '30d'): Promise<AnalyticsResponse<GenderTrends>> {
    const response = await this.api.get(`/advanced/gender-trends`, { params: { period } });
    return response.data;
  }

  async getHighValueCustomers(period: TimePeriod = '90d'): Promise<AnalyticsResponse<HighValueCustomers>> {
    const response = await this.api.get(`/advanced/high-value-customers`, { params: { period } });
    return response.data;
  }

  async getTimeToSecondOrder(period: TimePeriod = '90d'): Promise<AnalyticsResponse<TimeToSecondOrder>> {
    const response = await this.api.get(`/advanced/time-to-second-order`, { params: { period } });
    return response.data;
  }

  // ==================== BATCH OPERATIONS ====================

  /**
   * Fetch multiple analytics at once for dashboard overview
   */
  async getDashboardOverview(period: TimePeriod = '30d') {
    const [orders, revenue, users, products] = await Promise.all([
      this.getOrderOverview(period),
      this.getRevenueOverview(period),
      this.getUserOverview(period),
      this.getTopSellingProducts(period, 5),
    ]);

    return {
      orders: orders.data,
      revenue: revenue.data,
      users: users.data,
      products: products.data,
    };
  }
}

// Export singleton instance
export const analyticsAPI = new AnalyticsAPI();

// Export for custom usage
export default AnalyticsAPI;
