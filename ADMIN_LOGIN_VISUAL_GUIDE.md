# Admin Login - Step by Step Visual Guide 📸

## Screen 1: Start Your Dev Server

### What You'll See in Terminal:
```
> vite

  VITE v7.3.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

**Remember your port number:** `5173`

---

## Screen 2: Navigate to Admin Login

### In Your Browser:
1. **Type this URL in address bar:**
   ```
   http://localhost:5173/admin/login
   ```

2. **Press Enter**

3. **You'll see the login page:**
   ```
   ┌─────────────────────────────────┐
   │                                 │
   │      Admin Panel              │
   │                                 │
   │  Admin Password *               │
   │  ┌─────────────────────────────┐ │
   │  │ [password input field]      │ │
   │  └─────────────────────────────┘ │
   │                                 │
   │  ┌──────────────────────────────┐│
   │  │        Login                 ││
   │  └──────────────────────────────┘│
   │                                 │
   │  For production, use stronger   │
   │  authentication methods         │
   │                                 │
   └─────────────────────────────────┘
   ```

---

## Screen 3: Enter Your Password

### Your Password Location:
**Check your `.env.local` file:**

```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
VITE_TELEGRAM_BOT_TOKEN=...
VITE_TELEGRAM_CHAT_ID=...
VITE_ADMIN_PASSWORD=your_password_here  ← THIS ONE
```

### In the Login Form:
1. **Click the password field**
2. **Type your password** (you set this)
3. **Default if not set:** `admin123`

```
Password Field:
┌─────────────────────────────────┐
│ ••••••••••••••••••••••••••••••• │  ← Shows dots
└─────────────────────────────────┘
```

---

## Screen 4: Click Login Button

### The Button:
```
┌──────────────────────────────────┐
│         Login                    │
└──────────────────────────────────┘
```

**Click it!**

---

## Screen 5A: Success! 🎉

### If Password is Correct:
```
Toast Notification (top right):
┌────────────────────────────┐
│ ✓ Login successful!        │
└────────────────────────────┘
```

**You'll be redirected to:**
```
http://localhost:5173/admin
```

### You'll See the Dashboard:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Timber Admin                                   │
│  ├─ Dashboard  ← You are here                   │
│  ├─ Products                                    │
│  ├─ Categories                                  │
│  └─ Orders & Inquiries                          │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│                 Dashboard                      │
│                                                 │
│  Total Categories    Total Products             │
│      3                  12                       │
│                                                 │
│  Total Orders        Total Inquiries            │
│      5                  8                        │
│                                                 │
│  Products per Category Chart                    │
│                                                 │
│  Recent Submissions                             │
│  ├─ John Doe - john@email.com                   │
│  ├─ Jane Smith - jane@email.com                 │
│  └─ More...                                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Screen 5B: Wrong Password ❌

### If Password is Wrong:
```
Toast Notification (top right):
┌────────────────────────────┐
│ ✗ Invalid password         │
└────────────────────────────┘
```

**You'll stay on login page**

### Try Again:
1. Check your `.env.local` file again
2. Make sure you typed it correctly
3. Password is case-sensitive!
4. Try again

---

## Screen 6: Admin Navigation

### Once Logged In, You See This Menu:

```
LEFT SIDEBAR
┌──────────────────────────┐
│                          │
│  Timber Admin            │
│  (Logo/Title)            │
│                          │
│  Dashboard              │  ← View stats
│  Products               │  ← Manage products  
│  Categories             │  ← Manage categories
│  Orders & Inquiries     │  ← View submissions
│                          │
│  [Back to Site] button   │  ← Logout/Exit
│                          │
└──────────────────────────┘
```

### Click Each Section to Navigate

---

## Screen 7: Dashboard (First Page)

### What You'll See:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              Dashboard                          │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ Categories  │  │  Products   │             │
│  │      3      │  │     12      │             │
│  └─────────────┘  └─────────────┘             │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐             │
│  │   Orders    │  │ Inquiries   │             │
│  │      5      │  │      8      │             │
│  └─────────────┘  └─────────────┘             │
│                                                 │
│  Products per Category (Chart)                 │
│  ┌──────────────────────────────────────────┐  │
│  │ ██                                       │  │
│  │ ██ ███                                   │  │
│  │ ██ ███ ████ ██                           │  │
│  │ ██ ███ ████ ██ ██ ████                   │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  Recent Submissions                            │
│  ┌──────────────────────────────────────────┐  │
│  │ John Doe (john@email.com)      Order     │  │
│  │                              Feb 4, 2026  │  │
│  │                                          │  │
│  │ Jane Smith (jane@email.com)   Inquiry    │  │
│  │                              Feb 3, 2026  │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Screen 8: Products Section

### Products Page:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Products                      [+ Add Product]  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Product Name   | Category | Price | Actions
│  ├──────────────────────────────────────────┤  │
│  │ Teak Wood      | Timber   | 5000  | ✎ 🗑   │
│  │ Plywood 18mm   | Plywood  | 3500  | ✎ 🗑   │
│  │ Panel Door     | Doors    | 8000  | ✎ 🗑   │
│  │ Door Handles   | Hardware | 2500  | ✎ 🗑   │
│  │ More...        | ...      | ...   | ...   │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  [✎ Edit button] [🗑 Delete button]            │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Click [+ Add Product] to create new products!**

---

## Screen 9: Categories Section

### Categories Page:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Categories                   [+ Add Category]  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ [Image]  Timber                    [✎][🗑] │
│  │          Premium hardwood               │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ [Image]  Plywood                   [✎][🗑] │
│  │          Marine & Commercial Ply        │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ [Image]  Doors                     [✎][🗑] │
│  │          Wooden & Designer Doors        │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  [✎ Edit] [🗑 Delete] for each category       │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Click [+ Add Category] to create new categories!**

---

## Screen 10: Orders Section

### Orders & Inquiries Page:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Orders & Inquiries                             │
│  Total: 13                                      │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Name        | Email      | Phone | Type  │  │
│  ├──────────────────────────────────────────┤  │
│  │ John Doe    | john@...   | 98765 | 🛒   │  │
│  │ Jane Smith  | jane@...   | 98764 | 📧   │  │
│  │ Mike Brown  | mike@...   | 98763 | 🛒   │  │
│  │ More...     | ...        | ...   | ...  │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  [👁 View] [🗑 Delete]  for each submission   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Click [👁 View] to see full details!**

---

## Complete Flow Summary

```
1. Browser → http://localhost:5173/admin/login
   ↓
