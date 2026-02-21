# 🔧 Fix Admin Login - "Invalid username or password"

## Problem
```
Error: Invalid username or password
```

This means the tables exist but the admin user data is corrupted or missing.

---

## Quick Fix: Reset Admin User (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go: https://supabase.com/dashboard
2. Select your project
3. Click: **SQL Editor**
4. Click: **New Query**

### Step 2: Run This SQL to Fix

```sql
-- Step 1: Check if admin exists
SELECT 'Checking admin user...' as step;
SELECT * FROM admin_users WHERE username = 'admin';

-- Step 2: Delete old admin if corrupted
DELETE FROM admin_users WHERE username = 'admin';

-- Step 3: Create fresh admin user with correct password
INSERT INTO admin_users (username, password_hash, email, full_name, role, is_active)
VALUES (
  'admin',
  crypt('Admin@123', gen_salt('bf')),
  'admin@goodwilltimbers.com',
  'Admin User',
  'admin',
  true
);

-- Step 4: Verify it was created
SELECT 'Admin user created!' as status;
SELECT username, email, is_active, role FROM admin_users WHERE username = 'admin';

-- Step 5: Test if we can authenticate
SELECT authenticate_admin('admin', 'Admin@123') as auth_result;
```

### Step 3: Check Output
You should see:
- ✅ Admin user created!
- ✅ admin | admin@goodwilltimbers.com | true | admin
- ✅ authenticated = true

---

## Detailed Troubleshooting

### If you get "function authenticate_admin does not exist"

This means the migrations didn't run properly. Run this:

```sql
-- Recreate the authentication function
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

-- Now create admin user
INSERT INTO admin_users (username, password_hash, email, full_name, role, is_active)
VALUES (
  'admin',
  crypt('Admin@123', gen_salt('bf')),
  'admin@goodwilltimbers.com',
  'Admin User',
  'admin',
  true
) ON CONFLICT (username) DO UPDATE SET password_hash = crypt('Admin@123', gen_salt('bf'));
```

### If you get "table admin_users doesn't exist"

Run the complete SQL from `QUICK_START_FIX.md` again.

---

## Step 4: Test Login Again

After running the SQL:

1. **Refresh browser:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Go to:** `http://localhost:5173/admin`
3. **Enter credentials:**
   - Username: `admin`
   - Password: `Admin@123`
4. **Click:** Login to Dashboard

---

## Verify Admin User in Database

Run this query to check everything is correct:

```sql
-- Check admin user details
SELECT 
  id,
  username,
  email,
  full_name,
  role,
  is_active,
  created_at
FROM admin_users 
WHERE username = 'admin';
```

You should see:
```
id       | admin-uuid-here
username | admin
email    | admin@goodwilltimbers.com
full_name| Admin User
role     | admin
is_active| true
created_at| 2026-02-22 ...
```

---

## Test Password Hash

Run this to verify the password works:

```sql
-- This should return: authenticated = true
SELECT * FROM authenticate_admin('admin', 'Admin@123');
```

If you see `authenticated = false`, the password hash is wrong. Run the delete + insert SQL again.

---

## Common Issues & Solutions

### ❌ "authenticated = false" when testing password

**Solution:** Password hash is corrupted
```sql
-- Delete and recreate
DELETE FROM admin_users WHERE username = 'admin';

INSERT INTO admin_users (username, password_hash, email, full_name, role, is_active)
VALUES (
  'admin',
  crypt('Admin@123', gen_salt('bf')),
  'admin@goodwilltimbers.com',
  'Admin User',
  'admin',
  true
);

-- Test again
SELECT * FROM authenticate_admin('admin', 'Admin@123');
```

### ❌ "is_active = false"

**Solution:** Account is disabled
```sql
UPDATE admin_users SET is_active = true WHERE username = 'admin';
```

### ❌ Username is different

**Solution:** Wrong username created
```sql
-- Check what usernames exist
SELECT username FROM admin_users;

-- If wrong username exists, use that instead
-- OR delete and recreate with correct username
```

### ❌ Multiple admin users exist

**Solution:** Delete all and recreate one
```sql
-- See all admin users
SELECT username, email FROM admin_users;

-- Delete all
DELETE FROM admin_users;

-- Recreate correct one
INSERT INTO admin_users (username, password_hash, email, full_name, role, is_active)
VALUES (
  'admin',
  crypt('Admin@123', gen_salt('bf')),
  'admin@goodwilltimbers.com',
  'Admin User',
  'admin',
  true
);
```

---

## Complete Reset (Nuclear Option)

If nothing works, drop and recreate everything:

```sql
-- Drop and recreate tables
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create admin_users table
CREATE TABLE admin_users (
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

-- Create sessions table
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create logs table
CREATE TABLE admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ensure pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create authentication function
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

-- Insert fresh admin user
INSERT INTO admin_users (username, password_hash, email, full_name, role, is_active)
VALUES (
  'admin',
  crypt('Admin@123', gen_salt('bf')),
  'admin@goodwilltimbers.com',
  'Admin User',
  'admin',
  true
);

-- Verify
SELECT 'Setup Complete!' as status;
SELECT * FROM admin_users;
SELECT * FROM authenticate_admin('admin', 'Admin@123');
```

---

## After Fix

1. ✅ Refresh browser: `Ctrl+Shift+R`
2. ✅ Go to `/admin`
3. ✅ Login with: `admin` / `Admin@123`
4. ✅ Should see dashboard

---

## Credentials to Remember

```
👤 Username: admin
🔐 Password: Admin@123
```

Save these securely!

---

**Need more help?** Check:
- `ADMIN_SETUP_COMPLETE.md` - Complete setup guide
- `ADMIN_CREDENTIALS.md` - Usage guide
