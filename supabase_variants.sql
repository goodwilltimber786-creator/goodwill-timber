-- Product Variants Migration for Supabase
-- This migration adds support for product variants with different SKUs, colors, dimensions, and pricing

-- 1. Add variants column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]';

-- 2. Create product_variants table for better querying and management
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  color TEXT,
  dimensions TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_price ON product_variants(price);

-- 4. Create a view to get product details with variant count
CREATE OR REPLACE VIEW products_with_variants AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.category_id,
  p.image_path,
  p.price,
  p.has_buy_now,
  p.has_contact_us,
  p.is_featured,
  p.created_at,
  COUNT(pv.id) as variant_count,
  MIN(pv.price) as min_variant_price,
  MAX(pv.price) as max_variant_price,
  SUM(pv.stock) as total_stock
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
GROUP BY p.id;

-- 5. Function to update product_updated_at on variant changes
CREATE OR REPLACE FUNCTION update_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET updated_at = NOW() WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger to call the function
DROP TRIGGER IF EXISTS product_variants_update_timestamp ON product_variants;
CREATE TRIGGER product_variants_update_timestamp
AFTER INSERT OR UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION update_product_updated_at();

-- 7. Enable RLS (Row Level Security) if needed
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- 8. Create policy for public read access
CREATE POLICY "Allow public read access to product_variants"
  ON product_variants
  FOR SELECT
  USING (true);

-- 9. Create policy for authenticated users to manage variants
CREATE POLICY "Allow authenticated users to insert/update/delete variants"
  ON product_variants
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Optional: Seed sample variant data
-- Example of how to insert variants:
/*
INSERT INTO product_variants (product_id, sku, color, dimensions, price, stock)
VALUES 
  ('product-id-here', 'TEAK-001', 'Natural', '2x4x8 ft', 5000.00, 20),
  ('product-id-here', 'TEAK-002', 'Brown', '2x4x10 ft', 6000.00, 15),
  ('product-id-here', 'TEAK-003', 'Dark Brown', '2x4x12 ft', 7000.00, 10);
*/
