# Analytics API Integration Guide

## 🚨 Critical Information

### Base URL Configuration
All analytics endpoints are mounted under:
```
/api/admin/analytics
```

### Current 404 Issue - Root Cause
The frontend `lib/api/analytics.ts` is making requests to the wrong base path. 

**❌ WRONG (Current):**
```typescript
apiClient.get('/admin/analytics/orders/overview')  // 404 Error
```

**✅ CORRECT:**
```typescript
apiClient.get('/api/admin/analytics/orders/overview')  // Works!
```

### Why This Happens
- Backend routes: `/api/admin/analytics/*` (see `app.js` and `adminRoutes.js`)
- Frontend `apiClient` base: `/api`
- Frontend makes call: `/admin/analytics/*` 
- **Final URL**: `/api/admin/analytics/*` ❌ (double admin prefix!)

### The Fix
Since `apiClient` already has `baseURL: '/api'`, your analytics API calls should be:

```typescript
// ✅ Correct pattern
apiClient.get('/admin/analytics/orders/overview', { params: { period } })
```

The apiClient will automatically prepend `/api` → final URL: `/api/admin/analytics/orders/overview` ✅

---

## 📋 Available Endpoints

### Authentication
All endpoints require admin authentication. The token is automatically included via `apiClient` interceptor from `localStorage.getItem('adminToken')`.

### Query Parameters
All endpoints support a `period` query parameter:
- `1d` - Last 24 hours
- `7d` - Last 7 days
- `30d` - Last 30 days (default)
- `90d` - Last 90 days
- `1y` - Last year

---

## 🔥 Phase 1: Critical Business Metrics

### 1. Order Analytics

