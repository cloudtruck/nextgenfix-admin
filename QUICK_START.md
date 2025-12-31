# 🚀 Quick Start Guide - Admin Panel Implementation

## Prerequisites Checklist

- [x] Backend is already implemented
- [x] Next.js admin panel folder exists (`naanly-admin/`)
- [x] Basic Shadcn UI components are installed
- [ ] Backend server is running
- [ ] MongoDB is running

---

## Step 1: Start Backend (5 minutes)

```bash
# Open Terminal 1
cd naanly-backend

# Install dependencies (if not done)
npm install

# Start the server
npm start
```

**Expected Output:**
```
✅ Server running on port 5000
✅ MongoDB Connected
```

**Test Backend:**
Open browser: http://localhost:5000/api/health (should return OK)

---

## Step 2: Setup Admin Panel Environment (5 minutes)

```bash
# Open Terminal 2
cd naanly-admin

# Create .env.local file
# Copy the content below into .env.local
```

**Create `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=NextGenFix Admin
```

---

## Step 3: Install Additional Dependencies (2 minutes)

```bash
# In naanly-admin directory
pnpm add @tanstack/react-query zustand react-hook-form @hookform/resolvers zod date-fns
```

**Wait for installation to complete...**

---

## Step 4: Test Admin Panel (2 minutes)

```bash
# In naanly-admin directory
pnpm dev
```

**Expected Output:**
```
✓ Ready in 2s
○ Local:        http://localhost:3000
```

**Open browser:** http://localhost:3000

---

## Step 5: Create Test Admin Account (5 minutes)

### Option A: Using Postman/Thunder Client

**Endpoint:** `POST http://localhost:5000/api/admin/auth/signup`

**Body (JSON):**
```json
{
  "name": "Super Admin",
  "email": "admin@nextgenfix.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "message": "Admin registered successfully",
  "admin": { ... },
  "token": "jwt_token_here"
}
```

### Option B: Using cURL (Command Line)

```bash
curl -X POST http://localhost:5000/api/admin/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "admin@nextgenfix.com",
    "password": "admin123"
  }'
```

### Option C: Using MongoDB Directly (if signup fails)

```javascript
// Connect to MongoDB
use naanly_db

// Insert admin manually
db.admins.insertOne({
  name: "Super Admin",
  email: "admin@nextgenfix.com",
  password: "$2a$10$abc123...", // Use bcrypt to hash "admin123"
  role: "super_admin",
  permissions: [
    "manage_users",
    "manage_menu",
    "manage_orders",
    "manage_complaints",
    "manage_settings",
    "manage_admins",
    "manage_coupons",
    "manage_combos",
    "manage_tables",
    "view_analytics",
    "send_notifications"
  ],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## Step 6: Start Development (NOW!)

### Today's Goal: Phase 1 - Foundation

**Files to create in order:**

1. **`lib/types/index.ts`** - TypeScript interfaces
2. **`lib/api/client.ts`** - Axios client setup
3. **`lib/api/auth.ts`** - Authentication API
4. **`lib/store/auth-store.ts`** - Zustand auth store
5. **`app/layout.tsx`** - Update with providers

---

## File Templates to Start With

### 1. Create `lib/types/index.ts`

```typescript
export interface Admin {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'manager' | 'support';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  profilePicture?: string;
}

export interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  tier: 'bronze' | 'silver' | 'gold';
  tierProgress: {
    monthlyOrders: number;
    monthlySpend: number;
  };
  referralCode: string;
  referredBy?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountedPrice?: number;
  image: string;
  allergens: string[];
  nutritionInfo: {
    calories: number;
  };
  preparationTime: number;
  recommendedItems: string[];
  isAvailable: boolean;
  isVegetarian: boolean;
}

