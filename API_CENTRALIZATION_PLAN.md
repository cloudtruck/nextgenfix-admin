# API Centralization Implementation Plan

## 🎯 Objective
Centralize all API calls in `lib/api/` directory with a single axios instance using `adminToken` from localStorage (not cookies).

---

## 📊 Current State Analysis

### ✅ **What's Already Good:**
1. **`lib/api/client.ts`** - Already has a properly configured axios instance with:
   - ✅ Uses `adminToken` from localStorage
   - ✅ Request interceptor adds `Bearer ${token}` to Authorization header
   - ✅ Response interceptor handles 401 errors
   - ✅ TypeScript types

2. **Existing API modules in `lib/api/`:**
   - ✅ `auth.ts` - Login, logout, profile
   - ✅ `dashboard.ts` - Dashboard stats
   - ✅ `users.ts` - User management
   - ✅ `orders.ts` - Order management
   - ✅ `complaints.ts` - Complaint management
   - ✅ `menu.ts` - Menu items
   - ✅ `coupons.ts` - Coupons
   - ✅ `tables.ts` - Tables
   - ✅ `categories.ts` - Categories
   - ✅ And more...

### ❌ **What Needs to be Fixed:**

1. **`lib/analyticsApi.ts`** - Outside `lib/api/` folder
   - Uses `getCookie()` (wrong - should use localStorage)
   - Creates its own axios instance
   - Needs to be moved to `lib/api/analytics.ts`

2. **`lib/complaintsApi.ts`** - Outside `lib/api/` folder  
   - Empty file, functionality should be in `lib/api/complaints.ts`

3. **`lib/api/client.ts`** - Has a bug:
   - Line 37: `localStorage.removeItem('admin_token')` (wrong key!)
   - Should be: `localStorage.removeItem('adminToken')`

4. **Components using direct axios calls:**
   - `app/(auth)/login/page.tsx` - Direct axios.post
   - `app/(dashboard)/dashboard/page.tsx` - Uses api but inconsistent
   - `app/(dashboard)/dashboard/users-analytics/page.tsx` - Direct axios + getCookie
   - `app/(dashboard)/dashboard/users/page.tsx` - Direct axios + getCookie
   - `app/(dashboard)/dashboard/revenue-analytics/page.tsx` - Direct axios + getCookie
   - `app/(dashboard)/dashboard/products-analytics/page.tsx` - Direct axios + getCookie
   - `app/(dashboard)/dashboard/orders-analytics/page.tsx` - Direct axios + getCookie
   - `app/(dashboard)/dashboard/menu/page.tsx` - Direct axios + getCookie
   - `app/(dashboard)/dashboard/loyalty/page.tsx` - Direct axios + getCookie
   - `app/(dashboard)/dashboard/engagement/page.tsx` - Direct axios + getCookie
   - `app/(dashboard)/dashboard/complaints/page.tsx` - Direct axios + getCookie
   - `app/(dashboard)/dashboard/advanced/page.tsx` - Direct axios + getCookie

---

## 🏗️ Implementation Plan

### **Phase 1: Fix the Core Client** ✅ CRITICAL

**File:** `lib/api/client.ts`

**Changes:**
1. Fix the token key in 401 handler:
   ```typescript
   // WRONG
   localStorage.removeItem('admin_token')
   
   // CORRECT
   localStorage.removeItem('adminToken')
   localStorage.removeItem('adminInfo')
   ```

2. Ensure consistent behavior with `lib/api.ts` and `lib/axios.ts`

---

### **Phase 2: Create Analytics API Module** 📊

**Action:** Move `lib/analyticsApi.ts` → `lib/api/analytics.ts`

**Changes:**
1. Remove `getCookie()` dependency
2. Use `apiClient` from `./client`
3. Remove custom axios instance creation
4. Keep all existing types and functions
5. Export everything properly

**Structure:**
```typescript
// lib/api/analytics.ts
import apiClient from './client'

export type TimePeriod = '1d' | '7d' | '30d' | '90d' | '1y'

// All existing types...
export interface AnalyticsResponse<T> { ... }
export interface OrderOverview { ... }
// ... etc

// Orders Analytics
export const getOrdersOverview = async (period?: TimePeriod) => {
  const response = await apiClient.get('/admin/analytics/orders/overview', {
    params: { period }
  })
  return response.data
}

// Revenue Analytics  
export const getRevenueOverview = async (period?: TimePeriod) => {
  const response = await apiClient.get('/admin/analytics/revenue/overview', {
    params: { period }
  })
  return response.data
}

// Users Analytics
export const getUsersOverview = async (period?: TimePeriod) => {
  const response = await apiClient.get('/admin/analytics/users/overview', {
    params: { period }
  })
  return response.data
}

// Products Analytics
export const getTopSellingProducts = async (limit = 10, period?: TimePeriod) => {
  const response = await apiClient.get('/admin/analytics/products/top-selling', {
    params: { limit, period }
  })
  return response.data
}

export const getCategoryPerformance = async (period?: TimePeriod) => {
  const response = await apiClient.get('/admin/analytics/products/category-performance', {
    params: { period }
  })
  return response.data
}

// ... all other analytics functions
```

