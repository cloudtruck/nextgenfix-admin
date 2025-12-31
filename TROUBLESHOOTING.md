# Troubleshooting Guide - Admin Panel

## 🔧 Common Issues and Solutions

---

## 1. Backend Connection Issues

### Issue: Cannot connect to backend API
**Symptoms:**
- Network errors in browser console
- "Failed to fetch" errors
- 404 errors on API calls

**Solutions:**

✅ **Check if backend is running**
```bash
# In naanly-backend directory
npm start

# You should see:
# ✅ Server running on port 5000
# ✅ MongoDB Connected
```

✅ **Verify API URL in .env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NOT http://localhost:5000 (missing /api)
```

✅ **Check CORS settings in backend**
```javascript
// In backend app.js or server.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

✅ **Test backend endpoint directly**
```bash
# Open browser or use curl
curl http://localhost:5000/api/health
# Should return: {"status": "OK"}
```

---

## 2. Authentication Issues

### Issue: Login fails even with correct credentials
**Symptoms:**
- 401 Unauthorized error
- "Invalid credentials" message
- Login button doesn't work

**Solutions:**

✅ **Check if admin exists in database**
```bash
# In MongoDB shell
use naanly_db
db.admins.find({email: "admin@example.com"})
```

✅ **Create test admin if missing**
```bash
# Using Postman/Thunder Client
POST http://localhost:5000/api/admin/auth/signup
Body:
{
  "name": "Test Admin",
  "email": "admin@example.com",
  "password": "admin123"
}
```

✅ **Check password hashing**
```javascript
// In backend adminController.js
// Ensure bcrypt is used for password comparison
const isMatch = await bcrypt.compare(password, admin.password);
```

✅ **Verify JWT token generation**
```javascript
// In backend services/auth.js
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { id: admin._id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

---

### Issue: Token not persisting after login
**Symptoms:**
- Logged out after page refresh
- Need to login again after closing browser
- Token not found in localStorage

**Solutions:**

✅ **Check localStorage in browser DevTools**
```javascript
// In browser console
localStorage.getItem('adminToken')
// Should return the JWT token
```

✅ **Verify auth store is persisting**
```typescript
// In lib/store/auth-store.ts
persist(
  (set, get) => ({...}),
  {
    name: 'admin-auth', // Must be set
  }
)
```

✅ **Check if login function stores token**
```typescript
login: (admin, token) => {
  localStorage.setItem('admin_token', token); // This line
  set({ admin, token, isAuthenticated: true });
}
```

---

### Issue: Redirected to login on every page
**Symptoms:**
- Can't access dashboard after login
- Constantly redirected to /login
- Middleware blocking access

**Solutions:**

✅ **Check middleware configuration**
```typescript
// In middleware.ts
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

✅ **Verify token is sent in API requests**
```typescript
// In lib/api/client.ts
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

---

## 3. API Request Issues

### Issue: 401 Unauthorized on protected routes
**Symptoms:**
- API calls return 401 error
- Token exists but still unauthorized
- Works on login but not on other pages

**Solutions:**

✅ **Verify Authorization header format**
```javascript
// Should be:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// NOT:
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (missing "Bearer ")
```

✅ **Check backend middleware**
```javascript
// In middlewares/authMiddleware.js or adminAuth.js
const token = req.headers.authorization?.split(' ')[1]; // Get token after "Bearer "
if (!token) {
  return res.status(401).json({ message: 'No token provided' });
}
```

✅ **Verify JWT secret matches**
```env
# In backend .env
JWT_SECRET=your_secret_key_here

# Same secret must be used for signing and verifying
```

---

### Issue: 403 Forbidden - Permission denied
**Symptoms:**
- Can access some pages but not others
- "You do not have permission" error
- Works for super_admin but not for other roles

**Solutions:**

✅ **Check admin role and permissions**
```typescript
// In auth store
hasPermission: (permission) => {
  const { admin } = get();
  if (admin?.role === 'super_admin') return true; // Super admin has all permissions
  return admin?.permissions.includes(permission) || false;
}
```

✅ **Verify backend permission check**
```javascript
// In backend middleware
const admin = await Admin.findById(req.admin.id);
if (!admin.permissions.includes(requiredPermission)) {
  return res.status(403).json({ message: 'Permission denied' });
}
```

---

## 4. TypeScript Errors

### Issue: Type errors in components
**Symptoms:**
- Red squiggly lines in VSCode
- Build fails with type errors
- "Type 'X' is not assignable to type 'Y'"

**Solutions:**

✅ **Install missing type definitions**
```bash
pnpm add -D @types/node @types/react @types/react-dom
```

✅ **Define proper interfaces**
```typescript
// In lib/types/index.ts
export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  // ... all required fields
}
```

✅ **Use type assertions when needed**
```typescript
const menuItem = data as MenuItem;
// or
const menuItem: MenuItem = data;
```

---

### Issue: "Cannot find module" errors
**Symptoms:**
- Import statements show errors
- Module not found at runtime
- Red squiggly on imports

**Solutions:**

✅ **Check tsconfig.json paths**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

✅ **Verify file exists and path is correct**
```typescript
// Check actual file path
// If file is at: lib/api/auth.ts
// Import should be:
import { loginAdmin } from '@/lib/api/auth';
// NOT:
import { loginAdmin } from '@/lib/auth'; // Wrong!
```

---

## 5. UI Component Issues

### Issue: Shadcn components not working
**Symptoms:**
- Components not rendering
- Styling not applied
- "Component is not defined"

**Solutions:**

✅ **Install missing Shadcn components**
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
# etc.
```