export interface Order {
  _id: string;
  userId: string;
  type: 'scheduled' | 'dining';
  items: OrderItem[];
  subtotal: number;
  tierDiscount: number;
  couponDiscount: number;
  tax: number;
  deliveryCharges: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  scheduledTime?: Date;
  tableNumber?: string;
  createdAt: Date;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

// Add more interfaces as needed...
```

---

### 2. Create `lib/api/client.ts`

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### 3. Create `lib/api/auth.ts`

```typescript
import apiClient from './client';
import { Admin } from '../types';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  admin: Admin;
  token: string;
}

export const loginAdmin = async (data: LoginRequest): Promise<LoginResponse> => {
  return apiClient.post('/admin/auth/login', data);
};

export const getProfile = async (): Promise<Admin> => {
  return apiClient.get('/admin/auth/profile');
};

export const logout = async (): Promise<void> => {
  return apiClient.post('/admin/auth/logout');
};
```

---

### 4. Create `lib/store/auth-store.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin } from '../types';

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (admin: Admin, token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      
      login: (admin, token) => {
        localStorage.setItem('admin_token', token);
        set({ admin, token, isAuthenticated: true });
      },
      
      logout: () => {
        localStorage.removeItem('admin_token');
        set({ admin: null, token: null, isAuthenticated: false });
      },
      
      hasPermission: (permission) => {
        const { admin } = get();
        if (admin?.role === 'super_admin') return true;
        return admin?.permissions.includes(permission) || false;
      },
    }),
    {
      name: 'admin-auth',
    }
  )
);
```

---

## Step 7: Test Your Setup

1. **Check if files are created correctly**
2. **Run dev server:** `pnpm dev`
3. **Check for TypeScript errors**
4. **Open browser and check console**

---

## Next Steps

After completing Phase 1, proceed to:

1. **Update Login Page** - Connect to backend API
2. **Add Middleware** - Protect routes
3. **Update Sidebar** - Remove old items, add new ones
4. **Create Dashboard** - Display stats

**Follow the IMPLEMENTATION_CHECKLIST.md for detailed steps!**

---

## Common Issues & Solutions

### Issue: Backend not starting
**Solution:** Check if MongoDB is running, check port 5000 is not in use

### Issue: CORS errors
**Solution:** Backend should have CORS enabled for `http://localhost:3000`

### Issue: Admin signup fails
**Solution:** Check backend logs, ensure MongoDB connection, check admin model

### Issue: Token not persisting
**Solution:** Check localStorage in browser DevTools, verify token is saved

### Issue: TypeScript errors
**Solution:** Run `pnpm add -D @types/node` if needed

---

## Development Workflow

```bash
# Terminal 1: Backend
cd naanly-backend
npm start

# Terminal 2: Admin Panel  
cd naanly-admin
pnpm dev

# Terminal 3: For testing/commands
# Use for git, testing APIs, etc.
```

---

## Testing Tools

- **API Testing:** Postman, Thunder Client, or Bruno
- **Browser DevTools:** Network tab, Console, Application (for localStorage)
- **React DevTools:** Install extension for component debugging

---

## Resources

- **API Reference:** `naanly-admin/API_ENDPOINTS.md`
- **Implementation Plan:** `ADMIN_IMPLEMENTATION_PLAN.md`
- **Checklist:** `naanly-admin/IMPLEMENTATION_CHECKLIST.md`
- **Backend Masterplan:** `backend_masterplan.md`
- **Admin Masterplan:** `admin_masterplan.md`

---

## Success Criteria for Today

- [ ] Backend running successfully
- [ ] Admin panel dev server running
- [ ] Test admin account created
- [ ] All Phase 1 files created
- [ ] No TypeScript errors
- [ ] API client working (test with console.log)

---

## Need Help?

1. Check API_ENDPOINTS.md for correct endpoint format
2. Check browser console for errors
3. Check backend logs for API issues
4. Verify environment variables are set correctly

---

**You're all set! Start with creating the types file and work your way through the checklist. Good luck! 🚀**