---

### **Phase 3: Create Central API Index** 🎯

**File:** `lib/api/index.ts` (NEW)

**Purpose:** Single import point for all API calls

```typescript
// lib/api/index.ts

// Export the client
export { default as apiClient } from './client'

// Export all API modules
export * as auth from './auth'
export * as dashboard from './dashboard'
export * as users from './users'
export * as orders from './orders'
export * as complaints from './complaints'
export * as menu from './menu'
export * as coupons from './coupons'
export * as tables from './tables'
export * as categories from './categories'
export * as analytics from './analytics'
export * as settings from './settings'
export * as admins from './admins'
export * as adminUsers from './admin-users'
export * as combos from './combos'

// Export commonly used types
export type { Admin } from '../types'
export type { TimePeriod, AnalyticsResponse } from './analytics'
```

---

### **Phase 4: Update Login Page** 🔐

**File:** `app/(auth)/login/page.tsx`

**Before:**
```typescript
import axios from "axios";
const res = await axios.post(`${API_BASE_URL}/api/admin/login`, { email, password });
```

**After:**
```typescript
import { auth } from "@/lib/api";
const res = await auth.loginAdmin({ email, password });
```

---

### **Phase 5: Update Dashboard Page** 📈

**File:** `app/(dashboard)/dashboard/page.tsx`

**Before:**
```typescript
import api from "@/lib/api";
const ordersRes = await api.get('/admin/analytics/orders/overview');
```

**After:**
```typescript
import { analytics } from "@/lib/api";
const ordersData = await analytics.getOrdersOverview();
const revenueData = await analytics.getRevenueOverview();
const usersData = await analytics.getUsersOverview();
const productsData = await analytics.getTopSellingProducts(5);
```

---

### **Phase 6: Update Analytics Pages** 📊

Update these files to use centralized API:
1. `users-analytics/page.tsx`
2. `revenue-analytics/page.tsx`
3. `products-analytics/page.tsx`
4. `orders-analytics/page.tsx`

**Pattern:**
```typescript
// Before
import { getCookie } from "@/lib/utils";
const token = getCookie("adminToken");
const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

// After
import { analytics } from "@/lib/api";
const data = await analytics.getOrdersOverview(period);
```

---

### **Phase 7: Update Other Pages** 🔄

Update remaining pages:
1. `users/page.tsx` → Use `users` API module
2. `menu/page.tsx` → Use `menu` API module
3. `complaints/page.tsx` → Use `complaints` API module
4. `loyalty/page.tsx` → Use analytics or create new module
5. `engagement/page.tsx` → Use analytics or create new module
6. `advanced/page.tsx` → Use analytics or create new module

---

### **Phase 8: Clean Up Old Files** 🧹

**Delete or deprecate:**
1. `lib/analyticsApi.ts` (moved to `lib/api/analytics.ts`)
2. `lib/complaintsApi.ts` (empty, functionality in `lib/api/complaints.ts`)
3. `lib/axios.ts` (if not used elsewhere)
4. `lib/api.ts` (if superseded by `lib/api/index.ts`)

---

## 📋 Implementation Checklist

### Phase 1: Core Setup
- [ ] Fix `lib/api/client.ts` token key bug
- [ ] Test client interceptors work correctly

### Phase 2: Analytics Module
- [ ] Create `lib/api/analytics.ts`
- [ ] Move all types from `lib/analyticsApi.ts`
- [ ] Convert all functions to use `apiClient`
- [ ] Remove `getCookie` dependencies
- [ ] Test analytics endpoints

### Phase 3: Central Index
- [ ] Create `lib/api/index.ts`
- [ ] Export all modules
- [ ] Export common types
- [ ] Test imports work

### Phase 4: Update Components (Priority Order)
- [ ] Login page
- [ ] Dashboard page
- [ ] Users analytics page
- [ ] Revenue analytics page
- [ ] Products analytics page
- [ ] Orders analytics page
- [ ] Users management page
- [ ] Menu page
- [ ] Complaints page
- [ ] Other pages

### Phase 5: Testing
- [ ] Login flow works
- [ ] Token stored in localStorage as `adminToken`
- [ ] Protected routes get token automatically
- [ ] 401 errors trigger logout and redirect
- [ ] All analytics pages load data
- [ ] CRUD operations work (users, menu, etc.)

### Phase 6: Cleanup
- [ ] Remove old files
- [ ] Update imports across codebase
- [ ] Remove `getCookie` usage
- [ ] Remove direct axios imports

---

## 🎨 Code Patterns

### **Pattern 1: Simple GET Request**
```typescript
// Component
import { analytics } from "@/lib/api";

const data = await analytics.getOrdersOverview('7d');
```

### **Pattern 2: POST with Data**
```typescript
// Component
import { users } from "@/lib/api";

await users.createUser({
  name: "John Doe",
  email: "john@example.com",
  // ...
});
```

