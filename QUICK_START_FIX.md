# 🎯 Quick Start - Admin Setup Guide

## ⚠️ Current Issue
```
Error: relation "admin_users" does not exist
```

✅ Solution: Run the SQL migrations in Supabase

## ⚡ 3-Step Setup (5 minutes)

### STEP 1: Copy This SQL (Admin Auth Migration)
```sql
-- First: Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the default admin user with password Admin@123
INSERT INTO admin_users (username, password_hash, email, full_name, role)
VALUES (
  'admin',
  crypt('Admin@123', gen_salt('bf')),
  'admin@goodwilltimbers.com',
  'Admin User',
  'admin'
) ON CONFLICT (username) DO NOTHING;

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create admin_logs table for audit trail
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Function to authenticate admin
CREATE OR REPLACE FUNCTION authenticate_admin(p_username TEXT, p_password TEXT)
RETURNS TABLE (
  authenticated BOOLEAN,
  admin_user_id UUID,
  username TEXT,
  email TEXT,
  full_name TEXT,
  role TEXT
) AS $$
DECLARE
  v_password_hash TEXT;
  v_admin_id UUID;
BEGIN
  SELECT password_hash, id INTO v_password_hash, v_admin_id
  FROM admin_users
  WHERE admin_users.username = p_username
    AND admin_users.is_active = true
  LIMIT 1;

  IF v_admin_id IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL, NULL, NULL, NULL;
    RETURN;
  END IF;

  IF v_password_hash = crypt(p_password, v_password_hash) THEN
    RETURN QUERY
    SELECT 
      true,
      au.id,
      au.username,
      au.email,
      au.full_name,
      au.role
    FROM admin_users au
    WHERE au.id = v_admin_id;
  ELSE
    RETURN QUERY SELECT false, NULL::UUID, NULL, NULL, NULL, NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Verify admin user was created
SELECT 'Admin user created successfully' as status, username, email FROM admin_users WHERE username = 'admin';
```

### STEP 2: Run in Supabase
1. Go: https://app.supabase.com → Your Project
2. Click: **SQL Editor** (left sidebar)
3. Click: **New Query**
4. Paste the SQL above
5. Click: **Run** (or Ctrl+Enter)
6. Wait for ✅ Success

### STEP 3: Test Admin Login
1. Refresh browser: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
2. Go to: http://localhost:5173/admin
3. Login with:
   - **Username:** `admin`
   - **Password:** `Admin@123`
4. Click: **Login to Dashboard**
5. You should see: ✅ Admin Dashboard

---

## Admin Credentials

```
👤 Username: admin
🔐 Password: Admin@123
```

---

## What's Included

✅ **Admin Authentication** - Database-based login
✅ **Product Variants** - Add multiple variants per product
✅ **Session Management** - 24-hour session expiration
✅ **Audit Trail** - Track all admin actions
✅ **Password Security** - Bcrypt hashing

---

## Product Variants Feature

When adding products, you can now:
- Add multiple **SKU codes** per product
- Select different **colors**
- Set custom **dimensions**
- Set different **prices** per variant
- Track **stock** per variant

Example:
```
Product: Teak Wood

Variant 1: TEAK-001 | Natural | 2x4x8 ft | ₹5000 | Stock: 20
Variant 2: TEAK-002 | Brown | 2x4x10 ft | ₹6000 | Stock: 15
```
5. Enter name: "Test"
6. Click: **Create**
7. Should see: ✅ Category created successfully

## 🎉 Now Try the New Features

### Test 1: Buy Now Flow
1. Go to: http://localhost:5173/products
2. Click "Buy" on any product
3. Fill form: Name, Phone, Address, Quantity
4. Click "Place Order"
5. Confirm in modal
6. See success animation ✅
7. Order in admin dashboard

### Test 2: Admin Dashboard
1. Go to: http://localhost:5173/admin/login
2. Click: **Submissions** (new menu item)
3. See: All orders, inquiries, contacts
4. See: Real-time counter with 🔔 New badge
5. Click any row to see full details
6. Click "Call" or "WhatsApp" button

### Test 3: View Orders Without Login
1. Go to: http://localhost:5173/my-orders
2. Enter phone number from order
3. Click "View My Orders"
4. See cached orders from last 2-3 days ✅

## 📊 New Admin Features

```
Dashboard
├── Submissions ← NEW
│   ├── All orders in real-time
│   ├── Filter by type (Orders, Inquiries, Contacts)
│   ├── Filter by status (New, Viewed, Contacted, Completed)
│   ├── Auto-refresh every 3 seconds
│   ├── Click to view details
│   ├── Call/WhatsApp buttons
│   └── Mark as complete
```

## 🚀 New User Features

```
Product Page
├── Buy Now button
│   ├── Form with name, phone, address, quantity
│   ├── Confirmation modal
│   ├── Success animation
│   └── Order saved to cache

My Orders Page
├── View without login
├── Enter phone number
├── See 2-3 days of orders
└── Quick actions
```

## ✅ Verification

After fix, test these:

| Feature | Test | Expected |
|---------|------|----------|
| Add Category | Admin → Categories → Add | ✅ Works |
| Edit Category | Click edit button | ✅ Works |
| Delete Category | Click delete button | ✅ Works |
| Add Product | Admin → Products → Add | ✅ Works |
| Buy Product | Click Buy → Fill form | ✅ Works |
| View Orders | Admin → Submissions | ✅ Real-time |
| My Orders | /my-orders + phone | ✅ Shows cache |

## 🆘 If Still Failing

Run diagnostic:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('categories', 'products', 'contact_submissions');
```

All should show `t` (true) for rowsecurity.

If any shows `f` (false), run:
```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
```

Then retry fix above.

## 📚 Documentation Files

- `QUICK_RLS_FIX.md` - Detailed SQL fix guide
- `DATABASE_RLS_FIX.md` - Database troubleshooting
- `SYSTEM_UPDATE_SUMMARY.md` - What's new overview

---

**That's it! You're ready to go.** 🎉

If any issues, check the documentation files or run the diagnostics above.
