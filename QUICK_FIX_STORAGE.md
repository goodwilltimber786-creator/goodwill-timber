# ⚡ Quick Fix: Storage RLS Error

## The Error
```
StorageApiError: new row violates row-level security policy
```

## The Fix (5 minutes)

### In Supabase Dashboard:

1. **Go to Storage**
   - Left sidebar → Storage

2. **Create/Check Bucket**
   - Name: `timber-images`
   - Public: ON ✅
   - Click Create (if needed)

3. **Add Policies**
   - Click bucket → Policies tab
   - Click "+ Create policy"

4. **Create Policy 1: Upload**
   ```
   Name: Allow uploads
   Operations: INSERT, SELECT, UPDATE, DELETE (all checked)
   Target roles: public
   ```
   Click Save

5. **Create Policy 2: Download**
   ```
   Name: Allow downloads
   Operations: SELECT (checked)
   Target roles: public
   ```
   Click Save

### Then Run SQL (IMPORTANT!)

Go to Supabase SQL Editor and run:

```sql
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow read" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow read" ON contact_submissions FOR SELECT USING (true);

-- Allow public write
CREATE POLICY "Allow write" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow write" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow write" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Allow update
CREATE POLICY "Allow update" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow update" ON contact_submissions FOR UPDATE USING (true);

-- Allow delete
CREATE POLICY "Allow delete" ON categories FOR DELETE USING (true);
CREATE POLICY "Allow delete" ON products FOR DELETE USING (true);
CREATE POLICY "Allow delete" ON contact_submissions FOR DELETE USING (true);
```

### Back in App:

1. **Refresh page** (Ctrl+F5)
2. **Try uploading** image in admin
3. **Should work!** ✅

---

## If Still Not Working

```sql
-- Drop old policies
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow downloads" ON storage.objects;

-- Create new policies
CREATE POLICY "Allow uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'timber-images');

CREATE POLICY "Allow downloads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'timber-images');

CREATE POLICY "Allow updates"
ON storage.objects
FOR UPDATE
WITH CHECK (bucket_id = 'timber-images');

CREATE POLICY "Allow deletes"
ON storage.objects
FOR DELETE
USING (bucket_id = 'timber-images');
```

Click **Run**

Then try uploading again.

---

## Verify It Works

✅ Upload image in admin
✅ See preview
✅ Click Create
✅ Category appears on homepage with image
✅ No errors!

🎉 Done!