2. Enter Password (from .env.local)
   ↓
3. Click Login Button
   ↓
4. Success → Redirected to /admin
   ↓
5. See Dashboard
   ↓
6. Click Products / Categories / Orders
   ↓
7. Add, Edit, or Delete items
   ↓
8. Changes appear on frontend immediately! ✨
```

---

## Quick Reference

### URLs You'll Use:
```
Login Page:        http://localhost:5173/admin/login
Dashboard:         http://localhost:5173/admin
Products:          http://localhost:5173/admin/products
Categories:        http://localhost:5173/admin/categories
Orders:            http://localhost:5173/admin/submissions
Back to Site:      http://localhost:5173/
```

### Default Credentials:
```
If no .env.local:  admin123
If .env.local set: Check VITE_ADMIN_PASSWORD
```

### First Time:
```
1. Login with default or your password
2. Go to Categories → Add 3-4 categories
3. Go to Products → Add 5-10 products
4. Check homepage → See updates! 🎉
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Login page not loading | Check port (should be 5173) |
| Invalid password error | Check `.env.local` file |
| No products showing | Create products in admin panel |
| Changes not appearing | Reload page (F5) |
| Can't access `/admin` | Must login first |
| Logged out randomly | Check browser localStorage settings |

---

**You're all set!** 🚀

Now go to `http://localhost:5173/admin/login` and start managing your products!
