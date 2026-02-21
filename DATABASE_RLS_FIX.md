# 🔧 FIX: Database RLS Policies Issue

## Problem
Category creation/update failing with "Failed to create" message. This happens when RLS policies are incorrect or missing UPDATE/DELETE policies.

## Quick Fix - Run This SQL in Supabase SQL Editor

```sql
-- Drop old policies first
DROP POLICY IF EXISTS categories_select_policy ON categories;
DROP POLICY IF EXISTS products_select_policy ON products;
DROP POLICY IF EXISTS submissions_insert_policy ON contact_submissions;
DROP POLICY IF EXISTS submissions_select_policy ON contact_submissions;

-- Create complete policies for categories
CREATE POLICY "categories_select" ON categories
  FOR SELECT USING (true);

CREATE POLICY "categories_insert" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "categories_update" ON categories
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "categories_delete" ON categories
  FOR DELETE USING (true);

-- Create complete policies for products
CREATE POLICY "products_select" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_insert" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "products_update" ON products
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "products_delete" ON products
  FOR DELETE USING (true);

-- Create complete policies for contact_submissions
CREATE POLICY "submissions_select" ON contact_submissions
  FOR SELECT USING (true);

CREATE POLICY "submissions_insert" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "submissions_update" ON contact_submissions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "submissions_delete" ON contact_submissions
  FOR DELETE USING (true);
```

## Steps to Apply Fix

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Go to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Paste the SQL above**
   - Copy all the SQL code above
   - Paste it into the query box

4. **Run the query**
   - Click "Run" button (or Ctrl+Enter)
   - Wait for success message

5. **Test it**
   - Go to http://localhost:5173/admin/login
   - Try adding a category
   - Should work now! ✅

## If Still Failing

Check if RLS is enabled:

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('categories', 'products', 'contact_submissions');
```

If rowsecurity shows `false`, enable it:

```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
```

## Storage Bucket Issue (If Applicable)

If image upload fails, check storage bucket policies:

```sql
-- View storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- If empty, create storage policies
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'timber-images');

CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'timber-images');

CREATE POLICY "Allow public updates"
ON storage.objects
FOR UPDATE
WITH CHECK (bucket_id = 'timber-images');

CREATE POLICY "Allow public deletes"
ON storage.objects
FOR DELETE
USING (bucket_id = 'timber-images');
```

## Testing Checklist

- ✅ Can add category
- ✅ Can upload image
- ✅ Category appears on homepage
- ✅ Can edit category
- ✅ Can delete category
- ✅ Can add product
- ✅ Can place order
- ✅ Order shows in admin

## 🎉 Success!

After running the SQL, everything should work perfectly!
