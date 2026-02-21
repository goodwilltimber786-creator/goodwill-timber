# Product Variants & Base Fields Implementation

## Overview
Updated the database and product form to support:
1. **Base Product Fields** - SKU and Dimensions at the product level
2. **Product Variants** - Multiple dimension-based variants with individual pricing
3. **Complete Data Persistence** - All fields now saved to database

## Database Structure

### New Columns Added to `products` table:
```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS dimensions VARCHAR(255),
ADD COLUMN IF NOT EXISTS sku VARCHAR(255),
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT NULL;
```

### Product Data Example:
```json
{
  "id": "uuid-123",
  "name": "Teak Wood Plank",
  "description": "Premium quality teak wood",
  "price": 5000,
  "sku": "TEAK-BASE",
  "dimensions": "2x4x8 ft",
  "category_id": "cat-1",
  "image_path": "/images/teak.jpg",
  "has_buy_now": true,
  "has_contact_us": true,
  "is_featured": true,
  "variants": [
    {
      "id": "v1",
      "dimension": "2x4x8 ft",
      "price": 5000,
      "sku": "TEAK-001"
    },
    {
      "id": "v2",
      "dimension": "2x4x10 ft",
      "price": 6500,
      "sku": "TEAK-002"
    },
    {
      "id": "v3",
      "dimension": "2x4x12 ft",
      "price": 8000,
      "sku": "TEAK-003"
    }
  ]
}
```

## Admin Form Fields

### New Form Inputs:
1. **Base Price** * (required)
   - Input type: number
   - Minimum: 0
   - Used as fallback price if variant doesn't specify price

2. **Base SKU** (optional)
   - Input type: text
   - Placeholder: "e.g., TEAK-001"
   - Used if variant doesn't have SKU

3. **Base Dimensions** (optional)
   - Input type: text
   - Placeholder: "e.g., 2x4x8 ft"
   - Default/primary dimension for the product

### Form Layout:
```
Product Name *
Category *
Description
Product Image

[NEW] Base Price * ________
[NEW] Base SKU ________  |  [NEW] Base Dimensions ________

Product Variants
├── Dimension * ________ | Price * ________ 
├── SKU (Optional) __________________
├── [Add Variant] button
└── [Remove] button (if > 1 variant)

Options
├── ☑ Enable "Buy Now"
├── ☑ Enable "Contact Us"
└── ☐ Featured Product
```

## TypeScript Types Updated

### ProductVariant:
```typescript
interface ProductVariant {
  id: string;
  dimension: string;      // Required
  price?: number;         // Optional, inherits from base price if not set
  sku?: string;          // Optional, inherits from base SKU if not set
}
```

### Product:
```typescript
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;          // Base price
  sku?: string | null;    // Base SKU
  dimensions?: string | null;  // Base dimensions
  category_id: string;
  image_path: string | null;
  has_buy_now: boolean;
  has_contact_us: boolean;
  is_featured: boolean;
  variants?: ProductVariant[] | null;  // Array of variants
  created_at: string;
}
```

## Files Modified

### 1. `supabase_add_variants.sql`
- Added migration script to add new columns to products table
- Creates indexes on sku, dimensions, and variants JSONB column

### 2. `src/lib/supabase.ts`
- Added `ProductVariant` type definition
- Updated `Product` type to include: `sku`, `dimensions`, `variants`

### 3. `src/components/admin/ProductsAdmin.tsx`
- Added `sku` and `dimensions` to `ProductForm` interface
- Updated initial form state with new fields
- Added form inputs for Base Price, Base SKU, Base Dimensions
- Updated `createMutation` to include new fields
- Updated `updateMutation` to include new fields
- Updated `handleOpenChange` to reset new fields

## Step-by-Step Setup

### Step 1: Run Database Migration
1. Open Supabase SQL Editor
2. Copy SQL from `supabase_add_variants.sql`
3. Execute the migration
4. Verify the columns were created:
   ```sql
   SELECT column_name, data_type FROM information_schema.columns 
   WHERE table_name = 'products' 
   ORDER BY ordinal_position;
   ```

### Step 2: Test in Admin Panel
1. Go to Admin > Products
2. Click "Add New Product"
3. Fill in:
   - Product Name
   - Category
   - Description
   - Product Image
   - **Base Price** (new)
   - **Base SKU** (new, optional)
   - **Base Dimensions** (new, optional)
4. Add Variants:
   - Click "Add Variant"
   - Enter Dimension (required)
   - Enter Price (required)
   - Enter SKU (optional)
   - Add more variants as needed
5. Set options (Buy Now, Contact Us, Featured)
6. Click "Create Product"

### Step 3: Verify in Product Modal
1. Go to Products page
2. Click on a product card
3. Modal should show:
   - Product image
   - Description
   - Base Price
   - **Available Variants** section with all variants
   - Action buttons

## Use Cases

### Scenario 1: Single Variant with Base Pricing
```
Base Price: ₹5000
Base SKU: TEAK-BASE
Base Dimensions: 2x4x8 ft
Variants: [Empty or single variant]
```
Result: Product shows at ₹5000

### Scenario 2: Multiple Sizes
```
Base Price: ₹5000 (fallback)
Variants:
  - 2x4x8 ft → ₹5000
  - 2x4x10 ft → ₹6500
  - 2x4x12 ft → ₹8000
```
Result: Customer sees 3 options, each with different price

### Scenario 3: Different Specs with Different SKUs
```
Base SKU: WOOD-BASE
Variants:
  - Thickness 5mm → ₹3000, SKU: WOOD-5MM
  - Thickness 10mm → ₹5000, SKU: WOOD-10MM
  - Thickness 15mm → ₹7000, SKU: WOOD-15MM
```
Result: Each variant has unique identifier

## Backward Compatibility

- Existing products without variants still work
- Base price is used as fallback if variant price not specified
- Base SKU used if variant SKU not specified
- All fields are optional except price and variant dimension

## Troubleshooting

### Variants Not Showing in Modal
1. Check that database migration was executed
2. Verify `variants` JSONB column exists in products table
3. Ensure you created product AFTER migration
4. Check browser console for errors

### Price Not Displaying
1. Verify base price is set (required field)
2. Check variant prices are set individually
3. If variant has no price, it uses base price

### Data Not Saving
1. Ensure all required fields are filled
2. Check browser console for API errors
3. Verify Supabase credentials are correct
4. Check database permissions

## Next Steps

1. ✅ Database migration applied
2. ✅ Admin form updated with new fields
3. ✅ TypeScript types updated
4. ✅ Product modal displays variants
5. Optional: Add bulk upload for variants
6. Optional: Add variant images per variant
7. Optional: Add stock tracking per variant
