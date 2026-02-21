# How to Login to Admin Panel 🔐

## Quick Start

### Step 1: Go to Admin Login Page
Open your browser and go to:
```
http://localhost:5173/admin/login
```

(If running on a different port, check your terminal output)

### Step 2: Enter Password
You'll see a login form with:
- **Field:** "Admin Password"
- **Password:** Check your `.env.local` file for `VITE_ADMIN_PASSWORD`

### Step 3: Click Login
- Click the "Login" button
- If password is correct → You'll be logged in! ✅
- If password is wrong → Error message appears

### Step 4: Access Admin Panel
After login, you'll be redirected to:
```
http://localhost:5173/admin
```

---

## Default Password

If you haven't set a password in `.env.local`, the default is:
```
admin123
```

---

## Find Your Password

### Step 1: Check `.env.local` File
Your password is stored here:
```
VITE_ADMIN_PASSWORD=your_password_here
```

### Step 2: Can't Find `.env.local`?
1. Open project folder
2. Create new file called `.env.local`
3. Add this line:
```
VITE_ADMIN_PASSWORD=your_secure_password
```

### Step 3: Save and Reload
- Save the file
- Reload the page (F5)
- Try logging in again

---

## Admin Panel Navigation

### After Logging In

You'll see a sidebar with 4 options:

#### 1. **Dashboard** (`/admin`)
- View statistics
- See order count
- View product count
- See recent orders

#### 2. **Products** (`/admin/products`)
- View all products
- Add new product
- Edit product details
- Change prices
- Enable/disable Buy Now button
- Enable/disable Contact Us button
- Delete products

#### 3. **Categories** (`/admin/categories`)
- View all categories
- Add new category
- Upload category image
- Add category description
- Edit existing categories
- Delete categories

#### 4. **Orders & Inquiries** (`/admin/submissions`)
- View all customer orders
- View all customer inquiries
- See customer details
- Read messages
- Delete submissions

---

## Complete Login Flow

```
Browser
  ↓
Go to http://localhost:5173/admin/login
  ↓
AdminLogin Component Loads
  ↓
Enter Password
  ↓
Click "Login" Button
  ↓
Password Check:
  ├─ Correct? → localStorage.setItem('adminToken', 'authenticated')
  │              → Redirect to /admin
  │              → See Dashboard ✅
  │
  └─ Wrong? → toast.error('Invalid password')
              → Stay on login page
              → Try again
```

---

## Common Issues

### Issue 1: "Invalid password" Error
**Solution:**
- Check your `.env.local` file
- Make sure `VITE_ADMIN_PASSWORD` is set correctly
- Reload the page (Ctrl+Shift+R for hard refresh)

### Issue 2: Can't Find Admin Login Page
**Solution:**
1. Make sure you're running the dev server: `npm run dev`
2. Check the URL is exactly: `http://localhost:5173/admin/login`
3. Port might be different, check terminal

### Issue 3: Logged In But Pages Show Nothing
**Solution:**
1. Check console (F12 → Console tab) for errors
2. Make sure Supabase credentials are set
3. Make sure database tables exist (run SQL schema)

### Issue 4: Keep Getting Logged Out
**Solution:**
- Browser localStorage is clearing
- Check browser settings
- Try private/incognito window
- Try different browser

---

## Security Tips

### Good Passwords
✅ `MySecurePassword123!@#`
✅ `Admin_2024_Secure`
✅ `timber_admin_pwd_2024`

### Bad Passwords
❌ `admin123` (too simple)
❌ `password` (too common)
❌ `12345678` (too obvious)
❌ `admin` (way too simple)

---

## After Login

### You Can Now:
1. ✅ Add products
2. ✅ Edit product prices
3. ✅ Add categories
4. ✅ Upload images
5. ✅ View customer orders
6. ✅ See inquiries
7. ✅ Toggle Buy Now buttons
8. ✅ Toggle Contact Us buttons

### Changes Appear:
- ✅ Instantly on frontend
- ✅ No page refresh needed
- ✅ All users see updates
- ✅ Real-time sync

---

## First Time Setup

### Step 1: Login with Default Password
```
Password: admin123
```

### Step 2: Change Password
1. Edit `.env.local`
2. Change `VITE_ADMIN_PASSWORD=admin123` to your password
3. Clear browser cache (Ctrl+Shift+Delete)
4. Logout and login again with new password

### Step 3: Start Adding Products
1. Go to `/admin/categories`
2. Create a category
3. Go to `/admin/products`
4. Create products for that category
5. Watch them appear on homepage! ✨

---

## Logout

To logout:
1. Click "Back to Site" button (top right)
2. Or clear localStorage manually:
   ```javascript
   localStorage.removeItem('adminToken');
   ```
3. Go back to `/admin/login`

---

## Access Multiple Times

You can:
- ✅ Keep the same password
- ✅ Change password anytime (update `.env.local`)
- ✅ Have only one password (single admin user)
- ✅ Share password with team (same password)

**Note:** This is a simple password system. For production with multiple users, consider upgrading to Supabase Auth.

---

## Mobile Access

The admin panel works on mobile too!
- Go to: `http://your-domain:5173/admin/login` (on mobile)
- Or use ngrok to expose local server: `ngrok http 5173`
- Then access from phone

---

## Forgot Password?

1. Check `.env.local` file
2. If lost, edit `.env.local`:
   ```
   VITE_ADMIN_PASSWORD=new_password
   ```
3. Reload page
4. Login with new password

---

## Summary

| Step | Action |
|------|--------|
| 1 | Go to `http://localhost:5173/admin/login` |
| 2 | Enter password from `.env.local` |
| 3 | Click "Login" |
| 4 | See admin dashboard ✅ |
| 5 | Manage products & categories |
| 6 | Changes appear on frontend |

**That's it!** 🎉

---

## Quick Links

- 📍 **Admin Login:** `http://localhost:5173/admin/login`
- 📊 **Dashboard:** `http://localhost:5173/admin`
- 📦 **Products:** `http://localhost:5173/admin/products`
- 📂 **Categories:** `http://localhost:5173/admin/categories`
- 📧 **Orders:** `http://localhost:5173/admin/submissions`
- 🏠 **Homepage:** `http://localhost:5173/`
- 🛒 **Products Page:** `http://localhost:5173/products`

---

Need help? Check `SETUP_GUIDE.md` for complete setup instructions!
