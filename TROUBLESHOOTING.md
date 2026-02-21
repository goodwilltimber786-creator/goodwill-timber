# 🆘 Complete Troubleshooting Guide

## Current Issues & Solutions

### Issue 1: Storage RLS Policy Error
**Error**: `StorageApiError: new row violates row-level security policy`

**Solution**: See `STORAGE_RLS_FIX.md` - Configure bucket policies

---

## Setup Verification Checklist

### Database Setup
- [ ] Schema deployed to Supabase
  - Go to Supabase SQL Editor
  - Run: `supabase_schema.sql`
  - Should create 3 tables

- [ ] Tables created (verify):
  ```sql
  SELECT * FROM categories;
  SELECT * FROM products;
  SELECT * FROM contact_submissions;
  ```

### Storage Setup
- [ ] Bucket created: `timber-images`
  - Go to Storage
  - Should see bucket named `timber-images`

- [ ] Bucket is Public
  - Click bucket
  - Check toggle: **Public** is ON

- [ ] Policies configured
  - Click Policies tab
  - Should have at least 2 policies

### Environment Variables
- [ ] `.env.local` file exists with:
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here
  VITE_ADMIN_PASSWORD=YourPassword123
  ```

- [ ] Values are correct (copy from Supabase Dashboard)

### Application Setup
- [ ] Dependencies installed
  ```bash
  npm install
  ```

- [ ] Dev server running
  ```bash
  npm run dev
  ```

- [ ] No compile errors in terminal

---

## Common Issues & Fixes

### Issue: "Cannot find storage bucket"
**Cause**: Bucket name is wrong or doesn't exist

**Fix**:
```
1. Go to Supabase Dashboard
2. Storage → Check bucket name
3. Must be exactly: timber-images
4. If missing, create it
```

### Issue: "Anon key cannot upload"
**Cause**: Policies only allow authenticated users

**Fix**:
```sql
-- Allow anonymous uploads
CREATE POLICY "Allow anon uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'timber-images');
```

### Issue: Image uploads fail silently
**Cause**: Bucket exists but has no policies

**Fix**: Create policies (see STORAGE_RLS_FIX.md)

### Issue: Images show but product page blank
**Cause**: Product by ID not found

**Fix**:
1. Make sure products exist in database
2. Try direct URL: `http://localhost:5173/products/any-product-id`
3. Check browser console for errors

### Issue: Categories/Products not showing
**Cause**: No data in database OR Supabase credentials wrong

**Fix**:
1. Verify `.env.local` has correct credentials
2. Check Supabase dashboard → categories table
3. Add test category through admin panel
4. Refresh page

### Issue: Admin login fails
**Cause**: Wrong password

**Fix**:
1. Check `.env.local` for `VITE_ADMIN_PASSWORD`
2. Try password from there
3. Password is case-sensitive

---

## Step-by-Step Recovery

### If Everything is Broken

1. **Clear Everything**
   ```bash
   # Stop dev server (Ctrl+C)
   # Delete node_modules
   rm -rf node_modules
   # Clear npm cache
   npm cache clean --force
   ```

2. **Reinstall**
   ```bash
   npm install
   ```

3. **Verify Supabase**
   - Go to Supabase Dashboard
   - Check if tables exist (SQL Editor)
   - Check if bucket exists (Storage)

4. **Check Environment**
   ```
   .env.local should have:
   - VITE_SUPABASE_URL (starts with https://)
   - VITE_SUPABASE_ANON_KEY (long string)
   - VITE_ADMIN_PASSWORD
   ```

5. **Restart Everything**
   ```bash
   npm run dev
   ```

---

## Browser Console Debugging

### Check for Errors
1. Open browser: `http://localhost:5173/`
2. Press `F12` (DevTools)
3. Click **Console** tab
4. Look for red error messages

### Common Console Errors

**Error**: `Supabase is not defined`
- Fix: Check `.env.local` credentials

**Error**: `Cannot read property 'image_path'`
- Fix: Database schema not updated

**Error**: `bucket 'timber-images' does not exist`
- Fix: Create storage bucket

---

## Test Each Component

### Test Admin Login
```
URL: http://localhost:5173/admin/login
Password: (from VITE_ADMIN_PASSWORD)
```

### Test Category Creation
```
1. Admin → Categories
2. Click "Add Category"
3. Fill: Name = "Test"
4. Select image file
5. Click "Create"
```

### Test Product Creation
```
1. Admin → Products
2. Click "Add Product"
3. Fill: Name, Category, Price
4. Select image file
5. Click "Create"
```

### Test Frontend
```
1. Go to: http://localhost:5173/
2. Should see categories from database
3. Should see featured products
4. Click product → Should show detail page
5. Should show "Buy Now" and/or "Inquiry" buttons
```

---

## Network Debugging

### Check Supabase Connection
Open browser console and run:
```javascript
// Check if Supabase client is initialized
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

### Check API Calls
1. Open DevTools → Network tab
2. Try creating a category
3. Look for requests to Supabase
4. Check status codes:
   - 200 = success
   - 400 = bad request
   - 401 = unauthorized
   - 413 = payload too large (image too big)

---

## File Verification

### Check Files Exist
```bash
# Database
ls supabase_schema.sql

# Admin Components
ls src/components/admin/CategoriesAdmin.tsx
ls src/components/admin/ProductsAdmin.tsx

# Frontend Components
ls src/components/home/CategoryGrid.tsx
ls src/components/home/FeaturedProducts.tsx

# Pages
ls src/pages/ProductDetail.tsx

# Image Service
ls src/lib/imageUpload.ts
```

### Check Types Updated
```bash
# Should have image_path not image_url
grep "image_path" src/lib/supabase.ts
```

---

## Getting Help

### Before Asking for Help, Check:

1. ✅ Supabase credentials in `.env.local`
2. ✅ Database schema deployed
3. ✅ Storage bucket created and public
4. ✅ Storage policies configured
5. ✅ Dev server running (npm run dev)
6. ✅ No compile errors
7. ✅ Browser console has no errors
8. ✅ Cache cleared (Ctrl+F5)

### Then Try:
```bash
# Clear and rebuild
npm run dev

# Or full rebuild
npm install && npm run dev
```

---

## Success Checklist

- ✅ Admin login works
- ✅ Can create category with image
- ✅ Can create product with image
- ✅ Homepage shows categories
- ✅ Homepage shows featured products
- ✅ Product detail page loads
- ✅ "Buy Now" button works
- ✅ "Inquiry" button works
- ✅ Images display correctly
- ✅ No console errors

If all checked ✅, you're ready to deploy! 🎉

---

## Quick Links

- **Supabase Dashboard**: https://app.supabase.com
- **Your Project**: Check email for invite
- **SQL Editor**: Dashboard → SQL Editor
- **Storage**: Dashboard → Storage
- **Dev Credentials**: Dashboard → Settings → API

---

*Last Updated: February 21, 2026*
