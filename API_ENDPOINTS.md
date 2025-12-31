# API Endpoints Reference
**Backend API Endpoints for Admin Panel Integration**

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication

### Admin Auth
- `POST /admin/auth/signup` - Register new admin
  ```json
  {
    "name": "John Doe",
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
  
- `POST /admin/auth/login` - Admin login
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
  Response:
  ```json
  {
    "message": "Login successful",
    "admin": { ... },
    "token": "jwt_token_here"
  }
  ```

- `POST /admin/auth/logout` - Admin logout (protected)
- `GET /admin/auth/profile` - Get admin profile (protected)
- `POST /admin/auth/change-password` - Change password (protected)

**Note:** Add `Authorization: Bearer {token}` header to all protected routes

---

## 📊 Dashboard

### Dashboard Stats
- `GET /admin/dashboard/revenue` - Revenue statistics
- `GET /admin/dashboard/orders` - Order statistics
- `GET /admin/dashboard/users` - User statistics

---

## 👥 Users Management

- `GET /admin/users` - Get all users
  - Query params: `?page=1&limit=10&search=&tier=`
  
- `GET /admin/users/:id` - Get user by ID

- `PUT /admin/users/:id` - Update user
  ```json
  {
    "name": "Updated Name",
    "tier": "gold"
  }
  ```

- `DELETE /admin/users/:id` - Delete user

---

## 🛒 Orders Management

- `GET /orders` - Get all orders (with admin token)
  - Query params: `?status=&type=&page=1&limit=10`
  - Types: `scheduled`, `dining`
  - Status: `pending`, `confirmed`, `preparing`, `ready`, `completed`, `cancelled`

- `GET /orders/:id` - Get order details

- `PUT /orders/:id/status` - Update order status
  ```json
  {
    "status": "confirmed"
  }
  ```

---

## 🍔 Menu Items

- `GET /menu-items` - Get all menu items
  - Query params: `?category=&isAvailable=&isVegetarian=`

- `GET /menu-items/:id` - Get menu item by ID

- `POST /menu-items` - Create menu item (admin only)
  ```json
  {
    "name": "Burger",
    "description": "Delicious burger",
    "category": "category_id",
    "price": 150,
    "discountedPrice": 120,
    "image": "https://image-url.com/burger.jpg",
    "allergens": ["Gluten", "Dairy"],
    "nutritionInfo": {
      "calories": 450
    },
    "preparationTime": 15,
    "recommendedItems": ["item_id_1", "item_id_2"],
    "isAvailable": true,
    "isVegetarian": false
  }
  ```

- `PUT /menu-items/:id` - Update menu item

- `DELETE /menu-items/:id` - Delete menu item

---

## 📁 Categories

- `GET /categories` - Get all categories

- `POST /categories` - Create category
  ```json
  {
    "name": "Main Course",
    "description": "Main course items",
    "image": "https://image-url.com/category.jpg"
  }
  ```

- `PUT /categories/:id` - Update category

- `DELETE /categories/:id` - Delete category

---

## 🎁 Combo Offers

- `GET /combos` - Get all combos (active only for users, all for admin)

- `GET /combos/:id` - Get combo by ID

- `POST /combos` - Create combo (admin only)
  ```json
  {
    "name": "Family Combo",
    "description": "Perfect for family",
    "price": 500,
    "items": ["item_id_1", "item_id_2"],
    "image": "https://image-url.com/combo.jpg",
    "validFrom": "2025-01-01",
    "validUntil": "2025-12-31",
    "isActive": true
  }
  ```

- `PUT /combos/:id` - Update combo

- `DELETE /combos/:id` - Delete combo

- `PUT /combos/:id/toggle` - Toggle active status

---

## 🎟️ Coupons

- `GET /coupons` - Get all coupons (admin)

- `POST /coupons` - Create coupon
  ```json
  {
    "code": "SAVE20",
    "discountType": "percentage",
    "discountValue": 20,
    "minOrderValue": 200,
    "maxDiscount": 100,
    "usageLimit": 100,
    "usageLimitPerUser": 1,
    "validFrom": "2025-01-01",
    "validUntil": "2025-12-31",
    "applicableTiers": ["bronze", "silver", "gold"],
    "isActive": true
  }
  ```

- `PUT /coupons/:id` - Update coupon

- `DELETE /coupons/:id` - Delete coupon

- `PUT /coupons/:id/toggle` - Toggle active status

---

## 💬 Complaints

- `GET /complaints/all` - Get all complaints (admin)
  - Query params: `?status=&category=&priority=`

- `GET /complaints/:id` - Get complaint details

- `PUT /complaints/:id/status` - Update complaint status
  ```json
  {
    "status": "in_progress"
  }
  ```

- `PUT /complaints/:id/respond` - Respond to complaint
  ```json
  {
    "response": "We're looking into this issue"
  }
  ```

- `GET /complaints/stats` - Get complaint statistics

---

## 🪑 Tables

### Table Management
- `GET /tables` - Get all tables
  - Query params: `?location=&capacity=`

- `GET /tables/:id` - Get table by ID

- `POST /tables` - Create table (admin)
  ```json
  {
    "tableNumber": "T1",
    "capacity": 4,
    "location": "Indoor",
    "features": ["Window View", "AC"],
    "isAvailableForReservation": true
  }
  ```

- `PUT /tables/:id` - Update table

- `DELETE /tables/:id` - Delete table

- `POST /tables/bulk` - Bulk create tables
  ```json
  {
    "prefix": "T",
    "startNumber": 1,
    "endNumber": 20,
    "capacity": 4,
    "location": "Indoor"
  }
  ```

### Reservations
- `GET /tables/reservations/all` - Get all reservations (admin)

- `PUT /tables/reservations/:id` - Update reservation status
  ```json
  {
    "status": "confirmed"
  }
  ```

---

## ⚙️ Settings

- `GET /settings` - Get all settings (admin)

- `GET /settings/public` - Get public settings

- `PUT /settings/business-hours` - Update business hours
  ```json
  {
    "dineIn": {
      "monday": { "open": "09:00", "close": "22:00", "isClosed": false },
      ...
    },
    "delivery": {
      "monday": { "open": "10:00", "close": "23:00", "isClosed": false },
      ...
    }
  }
  ```

- `PUT /settings/delivery` - Update delivery config
  ```json
  {
    "type": "distance_based",
    "flatRate": 50,
    "baseCharge": 20,
    "perKmCharge": 10,
    "freeDeliveryAbove": 500,
    "maxDistance": 10
  }
  ```

- `PUT /settings/tiers` - Update tier config
  ```json
  {
    "bronze": { "ordersRequired": 0, "discountPercent": 2 },
    "silver": { "ordersRequired": 10, "discountPercent": 5 },
    "gold": { "ordersRequired": 25, "discountPercent": 10 }
  }
  ```

- `PUT /settings/referral` - Update referral config
  ```json
  {
    "referrerDiscount": 10,
    "referredDiscount": 15,
    "maxUses": 5
  }
  ```

- `PUT /settings/tax` - Update tax config
  ```json
  {
    "taxType": "percentage",
    "taxRate": 5,
    "cgst": 2.5,
    "sgst": 2.5,
    "includeInPrice": false
  }
  ```

- `PUT /settings/scheduling` - Update scheduling config
  ```json
  {
    "maxAdvanceDays": 30,
    "minAdvanceHours": 2,
    "slotDuration": 30,
    "customSlots": ["09:00", "12:00", "15:00", "18:00", "21:00"]
  }
  ```

---

## 👨‍💼 Admin Users Management

**Note:** These endpoints may need to be created/verified in backend

- `GET /admin/admins` - Get all admins (super_admin only)

- `POST /admin/admins` - Create admin (super_admin only)
  ```json
  {
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "password123",
    "role": "manager",
    "permissions": ["manage_users", "manage_orders"]
  }
  ```

- `PUT /admin/admins/:id` - Update admin

- `DELETE /admin/admins/:id` - Delete admin

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (in development)"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 🔒 Authentication Headers

All protected routes require:
```
Authorization: Bearer {jwt_token}
```

---

## 📋 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🧪 Testing with Postman/Thunder Client

1. First, login to get token:
   ```
   POST http://localhost:5000/api/admin/auth/login
   Body: { "email": "...", "password": "..." }
   ```

2. Copy the token from response

3. Add to subsequent requests:
   ```
   Headers: 
   Authorization: Bearer {your_token_here}
   ```

---

## 🚀 Quick Start

```javascript
// Example API call with axios
const response = await axios.get('/admin/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  params: {
    page: 1,
    limit: 10,
    search: 'john'
  }
});
```
