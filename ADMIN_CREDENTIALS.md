# 🔐 Admin Credentials & Login Guide

## Default Admin Credentials

```
Username: admin
Password: Admin@123
```

⚠️ **IMPORTANT:** Change these credentials immediately in production!

---

## How to Login

### Step 1: Navigate to Admin Panel
Open your browser and go to:
```
http://localhost:5173/admin
or
https://yoursite.com/admin
```

### Step 2: Enter Credentials
- **Username:** `admin`
- **Password:** `Admin@123`

### Step 3: Click "Login to Dashboard"
You should see the admin panel after successful authentication.

---

## Features Available

✅ **Products Management**
- Add new products with variants
- Edit existing products
- Delete products
- Upload product images
- Manage multiple variants per product (different colors, dimensions, pricing)

✅ **Categories Management**
- Create and manage product categories
- Organize products by category

✅ **Order Management** (if implemented)
- View customer orders
- Update order status
- Manage order details

✅ **Audit Trail**
- All admin actions are logged
- View who did what and when
- Track changes to products

---

## Product Variants

When adding a product, you can now add multiple variants:

1. **Click "Add Product"**
2. **Fill Basic Info:**
   - Product Name
   - Category
   - Description
   - Image

3. **Add Variants:**
   - SKU/Product Code (unique identifier)
   - Color (select from dropdown)
   - Dimensions (e.g., 2x4x8 ft)
   - Price (₹)
   - Stock quantity

4. **Click "Add Variant" button** to add more variants

5. **Save Product**

### Example:
```
Product: Teak Wood

Variant 1:
- SKU: TEAK-001
- Color: Natural
- Dimensions: 2x4x8 ft
- Price: ₹5000
- Stock: 20

Variant 2:
- SKU: TEAK-002
- Color: Brown
- Dimensions: 2x4x10 ft
- Price: ₹6000
- Stock: 15
```

---

## Password Management

### Change Your Password

1. Login to admin panel
2. Go to Account Settings (if available)
3. Enter:
   - Current password
   - New password
   - Confirm new password
4. Click "Change Password"

### Reset Password (Database)

If you forget the password, reset it in Supabase:

```sql
-- Run this in Supabase SQL Editor
UPDATE admin_users
SET password_hash = crypt('NewPassword123', gen_salt('bf'))
WHERE username = 'admin';
```

Then login with:
- Username: `admin`
- Password: `NewPassword123`

---

## Add New Admin Users

### Via Database (Supabase)

```sql
INSERT INTO admin_users (username, password_hash, email, full_name, role)
VALUES (
  'newadmin',
  crypt('SecurePassword123', gen_salt('bf')),
  'newadmin@goodwilltimbers.com',
  'New Admin Name',
  'admin'
);
```

### Verify User Added

```sql
SELECT username, email, full_name, is_active FROM admin_users;
```

---

## Troubleshooting

### ❌ "Invalid username or password"
- Double-check credentials: `admin` / `Admin@123`
- Ensure the admin account is active in database
- Check if database migrations have been run

### ❌ "Session validation failed"
- Your session may have expired
- Clear browser cookies: `Ctrl+Shift+Delete`
- Try logging in again

### ❌ "Database connection error"
- Check Supabase credentials in `.env`
- Verify internet connection
- Check if Supabase project is active

### ❌ "Variants not showing"
- Ensure `supabase_variants.sql` has been executed
- Check browser console for errors
- Refresh the page

---

## Security Best Practices

✅ **DO:**
- Change default password immediately
- Use strong, unique passwords
- Logout when finished
- Never share credentials
- Monitor audit logs for suspicious activity

❌ **DON'T:**
- Share admin credentials
- Use same password across services
- Leave admin panel open unattended
- Store passwords in plain text
- Expose credentials in git/code

---

## Session Information

- **Session Duration:** 24 hours
- **Auto Logout:** After 24 hours of login
- **Session Storage:** localStorage (browser)
- **Session Log:** All sessions tracked in database

---

## Support & Documentation

📚 **Setup Guide:** `ADMIN_AUTH_SETUP.md`
📝 **Implementation Details:** `ADMIN_AUTH_COMPLETE.md`
🔧 **Database Schema:** `supabase_admin_auth.sql`

---

## Quick Reference

| Task | Steps |
|------|-------|
| Login | Go to `/admin` → Enter credentials → Click Login |
| Add Product | Click "Add Product" → Fill form → Add variants → Save |
| Edit Product | Click ✏️ icon → Update info → Save |
| Delete Product | Click 🗑️ icon → Confirm |
| Change Password | Settings → Change Password → Enter old & new password |
| Logout | Click Logout button or close browser |

---

**Last Updated:** February 22, 2026
**Status:** ✅ Ready for Production
