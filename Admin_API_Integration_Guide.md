# Naanly Admin Dashboard API Integration Guide

This guide provides a comprehensive overview of all backend APIs available for the Naanly Admin Dashboard. Use these endpoints to power the Users, Chefs, Orders, Menu Items, Complaints, and other admin tabs.

---

## Authentication

- **Admin Signup**

  - `POST /admin/auth/signup`
  - **Body:** `{ name, email, password }`
  - **Response:** `{ message, user }`
  - Use this endpoint to create a new admin account. No authentication required for signup.

- **Admin Login**
  - `POST /admin/auth/login`
  - **Body:** `{ email, password }`
  - **Response:** `{ token, user }`
  - Use the returned JWT token as `Authorization: Bearer <token>` in all subsequent requests.

- **Admin Logout**
  - `POST /admin/auth/logout`
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** `{ message }`
  - For JWT-based auth, this simply tells the client to delete the token. No server-side session is kept.

---

## Dashboard
  - **Admin Dashboard Overview Metrics**
    - `GET /api/admin/overview`
    - **Headers:** `Authorization: Bearer <token>`
    - **Response:** `{ users, chefs, orders, pendingChefVerifications, pendingReviews, complaints }`
    - Returns counts for users, chefs, orders, pending chef verifications, pending reviews, and complaints for dashboard summary cards.

- **Admin Dashboard Stats (Chart & Summary Data)**
  - `GET /api/admin/stats`
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:**
    - `totals: { users, chefs, orders, issues }`
    - `trends: { months: ["YYYY-MM"...], users: [...], chefs: [...], orders: [...], issues: [...] }`
  - Returns total counts and monthly trends for users, chefs, orders, and issues for dashboard graphs and summary cards.
  
  - **Admin Dashboard Recent Orders**
    - `GET /api/admin/recent-orders`
    - **Headers:** `Authorization: Bearer <token>`
    - **Response:** `[{ orderId, user, chef, items, total, status, createdAt, ... }]`
    - Returns the last 10 orders for the dashboard recent orders widget.

  - **Admin Dashboard Pending Chef Verifications**
    - `GET /api/admin/chef-verifications`
    - **Headers:** `Authorization: Bearer <token>`
    - **Response:** `{ chefs: [...], total }`
    - Returns a paginated list of chefs pending verification for the dashboard widget.

  - **Admin Dashboard Reviews Pending Moderation**
    - `GET /api/admin/reviews-pending`
    - **Headers:** `Authorization: Bearer <token>`
    - **Response:** `{ reviews: [...], total }`
    - Returns a paginated list of reviews pending moderation for the dashboard widget.

  **Note:** All endpoints require a valid admin JWT token in the `Authorization` header.


## Users Management

- **List Users**
  - `GET /admin/users?search=&status=&preference=&page=1&limit=10`
  - **Query:** `search`, `status`, `preference`, `page`, `limit`
  - **Response:** `{ users: [...], total }`

- **Get User Details**
  - `GET /admin/users/:userId`

- **Update User**
  - `PUT /admin/users/:userId`
  - **Body:** `{ status, preferences, ... }`

- **Add User**
  - `POST /admin/users`
  - **Body:** `{ name, email, phone, password, preferences, status }`

- **Export Users**
  - `GET /admin/users-export`
  - **Response:** CSV file

---

## Chefs Management

- **List All Chefs**
  - `GET /admin/chefs?search=&status=&page=1&limit=10`

- **List Verified Chefs**
  - `GET /admin/chefs-verified?search=&page=1&limit=10`

- **List Pending Verification Chefs**
  - `GET /admin/chefs-pending?search=&page=1&limit=10`

- **Get Chef Details**
  - `GET /admin/chefs/:chefId`

- **Update Chef**
  - `PUT /admin/chefs/:chefId`
  - **Body:** `{ status, ... }`

- **Add Chef**
  - `POST /admin/chefs`
  - **Body:** `{ name, email, kitchenName, status }`

- **Export Chefs**
  - `GET /admin/chefs-export`
  - **Response:** CSV file

---

## Chef Verification Requests

- **List Verification Requests**
  - `GET /admin/chef-verifications`

- **Approve Verification**
  - `PUT /admin/chef-verifications/:chefId/approve`

- **Reject Verification**
  - `PUT /admin/chef-verifications/:chefId/reject`

---

## Orders Management

- **List Orders**
  - `GET /admin/orders?search=&status=&paymentStatus=&page=1&limit=10`

- **Get Order Details**
  - `GET /admin/orders/:orderId`

- **Update Order Status**
  - `PUT /admin/orders/:orderId`
  - **Body:** `{ status, paymentStatus }`

- **Export Orders**
  - `GET /admin/orders-export`
  - **Response:** CSV file

---

## Menu Items Management

- **List Menu Items**
  - `GET /admin/menu-items?search=&status=&category=&page=1&limit=10`

- **Get Menu Item Details**
  - `GET /admin/menu-items/:menuItemId`

- **Update Menu Item**
  - `PUT /admin/menu-items/:menuItemId`
  - **Body:** `{ ...fields }`

- **Add Menu Item**
  - `POST /admin/menu-items`
  - **Body:** `{ itemId, name, category, price, status, spicyLevel, rating }`

- **Export Menu Items**
  - `GET /admin/menu-items-export`
  - **Response:** CSV file

---

## Complaints Management

- **List Complaints**
  - `GET /admin/complaints?search=&status=&priority=&category=&page=1&limit=10`

- **Get Complaint Details**
  - `GET /admin/complaints/:complaintId`

- **Update Complaint**
  - `PUT /admin/complaints/:complaintId`
  - **Body:** `{ status, priority, ... }`

- **Add Complaint**
  - `POST /admin/complaints`
  - **Body:** `{ complaintId, user, subject, category, status, priority, description }`

- **Export Complaints**
  - `GET /admin/complaints-export`
  - **Response:** CSV file

---

## General Notes

- All endpoints require admin authentication (JWT Bearer token).
- Use pagination (`page`, `limit`) for all list endpoints.
- Use `search` and filter parameters for searching/filtering.
- For CSV export endpoints, the response is a downloadable file.
- All update and add endpoints expect JSON bodies.

---

For any questions or issues, contact the backend team.
