# Admin Panel - Step-by-Step Implementation Checklist

## ✅ Phase 1: Foundation (Day 1-2)

### 1.1 Install Dependencies
```bash
cd naanly-admin
pnpm add @tanstack/react-query zustand react-hook-form @hookform/resolvers zod date-fns
```

- [ ] Dependencies installed
- [ ] Test dev server: `pnpm dev`

---

### 1.2 Environment Setup

- [ ] Create `.env.local` file in `naanly-admin/`
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:5000/api
  NEXT_PUBLIC_APP_NAME=NextGenFix Admin
  ```

---

### 1.3 TypeScript Types

- [ ] Create `lib/types/index.ts`
  - [ ] Admin interface
  - [ ] User interface with tier
  - [ ] Order interface with type (scheduled/dining)
  - [ ] MenuItem interface with discounted price
  - [ ] ComboOffer interface
  - [ ] Coupon interface
  - [ ] Complaint interface
  - [ ] Table interface
  - [ ] Settings interface

---

### 1.4 API Client Setup

- [ ] Create `lib/api/client.ts`
  - [ ] Axios instance with base URL
  - [ ] Request interceptor (add auth token)
  - [ ] Response interceptor (handle errors)
  - [ ] Export apiClient

- [ ] Create `lib/api/auth.ts`
  - [ ] `loginAdmin(email, password)`
  - [ ] `signupAdmin(data)`
  - [ ] `getProfile()`
  - [ ] `logout()`

- [ ] Create `lib/api/dashboard.ts`
  - [ ] `getDashboardStats()`
  - [ ] `getRevenueStats()`
  - [ ] `getOrderStats()`

- [ ] Create `lib/api/users.ts`
  - [ ] `getUsers(params)`
  - [ ] `getUserById(id)`
  - [ ] `updateUser(id, data)`
  - [ ] `deleteUser(id)`

- [ ] Create `lib/api/orders.ts`
  - [ ] `getOrders(params)`
  - [ ] `getOrderById(id)`
  - [ ] `updateOrderStatus(id, status)`

- [ ] Create `lib/api/menu.ts`
  - [ ] `getMenuItems(params)`
  - [ ] `getMenuItemById(id)`
  - [ ] `createMenuItem(data)`
  - [ ] `updateMenuItem(id, data)`
  - [ ] `deleteMenuItem(id)`

- [ ] Create `lib/api/categories.ts`
  - [ ] `getCategories()`
  - [ ] `createCategory(data)`
  - [ ] `updateCategory(id, data)`
  - [ ] `deleteCategory(id)`

- [ ] Create `lib/api/combos.ts`
  - [ ] `getCombos()`
  - [ ] `getComboById(id)`
  - [ ] `createCombo(data)`
  - [ ] `updateCombo(id, data)`
  - [ ] `deleteCombo(id)`
  - [ ] `toggleComboStatus(id)`

- [ ] Create `lib/api/coupons.ts`
  - [ ] `getCoupons()`
  - [ ] `createCoupon(data)`
  - [ ] `updateCoupon(id, data)`
  - [ ] `deleteCoupon(id)`
  - [ ] `toggleCouponStatus(id)`

- [ ] Create `lib/api/complaints.ts`
  - [ ] `getComplaints(params)`
  - [ ] `getComplaintById(id)`
  - [ ] `updateComplaintStatus(id, status)`
  - [ ] `respondToComplaint(id, response)`

- [ ] Create `lib/api/tables.ts`
  - [ ] `getTables(params)`
  - [ ] `createTable(data)`
  - [ ] `updateTable(id, data)`
  - [ ] `deleteTable(id)`
  - [ ] `bulkCreateTables(data)`
  - [ ] `getReservations()`
  - [ ] `updateReservationStatus(id, status)`

- [ ] Create `lib/api/settings.ts`
  - [ ] `getSettings()`
  - [ ] `updateBusinessHours(data)`
  - [ ] `updateDeliveryConfig(data)`
  - [ ] `updateTierConfig(data)`
  - [ ] `updateReferralConfig(data)`
  - [ ] `updateTaxConfig(data)`
  - [ ] `updateSchedulingConfig(data)`

---

### 1.5 State Management

- [ ] Create `lib/store/auth-store.ts` (Zustand)
  - [ ] admin state
  - [ ] token state
  - [ ] isAuthenticated state
  - [ ] login function
  - [ ] logout function
  - [ ] hasPermission function

- [ ] Create `lib/store/ui-store.ts`
  - [ ] sidebarOpen state
  - [ ] theme state (dark/light)

---

### 1.6 Root Layout Setup

- [ ] Update `app/layout.tsx`
  - [ ] Add QueryClientProvider
  - [ ] Add Toaster from sonner
  - [ ] Add ThemeProvider (optional)

---

## ✅ Phase 2: Authentication (Day 3)

### 2.1 Login Page

- [ ] Update `app/(auth)/login/page.tsx`
  - [ ] Form with email and password fields
  - [ ] Use react-hook-form with zod validation
  - [ ] Call `loginAdmin` API
  - [ ] Store token in localStorage
  - [ ] Update auth store
  - [ ] Redirect to `/dashboard` on success
  - [ ] Show error toast on failure

- [ ] Test login with backend

---

### 2.2 Middleware for Protection

- [ ] Create/update `middleware.ts`
  - [ ] Check for token in cookies/localStorage
  - [ ] Redirect to `/login` if no token on protected routes
  - [ ] Redirect to `/dashboard` if token exists on `/login`
  - [ ] Define matcher for protected routes

---

### 2.3 Logout Functionality

- [ ] Add logout to header component
  - [ ] Clear token from localStorage
  - [ ] Clear auth store
  - [ ] Redirect to `/login`

---

## ✅ Phase 3: Layout & Navigation (Day 4)

### 3.1 Update Sidebar

- [ ] Update `components/sidebar.tsx`
  - [ ] Remove: Chefs, Reviews, Content sections
  - [ ] Keep: Dashboard, Users, Orders, Menu Items, Complaints
  - [ ] Add: Categories, Combo Offers, Coupons, Tables, Settings
  - [ ] Add: Admin Users (conditionally for super_admin)
  - [ ] Update icons using lucide-react
  - [ ] Highlight active route

---

### 3.2 Update Header

- [ ] Update `components/header.tsx`
  - [ ] Display admin name from auth store
  - [ ] Display admin role badge
  - [ ] Add user dropdown menu
  - [ ] Add logout option
  - [ ] Add notifications icon (placeholder)

---

### 3.3 Dashboard Layout

- [ ] Verify `app/(dashboard)/dashboard/layout.tsx`
  - [ ] Sidebar on left
  - [ ] Header on top
  - [ ] Main content area
  - [ ] Responsive design

---

## ✅ Phase 4: Dashboard Home (Day 5)

### 4.1 Dashboard Page

- [ ] Update `app/(dashboard)/dashboard/page.tsx`
  - [ ] Fetch dashboard stats using React Query
  - [ ] Display 4 stat cards:
    - [ ] Total Revenue
    - [ ] Total Orders
    - [ ] Total Users
    - [ ] Avg Order Value
  - [ ] Revenue chart (recharts)
  - [ ] Order status distribution chart
  - [ ] Recent orders table

---

### 4.2 Dashboard Components

- [ ] Create `components/dashboard/stat-card.tsx`
- [ ] Create `components/dashboard/revenue-chart.tsx`
- [ ] Create `components/dashboard/order-status-chart.tsx`
- [ ] Create `components/dashboard/recent-orders-table.tsx`

---

## ✅ Phase 5: Users Management (Day 6-7)

### 5.1 Users Page

- [ ] Create `app/(dashboard)/dashboard/users/page.tsx`
  - [ ] Fetch users with React Query
  - [ ] Display users table
  - [ ] Add search bar
  - [ ] Add filters (tier, status)
  - [ ] Add pagination

---

### 5.2 Users Components

- [ ] Create `components/users/user-table.tsx`
  - [ ] Columns: Name, Phone, Email, Tier, Status, Actions
  - [ ] Tier badge component
  - [ ] View details button
  - [ ] Edit button
  - [ ] Delete button (with confirmation)

- [ ] Create `components/users/user-details-modal.tsx`
  - [ ] Display user info
  - [ ] Display tier progress
  - [ ] Display order history
  - [ ] Display referral info
  - [ ] Change tier dropdown

- [ ] Create `components/users/tier-badge.tsx`
  - [ ] Bronze/Silver/Gold badges with colors

---

## ✅ Phase 6: Orders Management (Day 8-9)

### 6.1 Orders Page

- [ ] Create `app/(dashboard)/dashboard/orders/page.tsx`
  - [ ] Fetch orders with React Query
  - [ ] Display orders table
  - [ ] Add filters (status, type, date range)
  - [ ] Add search by order ID/customer name
  - [ ] Add pagination

---

### 6.2 Orders Components

- [ ] Create `components/orders/order-table.tsx`
  - [ ] Columns: Order ID, Customer, Type, Table, Status, Amount, Date, Actions
  - [ ] Status badge
  - [ ] Type badge (scheduled/dining)
  - [ ] View details button

- [ ] Create `components/orders/order-details-modal.tsx`
  - [ ] Customer info
  - [ ] Order items with quantities
  - [ ] Pricing breakdown
  - [ ] Order type & details
  - [ ] Status timeline
  - [ ] Update status button

- [ ] Create `components/orders/status-badge.tsx`
  - [ ] Different colors for each status

- [ ] Create `components/orders/update-status-dialog.tsx`
  - [ ] Dropdown to select new status
  - [ ] Confirmation

---

## ✅ Phase 7: Menu Items (Day 10-11)

### 7.1 Menu Page

- [ ] Create `app/(dashboard)/dashboard/menu/page.tsx`
  - [ ] Fetch menu items
  - [ ] Display menu items table
  - [ ] Add/Edit buttons
  - [ ] Delete button
  - [ ] Filters (category, availability)
  - [ ] Search

---

### 7.2 Menu Components

- [ ] Create `components/menu/menu-table.tsx`
  - [ ] Columns: Image, Name, Category, Price, Discounted Price, Calories, Available, Actions

- [ ] Create `components/menu/menu-form-dialog.tsx`
  - [ ] Form fields:
    - [ ] Name
    - [ ] Description
    - [ ] Category (dropdown)
    - [ ] Price
    - [ ] Discounted Price
    - [ ] Image URL
    - [ ] Allergens (multi-select)
    - [ ] Calories
    - [ ] Prep Time
    - [ ] Recommended Items (multi-select)
    - [ ] Is Available
    - [ ] Is Vegetarian
  - [ ] Validation
  - [ ] Submit handler

---

## ✅ Phase 8: Categories (Day 12)

### 8.1 Categories Page

- [ ] Create `app/(dashboard)/dashboard/categories/page.tsx`
  - [ ] Fetch categories
  - [ ] Display categories table
  - [ ] Add/Edit/Delete buttons

---

### 8.2 Categories Components

- [ ] Create `components/categories/category-table.tsx`
- [ ] Create `components/categories/category-form-dialog.tsx`

---

## ✅ Phase 9: Combo Offers (Day 13)

### 9.1 Combos Page

- [ ] Create `app/(dashboard)/dashboard/combos/page.tsx`
  - [ ] Fetch combos
  - [ ] Display combos table
  - [ ] Add/Edit/Delete buttons
  - [ ] Toggle active status

---

### 9.2 Combos Components

- [ ] Create `components/combos/combo-table.tsx`
- [ ] Create `components/combos/combo-form-dialog.tsx`
  - [ ] Multi-select for menu items

---

## ✅ Phase 10: Coupons (Day 14)

### 10.1 Coupons Page

- [ ] Create `app/(dashboard)/dashboard/coupons/page.tsx`
  - [ ] Fetch coupons
  - [ ] Display coupons table
  - [ ] Add/Edit/Delete buttons
  - [ ] Toggle active status

---

### 10.2 Coupons Components

- [ ] Create `components/coupons/coupon-table.tsx`
- [ ] Create `components/coupons/coupon-form-dialog.tsx`
  - [ ] Code generator
  - [ ] Discount type selector
  - [ ] Tier selector (multi-select)

---

## ✅ Phase 11: Complaints (Day 15)

### 11.1 Complaints Page

- [ ] Create `app/(dashboard)/dashboard/complaints/page.tsx`
  - [ ] Fetch complaints
  - [ ] Display complaints table
  - [ ] Filters (status, category, priority)
  - [ ] View details

---

### 11.2 Complaints Components

- [ ] Create `components/complaints/complaint-table.tsx`
- [ ] Create `components/complaints/complaint-details-modal.tsx`
  - [ ] Display attachments (images/videos)
  - [ ] Response form
  - [ ] Status update dropdown

---

## ✅ Phase 12: Tables (Day 16)

### 12.1 Tables Page

- [ ] Create `app/(dashboard)/dashboard/tables/page.tsx`
  - [ ] Tabs: Tables & Reservations
  - [ ] Tables tab:
    - [ ] Fetch tables
    - [ ] Display tables table
    - [ ] Add single table
    - [ ] Bulk create tables
    - [ ] Edit/Delete tables
  - [ ] Reservations tab:
    - [ ] Fetch reservations
    - [ ] Display reservations table
    - [ ] Update reservation status

---

### 12.2 Tables Components

- [ ] Create `components/tables/table-table.tsx`
- [ ] Create `components/tables/add-table-dialog.tsx`
- [ ] Create `components/tables/bulk-create-dialog.tsx`
- [ ] Create `components/tables/reservations-table.tsx`

---

## ✅ Phase 13: Settings (Day 17-18)

### 13.1 Settings Page

- [ ] Create `app/(dashboard)/dashboard/settings/page.tsx`
  - [ ] Use Tabs component
  - [ ] 6 tabs for different settings sections

---

### 13.2 Settings Components

- [ ] Create `components/settings/business-hours-form.tsx`
  - [ ] Separate dine-in and delivery
  - [ ] Per-day configuration

- [ ] Create `components/settings/tax-form.tsx`
  - [ ] Tax type, rate, CGST, SGST

- [ ] Create `components/settings/delivery-form.tsx`
  - [ ] Delivery type selector
  - [ ] Conditional fields based on type

- [ ] Create `components/settings/tier-form.tsx`
  - [ ] Configure all three tiers

- [ ] Create `components/settings/referral-form.tsx`
  - [ ] Referrer & referred discounts

- [ ] Create `components/settings/scheduling-form.tsx`
  - [ ] Max/min days, time slots

---

## ✅ Phase 14: Admin Users (Day 19)

### 14.1 Admin Users Page (Super Admin Only)

- [ ] Create `app/(dashboard)/dashboard/admins/page.tsx`
  - [ ] Check if user is super_admin
  - [ ] Fetch admins
  - [ ] Display admins table
  - [ ] Add/Edit/Delete buttons

---

### 14.2 Admin Components

- [ ] Create `components/admins/admin-table.tsx`
- [ ] Create `components/admins/admin-form-dialog.tsx`
  - [ ] Role selector
  - [ ] Permissions multi-select

---

## ✅ Phase 15: Reusable Components (Day 20)

### 15.1 UI Components

- [ ] Create `components/ui/data-table.tsx`
  - [ ] Generic table with sorting
  - [ ] Pagination
  - [ ] Loading skeleton

- [ ] Create `components/ui/confirm-dialog.tsx`
  - [ ] Reusable confirmation dialog

- [ ] Create `components/ui/date-range-picker.tsx`
  - [ ] Date range selection

- [ ] Create `components/ui/status-badge.tsx`
  - [ ] Generic status badge with variants

---

## ✅ Phase 16: Testing & Refinement (Day 21-23)

### 16.1 Backend Integration

- [ ] Start backend server
- [ ] Test all API endpoints
- [ ] Fix any CORS issues
- [ ] Handle authentication errors
- [ ] Test token expiry handling

---

### 16.2 Error Handling

- [ ] Add try-catch blocks
- [ ] Display API errors with toast
- [ ] Add form validation errors
- [ ] Handle network errors gracefully
- [ ] Add loading states everywhere

---

### 16.3 Responsive Design

- [ ] Test on mobile devices
- [ ] Add hamburger menu for mobile sidebar
- [ ] Make tables horizontally scrollable
- [ ] Test forms on mobile
- [ ] Optimize images for mobile

---

### 16.4 Final Checks

- [ ] All CRUD operations working
- [ ] All filters working
- [ ] Pagination working
- [ ] Search working
- [ ] Authentication flow working
- [ ] Logout working
- [ ] Error messages clear and helpful
- [ ] Loading states visible
- [ ] No console errors
- [ ] Cross-browser testing

---

## 🚀 Quick Start Commands

```bash
# Terminal 1: Start Backend
cd naanly-backend
npm start

# Terminal 2: Start Admin Panel
cd naanly-admin
pnpm dev
```

**Admin Panel:** http://localhost:3000  
**Backend API:** http://localhost:5000

---

## 📝 Notes

- Work on one page at a time
- Test each feature before moving to next
- Use the API_ENDPOINTS.md reference
- Keep components small and reusable
- Follow the existing code style

---

## ✅ Completion Criteria

- [ ] All 11 pages implemented
- [ ] All CRUD operations working
- [ ] Authentication working
- [ ] Responsive design
- [ ] Error handling
- [ ] Loading states
- [ ] No critical bugs

**Estimated Time:** 3-4 weeks (part-time)

---

**Ready to start? Begin with Phase 1! 🚀**
