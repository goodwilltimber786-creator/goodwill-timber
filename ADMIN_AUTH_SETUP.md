# Admin Authentication System - Database-Based

## Overview

The admin authentication system has been updated from simple `.env` password-based authentication to a robust database-based system with:

- ✅ Username and password authentication
- ✅ Password hashing with bcrypt
- ✅ Session management with token expiration
- ✅ Audit logging for all admin actions
- ✅ Support for multiple admin users
- ✅ Account activation/deactivation

## Setup

### 1. Run the SQL Migration

Execute the SQL file `supabase_admin_auth.sql` in your Supabase SQL editor:

```sql
-- Copy entire contents of supabase_admin_auth.sql and run in Supabase SQL editor
```

This will create:
- `admin_users` table
- `admin_sessions` table
- `admin_logs` table
- Required functions and policies

### 2. Default Admin Account

The migration creates a default admin account:
- **Username:** `admin`
- **Password:** `Admin@123` (from your `.env` file)

⚠️ **Important:** Change this password immediately in production!

## Usage

### Login

```typescript
import { adminAuthService } from '@/lib/adminAuth';

const handleLogin = async (username: string, password: string) => {
  const response = await adminAuthService.login(username, password);
  
  // Session is automatically stored in localStorage
  localStorage.setItem('adminSessionToken', response.sessionToken);
  localStorage.setItem('adminUser', JSON.stringify(response.adminUser));
};
```

### Check Authentication

```typescript
import { useAdminAuth } from '@/components/admin/AdminLogin';

export function MyComponent() {
  const { isAuthenticated, adminUser, logout } = useAdminAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome, {adminUser.username}!</div>;
}
```

### Logout

```typescript
import { adminAuthService } from '@/lib/adminAuth';

const handleLogout = async () => {
  const sessionToken = localStorage.getItem('adminSessionToken');
  await adminAuthService.logout(sessionToken);
  localStorage.removeItem('adminSessionToken');
  localStorage.removeItem('adminUser');
};
```

### Change Password

```typescript
try {
  const result = await adminAuthService.changePassword(
    'admin',
    'current_password',
    'new_password'
  );
  console.log(result.message);
} catch (error) {
  console.error('Failed to change password:', error);
}
```

## Add New Admin Users

To add additional admin users, use the Supabase dashboard or insert directly:

```sql
INSERT INTO admin_users (username, password_hash, email, full_name, role)
VALUES (
  'newadmin',
  crypt('secure_password_here', gen_salt('bf')),
  'newadmin@goodwilltimbers.com',
  'New Admin',
  'admin'
);
```

## Database Schema

### admin_users Table
```sql
- id: UUID (Primary Key)
- username: TEXT (Unique)
- password_hash: TEXT (Bcrypt hashed)
- email: TEXT (Unique)
- full_name: TEXT
- role: TEXT (default: 'admin')
- is_active: BOOLEAN (default: true)
- last_login: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### admin_sessions Table
```sql
- id: UUID (Primary Key)
- admin_user_id: UUID (FK to admin_users)
- session_token: TEXT (Unique)
- ip_address: TEXT
- user_agent: TEXT
- expires_at: TIMESTAMP
- created_at: TIMESTAMP
```

### admin_logs Table (Audit Trail)
```sql
- id: UUID (Primary Key)
- admin_user_id: UUID (FK to admin_users)
- action: TEXT (e.g., 'login', 'create_product', 'delete_product')
- entity_type: TEXT (e.g., 'product', 'category')
- entity_id: TEXT
- details: JSONB (Additional metadata)
- ip_address: TEXT
- created_at: TIMESTAMP
```

## Security Features

### Password Security
- Passwords are hashed using bcrypt with salt
- Never stored in plain text
- Functions use parameterized queries to prevent SQL injection

### Session Management
- Sessions have 24-hour expiration by default
- Each login creates a new session token
- Old sessions are automatically cleaned up

### Audit Trail
- All admin actions are logged
- Track who did what and when
- IP addresses and user agents recorded

### Row Level Security (RLS)
- Tables protected with RLS policies
- Only authenticated users can read/write
- Policies enforce proper authorization

## Audit Trail Example

Query recent admin activities:

```sql
SELECT 
  al.created_at,
  au.username,
  al.action,
  al.entity_type,
  al.entity_id,
  al.details
FROM admin_logs al
JOIN admin_users au ON al.admin_user_id = au.id
ORDER BY al.created_at DESC
LIMIT 100;
```

## API Functions Available

### authenticate_admin(username, password)
Returns: `{ authenticated, admin_user_id, username, email, full_name, role }`

### create_admin_session(admin_user_id, session_token, ip, user_agent, expires_in_hours)
Returns: `admin_sessions` record

### validate_admin_session(session_token)
Returns: `{ is_valid, admin_user_id, username, email, role }`

### log_admin_action(admin_user_id, action, entity_type, entity_id, details, ip_address)
Returns: `log_id` (UUID)

### change_admin_password(username, current_password, new_password)
Returns: `{ success, message }`

## Troubleshooting

### "Invalid username or password"
- Check username and password are correct
- Verify the admin user exists in the database
- Ensure the account is active (`is_active = true`)

### "Session validation failed"
- Session may have expired (24 hours)
- User needs to login again
- Check if session token exists in `admin_sessions` table

### Password not working after migration
- Default password is `Admin@123` from your `.env` file
- If changed, use Supabase dashboard to update

## Migration from Old System

The old `.env` based authentication is still supported for compatibility. However, the new system takes precedence. To fully migrate:

1. ✅ Run `supabase_admin_auth.sql`
2. ✅ Update components to use new `useAdminAuth()` hook
3. ✅ Clear old localStorage entries: `localStorage.removeItem('adminToken')`
4. ✅ Remove `VITE_ADMIN_PASSWORD` from `.env` once migrated

## Next Steps

- [ ] Change default admin password
- [ ] Add additional admin users
- [ ] Set up session cleanup job
- [ ] Configure audit log retention
- [ ] Implement 2FA (optional)
- [ ] Set up admin activity notifications