### **Pattern 3: With Query Params**
```typescript
// Component
import { users } from "@/lib/api";

const userList = await users.listUsers({
  search: "john",
  status: "active",
  page: 1,
  limit: 10
});
```

### **Pattern 4: Error Handling**
```typescript
// Component
import { analytics } from "@/lib/api";

try {
  const data = await analytics.getOrdersOverview();
  setData(data);
} catch (error) {
  // 401 already handled by interceptor (auto-logout)
  // Handle other errors
  console.error(error);
  toast({ title: "Error", description: "Failed to load data" });
}
```

---

## 🔥 Quick Wins (Start Here)

### **Priority 1: Fix Client Bug** ⚡
```bash
# File: lib/api/client.ts
# Line 37: Change 'admin_token' to 'adminToken'
```

### **Priority 2: Create Analytics Module** 📊
```bash
# Copy lib/analyticsApi.ts to lib/api/analytics.ts
# Replace getCookie with apiClient
```

### **Priority 3: Update Dashboard** 🏠
```bash
# File: app/(dashboard)/dashboard/page.tsx
# Use analytics module instead of direct api calls
```

---

## 📊 File Structure (Target State)

```
lib/
├── api/
│   ├── index.ts          ✨ NEW - Central export point
│   ├── client.ts         ✅ FIXED - Correct token key
│   ├── analytics.ts      ✨ NEW - Moved from lib/analyticsApi.ts
│   ├── auth.ts           ✅ Already good
│   ├── dashboard.ts      ✅ Already good
│   ├── users.ts          ✅ Already good
│   ├── orders.ts         ✅ Already good
│   ├── complaints.ts     ✅ Already good
│   ├── menu.ts           ✅ Already good
│   ├── coupons.ts        ✅ Already good
│   ├── tables.ts         ✅ Already good
│   ├── categories.ts     ✅ Already good
│   ├── settings.ts       ✅ Already good
│   ├── admins.ts         ✅ Already good
│   ├── admin-users.ts    ✅ Already good
│   └── combos.ts         ✅ Already good
├── types/
│   └── index.ts
├── store/
│   └── auth-store.ts
└── utils.ts

DEPRECATED (to be removed):
├── analyticsApi.ts       ❌ DELETE - Moved to lib/api/analytics.ts
├── complaintsApi.ts      ❌ DELETE - Empty file
├── axios.ts              ❌ DELETE - Use lib/api/client.ts
└── api.ts                ❌ DELETE - Use lib/api/index.ts
```

---

## 🚀 Benefits After Implementation

1. **✅ Consistency** - All API calls use same pattern
2. **✅ Type Safety** - Full TypeScript support
3. **✅ Auto Auth** - Token automatically added to all requests
4. **✅ Error Handling** - 401 errors handled centrally
5. **✅ Maintainability** - Single place to update API logic
6. **✅ Testability** - Easy to mock API calls
7. **✅ DX** - Clean imports: `import { analytics } from "@/lib/api"`

---

## ⏱️ Estimated Effort

| Phase | Files | Est. Time | Priority |
|-------|-------|-----------|----------|
| Phase 1: Fix Client | 1 | 5 min | 🔴 Critical |
| Phase 2: Analytics Module | 1 | 30 min | 🔴 Critical |
| Phase 3: Central Index | 1 | 10 min | 🟡 High |
| Phase 4: Login Page | 1 | 10 min | 🟡 High |
| Phase 5: Dashboard | 1 | 15 min | 🟡 High |
| Phase 6: Analytics Pages | 4 | 1 hour | 🟡 High |
| Phase 7: Other Pages | 6 | 2 hours | 🟢 Medium |
| Phase 8: Cleanup | - | 15 min | 🟢 Low |
| **TOTAL** | **15 files** | **~4 hours** | |

---

## 🎯 Success Criteria

- [ ] All API calls go through `lib/api/` modules
- [ ] No direct axios imports in components
- [ ] No `getCookie` usage for tokens
- [ ] All requests use `adminToken` from localStorage
- [ ] 401 errors consistently handled
- [ ] TypeScript types for all API responses
- [ ] Login → Dashboard flow works perfectly
- [ ] All analytics pages load without errors

---

## 📝 Notes

1. **Backward Compatibility:** During migration, both old and new patterns will coexist temporarily
2. **Testing Strategy:** Test each phase independently before moving to next
3. **Rollback Plan:** Keep old files until all components are migrated
4. **Documentation:** Update component README files with new import patterns

---

## 🤝 Next Steps

**Immediate Actions:**
1. ✅ Review and approve this plan
2. 🔧 Fix client.ts bug (Phase 1)
3. 📦 Create analytics.ts module (Phase 2)
4. 🏗️ Create index.ts (Phase 3)
5. 🔄 Start migrating components (Phases 4-7)
6. 🧹 Clean up old files (Phase 8)

**Questions to Resolve:**
- Should we keep `lib/api.ts` for backward compatibility?
- Do we need `lib/axios.ts` for anything else?
- Any custom logic in old files that needs to be preserved?

---

Ready to proceed? Let's start with Phase 1! 🚀
