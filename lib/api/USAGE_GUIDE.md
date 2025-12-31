# API Usage Guide

## ✅ **Phases 1-3 Complete!**

You now have a centralized API layer in `lib/api/` that:
- ✅ Uses `adminToken` from localStorage (not cookies)
- ✅ Automatically injects auth token in all requests
- ✅ Handles 401 errors consistently
- ✅ Provides full TypeScript types
- ✅ Single import point for all APIs

---

## 🚀 **How to Use**

### **1. Import from Central Location**

```typescript
// Single import for everything you need
import { analytics, auth, users, dashboard } from '@/lib/api'

// Or import specific functions
import { getOrderOverview, getUserOverview } from '@/lib/api/analytics'
```

### **2. Use in Components**

```typescript
'use client'
import { useEffect, useState } from 'react'
import { analytics } from '@/lib/api'
import type { OrderOverview, TimePeriod } from '@/lib/api'

export default function DashboardPage() {
  const [data, setData] = useState<OrderOverview | null>(null)
  const [period, setPeriod] = useState<TimePeriod>('7d')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Token automatically included from localStorage
        const response = await analytics.getOrderOverview(period)
        setData(response.data)
      } catch (error) {
        // 401 errors automatically handled (logout + redirect)
        console.error('Failed to fetch orders:', error)
      }
    }
    fetchData()
  }, [period])

  return <div>...</div>
}
```

### **3. Multiple API Calls**

```typescript
import { analytics } from '@/lib/api'

// Parallel requests
const [orders, revenue, users] = await Promise.all([
  analytics.getOrderOverview('30d'),
  analytics.getRevenueOverview('30d'),
  analytics.getUserOverview('30d'),
])

// Or use the batch function
const overview = await analytics.getDashboardOverview('30d')
// Returns: { orders, revenue, users, products }
```

### **4. Other API Modules**

```typescript
import { auth, users, menu, complaints } from '@/lib/api'

// Authentication
await auth.loginAdmin({ email, password })
await auth.logout()
const profile = await auth.getProfile()

// User Management
const userList = await users.listUsers({ page: 1, limit: 10 })
await users.createUser(userData)
await users.updateUser(userId, updates)
await users.deleteUser(userId)

// Menu Management
const menuItems = await menu.listMenuItems()
await menu.createMenuItem(itemData)

// Complaints
const complaints = await complaints.listComplaints()
```

---

## 📁 **File Structure**

```
lib/api/
├── index.ts          ✨ Central export (use this!)
├── client.ts         🔧 Axios instance with auth
├── analytics.ts      📊 NEW - All analytics endpoints
├── auth.ts           🔐 Login, logout, profile
├── dashboard.ts      📈 Dashboard stats
├── users.ts          👥 User management
├── orders.ts         📦 Order management
├── menu.ts           🍽️  Menu items
├── complaints.ts     💬 Complaints
├── coupons.ts        🎟️  Coupons
├── tables.ts         🪑 Tables
└── ...
```

---

## 🎯 **Key Benefits**

1. **No Manual Token Handling** - Token automatically included
2. **Consistent Error Handling** - 401 = auto logout
3. **Type Safety** - Full TypeScript support
4. **Clean Imports** - Single source of truth
5. **Maintainable** - Update once, affects all

---

## 🔄 **Migration Pattern**

### **Before (Old Way):**
```typescript
import axios from 'axios'
import { getCookie } from '@/lib/utils'

const token = getCookie('adminToken')
const headers = { Authorization: `Bearer ${token}` }
const response = await axios.get(
  `${API_BASE_URL}/api/admin/analytics/orders/overview`,
  { headers, params: { period } }
)
const data = response.data
```

### **After (New Way):**
```typescript
import { analytics } from '@/lib/api'

const response = await analytics.getOrderOverview(period)
const data = response.data
```

**Result:** 6 lines → 2 lines! 🎉

---

## 📋 **Next Steps (When Ready)**

When you're ready to update existing components:

1. **Find pages using old pattern:**
   - Search for `getCookie('adminToken')`
   - Search for direct `axios.get` calls

2. **Replace with new pattern:**
   ```typescript
   // Old
   import axios from 'axios'
   const token = getCookie('adminToken')
   const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
   
   // New
   import { analytics } from '@/lib/api'
   const response = await analytics.getOrderOverview('7d')
   ```

3. **Test thoroughly:**
   - Login flow
   - Protected pages
   - API calls
   - Logout

---

## 🐛 **Troubleshooting**

### **401 Errors (Unauthorized)**
- Check if `adminToken` exists in localStorage
- Verify token hasn't expired (7 days)
- Check backend is accepting the token

### **CORS Issues**
- Verify `NEXT_PUBLIC_API_URL` env variable
- Check backend CORS settings

### **TypeScript Errors**
- Run `npm run type-check`
- Ensure all imports use `@/lib/api`

---

## ✅ **What's Working Now**

- ✅ `lib/api/client.ts` - Correct token key (`adminToken`)
- ✅ `lib/api/analytics.ts` - All analytics functions
- ✅ `lib/api/index.ts` - Central export point
- ✅ Automatic token injection
- ✅ Automatic 401 handling
- ✅ Full TypeScript types

---

## 📝 **Example: Update Dashboard Page**

```typescript
// File: app/(dashboard)/dashboard/page.tsx

'use client'
import { useEffect, useState } from 'react'
import { analytics } from '@/lib/api'
import type { OrderOverview, RevenueOverview, UserOverview } from '@/lib/api'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    orders: null as OrderOverview | null,
    revenue: null as RevenueOverview | null,
    users: null as UserOverview | null,
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Clean, simple, type-safe!
        const [ordersRes, revenueRes, usersRes] = await Promise.all([
          analytics.getOrderOverview('7d'),
          analytics.getRevenueOverview('7d'),
          analytics.getUserOverview('7d'),
        ])

        setData({
          orders: ordersRes.data,
          revenue: revenueRes.data,
          users: usersRes.data,
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Orders: {data.orders?.totalOrders}</p>
      <p>Total Revenue: ${data.revenue?.totalRevenue}</p>
      <p>Total Users: {data.users?.totalUsers}</p>
    </div>
  )
}
```

---

**Ready to use! 🎉** Your centralized API layer is now set up and ready to replace old patterns throughout the codebase.
