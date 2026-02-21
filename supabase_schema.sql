-- ============================================================================
-- TIMBER STRONG - COMPLETE DATABASE SCHEMA
-- Fresh database creation with all tables and policies
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP EXISTING OBJECTS (Clean Slate)
-- ============================================================================

-- Drop triggers first
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_submissions_updated_at ON contact_submissions;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop policies
DROP POLICY IF EXISTS categories_select_policy ON categories;
DROP POLICY IF EXISTS products_select_policy ON products;
DROP POLICY IF EXISTS submissions_insert_policy ON contact_submissions;
DROP POLICY IF EXISTS submissions_select_policy ON contact_submissions;

-- Drop tables (with cascade to remove dependencies)
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ============================================================================
-- STEP 2: CREATE TABLES (Fresh)
-- ============================================================================

-- CATEGORIES TABLE
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_path VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- PRODUCTS TABLE
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  image_path VARCHAR(512),
  has_buy_now BOOLEAN DEFAULT true,
  has_contact_us BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CONTACT SUBMISSIONS TABLE (ENHANCED)
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  message TEXT,
  quantity INTEGER,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255),
  submission_type VARCHAR(20) CHECK (submission_type IN ('contact', 'order', 'inquiry')),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'contacted', 'completed')),
  total_amount NUMERIC(10, 2),
  source VARCHAR(20) DEFAULT 'website' CHECK (source IN ('website', 'telegram')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- STEP 3: CREATE INDEXES
-- ============================================================================

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_submissions_product_id ON contact_submissions(product_id);
CREATE INDEX idx_submissions_type ON contact_submissions(submission_type);
CREATE INDEX idx_submissions_created_at ON contact_submissions(created_at DESC);

-- ============================================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: CREATE RLS POLICIES
-- ============================================================================

-- Categories: Everyone can read
CREATE POLICY categories_select_policy ON categories
  FOR SELECT USING (true);

-- Categories: Everyone can insert
CREATE POLICY categories_insert_policy ON categories
  FOR INSERT WITH CHECK (true);

-- Categories: Everyone can update
CREATE POLICY categories_update_policy ON categories
  FOR UPDATE USING (true) WITH CHECK (true);

-- Categories: Everyone can delete
CREATE POLICY categories_delete_policy ON categories
  FOR DELETE USING (true);

-- Products: Everyone can read
CREATE POLICY products_select_policy ON products
  FOR SELECT USING (true);

-- Products: Everyone can insert
CREATE POLICY products_insert_policy ON products
  FOR INSERT WITH CHECK (true);

-- Products: Everyone can update
CREATE POLICY products_update_policy ON products
  FOR UPDATE USING (true) WITH CHECK (true);

-- Products: Everyone can delete
CREATE POLICY products_delete_policy ON products
  FOR DELETE USING (true);

-- Contact Submissions: Everyone can insert
CREATE POLICY submissions_insert_policy ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Contact Submissions: Everyone can read
CREATE POLICY submissions_select_policy ON contact_submissions
  FOR SELECT USING (true);

-- Contact Submissions: Everyone can update (for status changes)
CREATE POLICY submissions_update_policy ON contact_submissions
  FOR UPDATE USING (true) WITH CHECK (true);

-- Contact Submissions: Everyone can delete
CREATE POLICY submissions_delete_policy ON contact_submissions
  FOR DELETE USING (true);

-- ============================================================================
-- STEP 6: CREATE UTILITY FUNCTIONS
-- ============================================================================

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 7: CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at 
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- STEP 8: INSERT SAMPLE DATA (Optional - Uncomment to use)
-- ============================================================================

/*
-- Insert 6 categories
INSERT INTO categories (name, description, image_url) VALUES
('Timber', 'Premium quality timber and wood products', 'https://via.placeholder.com/300x200?text=Timber'),
('Hardware', 'High-quality hardware and fittings', 'https://via.placeholder.com/300x200?text=Hardware'),
('Plywood', 'Durable and affordable plywood sheets', 'https://via.placeholder.com/300x200?text=Plywood'),
('Fittings', 'Professional grade fittings and accessories', 'https://via.placeholder.com/300x200?text=Fittings'),
('Doors', 'Premium wooden and composite doors', 'https://via.placeholder.com/300x200?text=Doors'),
('Bulk Materials', 'Large quantity orders and bulk supplies', 'https://via.placeholder.com/300x200?text=Bulk');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_url, has_buy_now, has_contact_us) VALUES
('Premium Teak Wood', 'High quality teak timber, per cubic meter', 8500.00, (SELECT id FROM categories WHERE name='Timber' LIMIT 1), 'https://via.placeholder.com/300x200?text=Teak+Wood', true, true),
('Sheesham Wood Board', 'Hardwood boards suitable for furniture', 3200.00, (SELECT id FROM categories WHERE name='Timber' LIMIT 1), 'https://via.placeholder.com/300x200?text=Sheesham', true, false),
('Wood Screws (Box)', 'Assorted wood screws, 1kg box', 450.00, (SELECT id FROM categories WHERE name='Hardware' LIMIT 1), 'https://via.placeholder.com/300x200?text=Screws', true, true),
('Cabinet Hinges', 'Steel cabinet hinges, pair', 220.00, (SELECT id FROM categories WHERE name='Fittings' LIMIT 1), 'https://via.placeholder.com/300x200?text=Hinges', true, false),
('Plywood Sheet (18mm)', '18mm birch plywood sheet', 1800.00, (SELECT id FROM categories WHERE name='Plywood' LIMIT 1), 'https://via.placeholder.com/300x200?text=Plywood+18mm', true, true),
('Wooden Main Door', 'Solid wood main entrance door', 12500.00, (SELECT id FROM categories WHERE name='Doors' LIMIT 1), 'https://via.placeholder.com/300x200?text=Main+Door', false, true);
*/

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify setup)
-- ============================================================================

-- Check categories table
-- SELECT * FROM categories;

-- Check products table
-- SELECT p.id, p.name, p.price, c.name as category FROM products p LEFT JOIN categories c ON p.category_id = c.id;

-- Check submissions table
-- SELECT * FROM contact_submissions;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