#### GET `/admin/analytics/orders/overview`
Get comprehensive order metrics.

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/orders/overview', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 1250,
    "completedOrders": 1100,
    "cancelledOrders": 50,
    "completionRate": 88.0,
    "averageOrderValue": 45.50,
    "basketSize": 3.2,
    "totalRevenue": 50050.00
  },
  "breakdown": {
    "dayPart": {
      "breakfast": 200,
      "lunch": 450,
      "dinner": 600
    },
    "orderType": {
      "pickup": 750,
      "delivery": 500
    },
    "status": {
      "completed": 1100,
      "cancelled": 50,
      "pending": 100
    }
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

**TypeScript Interface:**
```typescript
interface OrderOverview {
  totalOrders: number
  completedOrders: number
  cancelledOrders: number
  completionRate: number
  averageOrderValue: number
  basketSize: number
  totalRevenue: number
}
```

---

#### GET `/admin/analytics/orders/abandoned-carts`
Get abandoned cart metrics and recovery rates.

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/orders/abandoned-carts', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAbandonedCarts": 350,
    "totalAbandonedValue": 15750.00,
    "avgCartValue": 45.00,
    "recovered": 45,
    "recoveredValue": 2025.00,
    "recoveryRate": 12.86,
    "recoveryValueRate": 12.86,
    "abandonmentReasons": [
      { "_id": "high_delivery_fee", "count": 120 },
      { "_id": "long_wait_time", "count": 80 }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

#### GET `/admin/analytics/orders/peak-times`
Get peak order times heatmap data.

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/orders/peak-times', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDataPoints": 168,
    "peakOrderTime": {
      "dayOfWeek": "Friday",
      "hour": 19,
      "dayPart": "dinner",
      "orderCount": 85,
      "totalRevenue": 3825.00,
      "avgOrderValue": 45.00
    },
    "avgOrdersPerHour": 7.44
  },
  "breakdown": {
    "heatmap": [
      {
        "dayOfWeek": "Monday",
        "hour": 12,
        "dayPart": "lunch",
        "orderCount": 25,
        "totalRevenue": 1125.00,
        "avgOrderValue": 45.00
      }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

### 2. Revenue Analytics

#### GET `/admin/analytics/revenue/overview`
Get revenue metrics (GMV, net revenue, discounts, refunds).

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/revenue/overview', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 50050.00,
    "netRevenue": 45545.00,
    "totalOrders": 1100,
    "avgOrderValue": 45.50,
    "totalDiscounts": 3250.00,
    "totalRefunds": 1255.00
  },
  "breakdown": {
    "revenueByDayPart": {
      "breakfast": 9000.00,
      "lunch": 20250.00,
      "dinner": 20800.00
    },
    "revenueByOrderType": {
      "pickup": 30030.00,
      "delivery": 20020.00
    }
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

### 3. User Analytics

#### GET `/admin/analytics/users/overview`
Get user metrics (active users, new vs returning).

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/users/overview', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 5200,
    "activeUsers": 1850,
    "newUsers": 450,
    "returningUsers": 1400,
    "DAU": 62,
    "WAU": 425,
    "MAU": 1850
  },
  "breakdown": {
    "userActivity": {
      "active": 1850,
      "inactive": 3350
    },
    "userType": {
      "new": 450,
      "returning": 1400
    }
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

#### GET `/admin/analytics/users/demographics`
Get detailed user demographics (age, gender, location, device).

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/users/demographics', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "genderDistribution": {
      "male": 2800,
      "female": 2200,
      "other": 200
    },
    "ageGroupDistribution": {
      "18-24": 1200,
      "25-34": 2500,
      "35-44": 1000,
      "45+": 500
    },
    "locationDistribution": {
      "New York": 1500,
      "Los Angeles": 1200,
      "Chicago": 800
    },
    "deviceTypeDistribution": {
      "mobile": 3800,
      "desktop": 1000,
      "tablet": 400
    }
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

#### GET `/admin/analytics/users/retention`
Get user retention rates and cohort analysis.

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/users/retention', {
  params: { period: '90d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "day1Retention": 65.5,
    "day7Retention": 42.3,
    "day30Retention": 28.5,
    "avgRetention": 45.43
  },
  "breakdown": {
    "cohortAnalysis": [
      {
        "cohortMonth": "2025-08",
        "size": 450,
        "day1": 295,
        "day7": 190,
        "day30": 128
      }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-07-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

### 4. Product Analytics

#### GET `/admin/analytics/products/top-selling`
Get top-selling products by revenue.

**Query Parameters:**
- `period` - Time period (default: 30d)
- `limit` - Number of products to return (default: 10)

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/products/top-selling', {
  params: { period: '30d', limit: 10 }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "topProducts": [
      {
        "productId": "prod_123",
        "productName": "Butter Chicken Naan",
        "totalOrders": 850,
        "totalRevenue": 12750.00,
        "avgPrice": 15.00,
        "totalQuantity": 1200
      }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

#### GET `/admin/analytics/products/category-performance`
Get performance metrics by product category.

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/products/category-performance', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category": "Naan",
        "totalOrders": 1200,
        "totalRevenue": 18000.00,
        "avgOrderValue": 15.00,
        "popularItems": ["Butter Naan", "Garlic Naan"]
      }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

#### GET `/admin/analytics/products/search-analytics`
Get search analytics (search terms, failed searches, conversion).

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/products/search-analytics', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSearches": 5600,
    "uniqueSearchTerms": 850,
    "avgSearchesPerUser": 3.03,
    "topSearchTerms": [
      { "term": "butter chicken", "count": 450, "conversionRate": 75.5 },
      { "term": "garlic naan", "count": 380, "conversionRate": 82.1 }
    ],
    "failedSearches": [
      { "term": "vegan pizza", "count": 45 }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

#### GET `/admin/analytics/products/customization-usage`
Get product customization usage analytics.

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/products/customization-usage', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCustomizations": 8500,
    "customizationRate": 68.0,
    "topCustomizations": [
      { "option": "Extra Spicy", "count": 2500, "percentage": 29.4 },
      { "option": "No Onions", "count": 1800, "percentage": 21.2 }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

## 🚀 Phase 2: User Behavior & Engagement

### 5. Engagement Analytics

#### GET `/admin/analytics/engagement/sessions`
Get session analytics (duration, page views, bounce rate).

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/engagement/sessions', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSessions": 12500,
    "avgSessionDuration": 285,
    "bounceRate": 32.5
  },
  "breakdown": {
    "durationDistribution": [
      { "range": "0-60s", "count": 2500 },
      { "range": "60-180s", "count": 4500 },
      { "range": "180-300s", "count": 3200 },
      { "range": "300+s", "count": 2300 }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

#### GET `/admin/analytics/engagement/favorites`
Get favorites analytics (most favorited products, trends).

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/engagement/favorites', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalFavorites": 8500,
    "topFavorites": [
      { "productName": "Butter Chicken", "count": 850 },
      { "productName": "Garlic Naan", "count": 720 }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

#### GET `/admin/analytics/engagement/push-notifications`
Get push notification performance metrics.

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/engagement/push-notifications', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSent": 15000,
    "delivered": 14250,
    "opened": 8550,
    "clicked": 4275,
    "deliveryRate": 95.0,
    "openRate": 60.0,
    "clickRate": 50.0
  },
  "breakdown": {
    "byType": {
      "promotional": { "sent": 8000, "opened": 4800, "clicked": 2400 },
      "transactional": { "sent": 7000, "opened": 3750, "clicked": 1875 }
    }
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

### 6. Loyalty Analytics

#### GET `/admin/analytics/loyalty/overview`
Get loyalty program analytics (enrollment, tiers, points, referrals).

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/loyalty/overview', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollmentRate": 65.5,
    "redemptionRate": 42.3,
    "tierDistribution": {
      "bronze": 2500,
      "silver": 1200,
      "gold": 450,
      "platinum": 150
    },
    "totalPointsEarned": 125000,
    "totalPointsRedeemed": 52875,
    "referralStats": {
      "totalReferrals": 850,
      "successfulReferrals": 620,
      "conversionRate": 72.94
    }
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

## 🎯 Phase 3: Advanced Analytics

### 7. Advanced Business Intelligence

#### GET `/admin/analytics/advanced/ltv`
Get Customer Lifetime Value (LTV) analysis.

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/advanced/ltv', {
  params: { period: '90d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "avgLTV": 285.50,
    "medianLTV": 195.00,
    "totalCustomers": 5200,
    "avgOrdersPerCustomer": 4.8,
    "avgCustomerLifespanDays": 185
  },
  "breakdown": {
    "ltvSegments": {
      "high": { "count": 520, "avgLTV": 850.00 },
      "medium": { "count": 2080, "avgLTV": 285.00 },
      "low": { "count": 2600, "avgLTV": 95.00 }
    }
  },
  "metadata": {
    "dateRange": {
      "start": "2025-07-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

#### GET `/admin/analytics/advanced/gender-trends`
Get gender-item-day trends and preferences.

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/advanced/gender-trends', {
  params: { period: '30d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTrends": 850,
    "topTrends": [
      {
        "gender": "female",
        "dayOfWeek": "Friday",
        "dayPart": "dinner",
        "category": "Vegetarian",
        "orderCount": 125,
        "totalRevenue": 5625.00
      }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-09-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

#### GET `/admin/analytics/advanced/high-value-customers`
Get high-value customers analysis (Pareto 80/20).

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/advanced/high-value-customers', {
  params: { period: '90d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 5200,
    "highValueCount": 1040,
    "highValuePercentage": 20.0,
    "revenueFromHighValue": 40040.00,
    "revenuePercentage": 80.0,
    "avgSpendHighValue": 385.00,
    "avgSpendOthers": 48.00
  },
  "breakdown": {
    "topCustomers": [
      {
        "userId": "user_123",
        "totalSpent": 2500.00,
        "orderCount": 35,
        "avgOrderValue": 71.43
      }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-07-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

#### GET `/admin/analytics/advanced/time-to-second-order`
Get time-to-second-order distribution.

**Request:**
```typescript
const response = await apiClient.get('/admin/analytics/advanced/time-to-second-order', {
  params: { period: '90d' }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "avgDaysToSecondOrder": 12.5,
    "medianDaysToSecondOrder": 8.0,
    "totalCustomersWithSecondOrder": 3250
  },
  "breakdown": {
    "distribution": [
      { "range": "0-7 days", "count": 1200, "percentage": 36.92 },
      { "range": "8-14 days", "count": 950, "percentage": 29.23 },
      { "range": "15-30 days", "count": 750, "percentage": 23.08 },
      { "range": "30+ days", "count": 350, "percentage": 10.77 }
    ]
  },
  "metadata": {
    "dateRange": {
      "start": "2025-07-28T00:00:00.000Z",
      "end": "2025-10-28T00:00:00.000Z"
    },
    "calculatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

## 🔧 Implementation Examples

### Example 1: Fetching Order Overview
```typescript
import apiClient from '@/lib/api/client'

const fetchOrderAnalytics = async (period: string = '30d') => {
  try {
    const response = await apiClient.get('/admin/analytics/orders/overview', {
      params: { period }
    })
    
    if (response.data.success) {
      return response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch order analytics:', error)
    throw error
  }
}

// Usage in component
const orderData = await fetchOrderAnalytics('30d')
console.log('Total Orders:', orderData.totalOrders)
```

---

### Example 2: Creating a Reusable Hook
```typescript
import { useState, useEffect } from 'react'
import apiClient from '@/lib/api/client'

export function useAnalytics<T>(endpoint: string, period: string = '30d') {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(endpoint, {
          params: { period }
        })
        
        if (response.data.success) {
          setData(response.data.data)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, period])

  return { data, loading, error }
}

// Usage in component
function OrderAnalytics() {
  const { data, loading, error } = useAnalytics<OrderOverview>(
    '/admin/analytics/orders/overview',
    '30d'
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return null

  return (
    <div>
      <h2>Total Orders: {data.totalOrders}</h2>
      <p>Completion Rate: {data.completionRate}%</p>
    </div>
  )
}
```

---

### Example 3: Parallel Data Fetching
```typescript
import apiClient from '@/lib/api/client'

const fetchDashboardData = async (period: string = '30d') => {
  try {
    const [orders, revenue, users, products] = await Promise.all([
      apiClient.get('/admin/analytics/orders/overview', { params: { period } }),
      apiClient.get('/admin/analytics/revenue/overview', { params: { period } }),
      apiClient.get('/admin/analytics/users/overview', { params: { period } }),
      apiClient.get('/admin/analytics/products/top-selling', { params: { period, limit: 5 } })
    ])

    return {
      orders: orders.data.data,
      revenue: revenue.data.data,
      users: users.data.data,
      products: products.data.data
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    throw error
  }
}
```

---

## 🐛 Troubleshooting

### Issue: 404 Not Found
**Cause:** Incorrect endpoint path in frontend

**Solution:** 
```typescript
// ❌ Wrong
apiClient.get('/analytics/orders/overview')

// ✅ Correct
apiClient.get('/admin/analytics/orders/overview')
```

---

### Issue: 401 Unauthorized
**Cause:** Missing or invalid admin token

**Solution:**
1. Check if token exists: `localStorage.getItem('adminToken')`
2. Verify token is valid and not expired
3. Re-login to get fresh token
4. The apiClient interceptor automatically handles 401 by redirecting to login

---

### Issue: CORS Error
**Cause:** Frontend origin not in backend's allowed origins

**Solution:**
1. Check backend `.env` file: `CORS_ALLOWED_ORIGINS`
2. Add your frontend URL (e.g., `http://localhost:3000`)
3. Restart backend server

---

### Issue: Timeout Error
**Cause:** Analytics calculation takes too long

**Solution:**
1. Use cached data by checking `response.data.cached === true`
2. Implement loading states in UI
3. Consider increasing `apiClient` timeout (currently 30s)

---

## 📊 Response Structure

All analytics endpoints follow this consistent structure:

```typescript
interface AnalyticsResponse<T> {
  success: boolean          // Always true for successful requests
  data: T                   // Main data payload (varies by endpoint)
  breakdown?: Record<string, any>  // Optional detailed breakdowns
  trend?: TrendData[]       // Optional trend data over time
  cached?: boolean          // True if served from cache
  metadata: {
    dateRange: {
      start: string         // ISO date string
      end: string           // ISO date string
    }
    calculatedAt: string    // ISO date string
  }
}
```

---

## 🔐 Authentication Flow

1. Admin logs in → receives `adminToken`
2. Token stored in `localStorage.getItem('adminToken')`
3. apiClient interceptor automatically attaches token to every request
4. Backend verifies token via `verifyAdmin` middleware
5. If token invalid/expired → 401 → auto-redirect to `/login`

---

## 🚀 Best Practices

### 1. Use TypeScript Interfaces
Define interfaces for type safety:
```typescript
interface OrderOverview {
  totalOrders: number
  completedOrders: number
  // ... rest of fields
}

const data = await apiClient.get<AnalyticsResponse<OrderOverview>>(
  '/admin/analytics/orders/overview'
)
```

### 2. Implement Error Handling
```typescript
try {
  const response = await apiClient.get('/admin/analytics/orders/overview')
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      console.error('Endpoint not found - check URL')
    } else if (error.response?.status === 401) {
      console.error('Authentication failed - token invalid')
    }
  }
}
```

### 3. Cache Awareness
Backend caches analytics data. Check `cached` flag:
```typescript
const response = await apiClient.get('/admin/analytics/orders/overview')
if (response.data.cached) {
  console.log('Serving cached data from:', response.data.metadata.calculatedAt)
}
```

### 4. Loading States
Always implement loading states for better UX:
```typescript
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/admin/analytics/orders/overview')
      setData(response.data.data)
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [])
```

---

## 📝 Quick Reference Checklist

Before making analytics API calls:

- [ ] Endpoint path starts with `/admin/analytics`
- [ ] Admin token exists in localStorage
- [ ] Period parameter is valid (`1d`, `7d`, `30d`, `90d`, `1y`)
- [ ] Error handling implemented
- [ ] Loading state implemented
- [ ] TypeScript interfaces defined
- [ ] Response structure matches expected format

---

## 🆘 Support

If you encounter issues:

1. **Check Backend Logs:** Look for errors in backend console
2. **Verify Routes:** Ensure analytics routes are mounted in `adminRoutes.js`
3. **Test with Postman:** Verify endpoints work outside of frontend
4. **Check Network Tab:** Inspect actual request URL and response
5. **Validate Token:** Ensure admin token is valid and not expired

---

## 📚 Additional Resources

- **Backend Routes:** `naanly-backend/routes/analyticsRoutes.js`
- **Backend Controller:** `naanly-backend/controllers/analyticsController.js`
- **Frontend API Client:** `naanly-admin/lib/api/client.ts`
- **Admin Routes Mount:** `naanly-backend/routes/adminRoutes.js` (line 43)

---

**Last Updated:** October 28, 2025  
**Version:** 1.0.0
