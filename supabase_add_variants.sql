-- ============================================================================
-- ADD VARIANTS, DIMENSIONS, AND SKU COLUMNS TO PRODUCTS TABLE
-- ============================================================================

-- Add new columns to products table if they don't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS dimensions VARCHAR(255),
ADD COLUMN IF NOT EXISTS sku VARCHAR(255),
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_dimensions ON products(dimensions);
CREATE INDEX IF NOT EXISTS idx_products_variants ON products USING GIN (variants);

-- Optional: If you want to migrate existing products with empty variants
-- UPDATE products 
-- SET variants = '[]'::jsonb 
-- WHERE variants IS NULL;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'products' 
-- ORDER BY ordinal_position;
