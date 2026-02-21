# Quick Setup Guide - Variants Implementation

## 3 Simple Steps to Enable Product Variants

### Step 1️⃣: Run Database Migration (2 minutes)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create a new query
3. Copy and paste this SQL:

```sql
-- Add variants, dimensions, and sku columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS dimensions VARCHAR(255),
ADD COLUMN IF NOT EXISTS sku VARCHAR(255),
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_dimensions ON products(dimensions);
CREATE INDEX IF NOT EXISTS idx_products_variants ON products USING GIN (variants);
```

4. Click **Run** (play icon)
5. You should see "Query successful"

### Step 2️⃣: Verify Migration (1 minute)

Run this verification query in the same SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;
```

You should see these new columns:
- `sku` (character varying)
- `dimensions` (character varying)  
- `variants` (jsonb)

### Step 3️⃣: Test in Admin Panel (5 minutes)

1. **Restart your app** (if running)
2. Go to Admin → Products → Add New Product
3. Fill in product details:
   - Product Name: "Teak Wood Plank"
   - Category: (select one)
   - Description: "Premium teak wood"
   - Image: (upload image)
   - **Base Price:** 5000 ✨ (NEW)
   - **Base SKU:** TEAK-BASE ✨ (NEW)
   - **Base Dimensions:** 2x4x8 ft ✨ (NEW)

4. **Add Variants:**
   - Click "Add Variant"
   - Dimension: 2x4x8 ft
   - Price: 5000
   - SKU: TEAK-001
   
   - Click "Add Variant" again
   - Dimension: 2x4x10 ft
   - Price: 6500
   - SKU: TEAK-002

5. Set options:
   - ✅ Buy Now
   - ✅ Contact Us
   - ☐ Featured

6. Click "Create Product"

### Step 4️⃣: View in Frontend (1 minute)

1. Go to Products page
2. Click on the product card you just created
3. Modal should show:
   - Product image
   - Base Price: ₹5000
   - **Available Variants:**
     - 2x4x8 ft → ₹5000 (SKU: TEAK-001)
     - 2x4x10 ft → ₹6500 (SKU: TEAK-002)

## Key Changes Made

| Component | Change |
|-----------|--------|
| **Database** | Added `sku`, `dimensions`, `variants` columns |
| **Admin Form** | Added Base Price, Base SKU, Base Dimensions inputs |
| **Product Modal** | Shows all variants with individual prices |
| **TypeScript** | Updated Product and ProductVariant types |

## Frequently Asked Questions

**Q: Are base SKU and dimensions required?**
A: No, they're optional. Base Price is required.

**Q: Can variants inherit base values?**
A: Yes, if variant price/SKU is not set, it uses base values.

**Q: Can I add variants after creating product?**
A: Yes, click Edit product and add/modify variants.

**Q: Why are variant prices different from base price?**
A: Different sizes/dimensions often have different costs.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Variants not showing | Make sure migration was run. Restart app. |
| "Unknown column" error | Check SQL migration was executed successfully |
| New fields missing from form | Clear browser cache, refresh page |
| Data not saving | Verify base price is filled (required) |

## That's it! 🎉

Your product variant system is now ready to use!

For detailed info, see `VARIANTS_IMPLEMENTATION.md`
