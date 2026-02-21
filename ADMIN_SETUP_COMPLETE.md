# ✅ Admin Setup - Complete Solution

## Problem
```
Error: relation "admin_users" does not exist
```

## Solution: 3 Easy Steps

---

## 📋 STEP 1: Run SQL in Supabase (2 minutes)

### Go to Supabase
1. Visit: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**

### Copy & Run This SQL:

```sql
-- Create admin_users table
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

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create default admin user
INSERT INTO admin_users (username, password_hash, email, full_name, role)
VALUES (
  'admin',
  crypt('Admin@123', gen_salt('bf')),
  'admin@goodwilltimbers.com',
  'Admin User',
  'admin'
) ON CONFLICT (username) DO NOTHING;

-- Create sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create logs table
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

-- Authentication function
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

-- Verify admin created
SELECT 'Setup Complete!' as status, username, email FROM admin_users WHERE username = 'admin';
```

### Click **RUN** Button
Wait for ✅ "Success"

---

## 🌐 STEP 2: Refresh Browser (30 seconds)

Press: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

This clears the cache completely.

---

## 🔐 STEP 3: Login to Admin (1 minute)

### Go to Admin Login
Navigate to: `http://localhost:5173/admin`

### Enter Credentials
```
Username: admin
Password: Admin@123
```

### Click "Login to Dashboard"

---

## ✅ Success!

You should now see the Admin Dashboard with:
- ✅ Products section
- ✅ Add Product button
- ✅ All features available

---

## 🎯 Admin Credentials

Save these securely:

```
Username: admin
Password: Admin@123
```

⚠️ **Change these in production!**

---

## 🚀 Next Steps

1. ✅ Login to admin dashboard
2. ✅ Try adding a product with variants
3. ✅ Change admin password (recommended)
4. ✅ Add more admin users if needed

---

## 📚 Documentation Files

- **QUICK_START_FIX.md** - Setup instructions
- **ADMIN_CREDENTIALS.md** - Login guide & usage
- **ADMIN_AUTH_SETUP.md** - Technical details
- **ADMIN_LOGIN_VISUAL_GUIDE.md** - Visual walkthrough

---

## ❓ Troubleshooting

### Still getting "relation admin_users does not exist"?

1. ✅ Did SQL run without errors? (check for red ❌)
2. ✅ Did you refresh browser? (Ctrl+Shift+R)
3. ✅ Go to Table Editor and verify `admin_users` table exists

### Admin user not found?

Run this to check:
```sql
SELECT * FROM admin_users;
```

If empty, run the INSERT statement again.

### Other errors?

Check browser console (F12 → Console tab) for error details.

---

## 💡 Tips

- 👁️ Click eye icon to show/hide password while typing
- 📱 Works on desktop, tablet, and mobile
- 🔒 Password is hashed with bcrypt for security
- ⏱️ Session expires after 24 hours
- 📊 All admin actions are logged

---

**Status:** ✅ Ready to Use!
**Date:** February 22, 2026
