# 🔧 FIX: Storage Bucket RLS Policy Error

## ❌ Error You're Getting
```
StorageApiError: new row violates row-level security policy
```

## ✅ What This Means
The Supabase Storage bucket exists but has security policies that block uploads from your application.

---

## 🚀 Fix Steps (Do These in Supabase Dashboard)

### Step 1: Go to Storage
1. Open Supabase Dashboard
2. Click **Storage** (left sidebar)
3. You should see bucket: **timber-images**

### Step 2: Check/Create Bucket
If bucket doesn't exist:
- Click **Create new bucket**
- Name: `timber-images`
- Public (toggle ON)
- Click **Create bucket**

If bucket exists, continue to Step 3.

### Step 3: Set Policies
1. Click on **timber-images** bucket
2. Click **Policies** tab
3. Click **+ Create policy** (or **Create new policy**)

### Step 4: Allow Public Uploads
Create policy with these settings:

**Policy Name**: `Allow public uploads`

**For**: `All users`

**Operations to allow**: Check all boxes:
- ✅ SELECT
- ✅ INSERT
- ✅ UPDATE
- ✅ DELETE

**Target roles**: `public`

**Which rows**: Leave default or `(true)` 

**Which columns**: Leave default (all columns)

Click **Review** → **Save policy**

### Step 5: Allow Public Access
Create another policy:

**Policy Name**: `Allow public read`

**For**: `All users`

**Operations**: 
- ✅ SELECT only

**Target roles**: `public`

Click **Review** → **Save policy**

---

## 📋 Quick Checklist

- ✅ Bucket name: `timber-images`
- ✅ Bucket is **Public** (not Private)
- ✅ Has policy: "Allow public uploads" (INSERT, SELECT, UPDATE, DELETE)
- ✅ Has policy: "Allow public read" (SELECT)
- ✅ Policies apply to `public` role

---

## 🧪 Test Upload

1. Go back to admin: `http://localhost:5173/admin/login`
2. Click Categories
3. Click "➕ Add Category"
4. Select an image file
5. Should work now! ✅

If still errors, check:
- Bucket name is exactly `timber-images`
- Bucket is Public (not Private)
- Policies are set correctly

---

## 🎯 Alternative: Use Code to Fix

If you prefer SQL, run this in Supabase SQL Editor:

```sql
-- Allow public uploads to storage
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'timber-images'
  AND auth.role() = 'authenticated'
  OR auth.role() = 'anon'
);

-- Allow public reads
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'timber-images');

-- Allow public updates
CREATE POLICY "Allow public updates"
ON storage.objects
FOR UPDATE
WITH CHECK (bucket_id = 'timber-images');

-- Allow public deletes
CREATE POLICY "Allow public deletes"
ON storage.objects
FOR DELETE
USING (bucket_id = 'timber-images');
```

---

## 💡 After Fix

Once policies are correct:

1. ✅ Admin can upload images
2. ✅ Images stored in Supabase
3. ✅ Public URL generated
4. ✅ Website displays images
5. ✅ Everything works! 🎉

---

## 🚨 Database Error: 401 Unauthorized

If you see error like:
```
POST https://xxx.supabase.co/rest/v1/categories 401 (Unauthorized)
```

This means your **database tables need RLS policies too!**

### Fix Database Access

Run this in Supabase SQL Editor:

```sql
-- Enable RLS on tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public read (SELECT)
CREATE POLICY "Allow public read categories"
ON categories FOR SELECT
USING (true);

CREATE POLICY "Allow public read products"
ON products FOR SELECT
USING (true);

CREATE POLICY "Allow public read submissions"
ON contact_submissions FOR SELECT
USING (true);

-- Allow public write (INSERT, UPDATE, DELETE)
CREATE POLICY "Allow public write categories"
ON categories FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update categories"
ON categories FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete categories"
ON categories FOR DELETE
USING (true);

-- Same for products
CREATE POLICY "Allow public write products"
ON products FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update products"
ON products FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete products"
ON products FOR DELETE
USING (true);

-- Same for submissions
CREATE POLICY "Allow public write submissions"
ON contact_submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update submissions"
ON contact_submissions FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete submissions"
ON contact_submissions FOR DELETE
USING (true);
```

### Then Test Again

1. Go to admin: `http://localhost:5173/admin/login`
2. Click Categories
3. Click "➕ Add Category"
4. Should work now! ✅

---

## ⚠️ If Still Getting Error

Check:
1. **Storage Bucket**: Go to Storage, see `timber-images`?
2. **Bucket is public**: Click bucket name, check "Public" toggle
3. **Storage Policies created**: Click Policies tab on bucket
4. **Database RLS policies**: Run SQL above in SQL Editor
5. **Environment variables correct**: Check `.env.local` has:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
6. **Clear browser cache**: Ctrl+Shift+Delete (Chrome) or Cmd+Shift+Delete (Mac)

---

## 🎉 Success Signs

After fixing:
- ✅ "Choose file" button works
- ✅ Image preview shows
- ✅ "Create Category" button saves
- ✅ No error messages
- ✅ Category appears on homepage with image

Go ahead and test now! 🚀