✅ **Check components.json**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css"
  }
}
```

✅ **Verify Tailwind is configured**
```javascript
// In tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  // ... rest of config
}
```

---

### Issue: Styles not applying
**Symptoms:**
- Components look unstyled
- Tailwind classes not working
- Dark mode not working

**Solutions:**

✅ **Check globals.css is imported**
```typescript
// In app/layout.tsx
import './globals.css';
```

✅ **Verify Tailwind directives**
```css
/* In app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

✅ **Rebuild and clear cache**
```bash
# Stop dev server (Ctrl+C)
# Delete .next folder
rm -rf .next
# Restart
pnpm dev
```

---

## 6. Data Fetching Issues

### Issue: React Query not working
**Symptoms:**
- Data not loading
- "useQuery is not defined"
- Infinite loading state

**Solutions:**

✅ **Verify QueryClientProvider is setup**
```typescript
// In app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

✅ **Check query syntax**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['users'], // Must be an array
  queryFn: getUsers,   // Function that returns a promise
});
```

✅ **Handle loading and error states**
```typescript
if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
return <div>{data}</div>;
```

---

### Issue: Data not updating after mutation
**Symptoms:**
- Create/Update/Delete doesn't reflect immediately
- Need to refresh page to see changes
- Stale data shown

**Solutions:**

✅ **Use React Query mutations**
```typescript
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

✅ **Invalidate queries after mutation**
```typescript
// After successful API call
queryClient.invalidateQueries({ queryKey: ['users'] });
// This will refetch the users list
```

---

## 7. Form Issues

### Issue: React Hook Form not working
**Symptoms:**
- Form not submitting
- Validation not working
- Form data not captured

**Solutions:**

✅ **Setup form correctly**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

const form = useForm({
  resolver: zodResolver(schema),
});

const onSubmit = form.handleSubmit(async (data) => {
  // Handle form submission
});
```

✅ **Register form fields**
```typescript
<input {...form.register('name')} />
```

✅ **Display validation errors**
```typescript
{form.formState.errors.name && (
  <p className="text-red-500">{form.formState.errors.name.message}</p>
)}
```

---

## 8. Build & Deployment Issues

### Issue: Build fails
**Symptoms:**
- `pnpm build` shows errors
- TypeScript errors during build
- ESLint errors

**Solutions:**

✅ **Fix TypeScript errors first**
```bash
# Check for type errors
pnpm tsc --noEmit
```

✅ **Fix ESLint errors**
```bash
# Check for linting errors
pnpm lint
```

✅ **Temporarily disable strict checks (not recommended)**
```json
// In next.config.ts
module.exports = {
  typescript: {
    ignoreBuildErrors: true, // Only for development
  },
  eslint: {
    ignoreDuringBuilds: true, // Only for development
  },
};
```

---

## 9. Environment Variable Issues

### Issue: Environment variables not working
**Symptoms:**
- `process.env.NEXT_PUBLIC_API_URL` is undefined
- API calls go to wrong URL
- Variables work locally but not in build

**Solutions:**

✅ **Prefix with NEXT_PUBLIC_**
```env
# Must start with NEXT_PUBLIC_ to be accessible in browser
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

✅ **Restart dev server after changing .env**
```bash
# Stop server (Ctrl+C)
# Start again
pnpm dev
```

✅ **Check .env.local is in .gitignore**
```
# .gitignore
.env.local
.env*.local
```

---

## 10. Performance Issues

### Issue: Slow page load
**Symptoms:**
- Pages take long to load
- API calls are slow
- UI freezes

**Solutions:**

✅ **Use React Query caching**
```typescript
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});
```

✅ **Add loading skeletons**
```typescript
{isLoading ? (
  <Skeleton className="h-12 w-full" />
) : (
  <UserTable data={data} />
)}
```

✅ **Paginate large datasets**
```typescript
// Backend
const users = await User.find()
  .limit(limit)
  .skip((page - 1) * limit);

// Frontend
const [page, setPage] = useState(1);
const { data } = useQuery({
  queryKey: ['users', page],
  queryFn: () => getUsers({ page }),
});
```

---

## 🆘 Emergency Debugging Checklist

When nothing works, try this in order:

1. [ ] Check browser console for errors
2. [ ] Check Network tab for failed requests
3. [ ] Check if backend is running
4. [ ] Check if MongoDB is connected
5. [ ] Check .env.local file exists and is correct
6. [ ] Clear localStorage: `localStorage.clear()`
7. [ ] Delete .next folder and rebuild
8. [ ] Restart both backend and frontend servers
9. [ ] Check for typos in API endpoints
10. [ ] Verify token is being sent in headers

---

## 📞 Getting More Help

### Check These Resources First:
1. **API_ENDPOINTS.md** - Verify endpoint format
2. **IMPLEMENTATION_CHECKLIST.md** - Follow step-by-step
3. **QUICK_START.md** - Setup instructions
4. **Backend logs** - Check terminal output
5. **Browser DevTools** - Network & Console tabs

### Debugging Tools:
- **React DevTools** - Inspect components
- **Redux DevTools** - Check Zustand store
- **Network Tab** - See API calls
- **Console** - Check for errors
- **Application Tab** - Check localStorage

---

## 🎯 Best Practices to Avoid Issues

1. **Always use try-catch** for API calls
2. **Add loading states** to all async operations
3. **Display error messages** with toast
4. **Validate forms** before submission
5. **Log errors** during development
6. **Test on different browsers**
7. **Commit frequently** to track changes
8. **Use TypeScript** for type safety
9. **Follow the checklist** step-by-step
10. **Test each feature** before moving to next

---

**Still stuck? Go back to basics:**
1. Does the backend endpoint work? (Test with Postman)
2. Is the frontend calling the correct URL?
3. Is authentication working? (Check token)
4. Are there any console errors?
5. Follow the error message carefully!

---

**Remember: Most issues are simple fixes! Check the basics first! 🔍**
