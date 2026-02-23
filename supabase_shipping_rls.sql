-- ============================================================================
-- RLS POLICIES FOR SHIPPING_METHODS TABLE
-- ============================================================================

-- Enable RLS on shipping_methods table if not already enabled
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS shipping_methods_select_policy ON shipping_methods;
DROP POLICY IF EXISTS shipping_methods_insert_policy ON shipping_methods;
DROP POLICY IF EXISTS shipping_methods_update_policy ON shipping_methods;
DROP POLICY IF EXISTS shipping_methods_delete_policy ON shipping_methods;

-- Shipping Methods: Everyone can read
CREATE POLICY shipping_methods_select_policy ON shipping_methods
  FOR SELECT USING (true);

-- Shipping Methods: Everyone can insert (for admin to create shipping methods)
CREATE POLICY shipping_methods_insert_policy ON shipping_methods
  FOR INSERT WITH CHECK (true);

-- Shipping Methods: Everyone can update (for admin to modify shipping methods)
CREATE POLICY shipping_methods_update_policy ON shipping_methods
  FOR UPDATE USING (true) WITH CHECK (true);

-- Shipping Methods: Everyone can delete (for admin to remove shipping methods)
CREATE POLICY shipping_methods_delete_policy ON shipping_methods
  FOR DELETE USING (true);

-- ============================================================================
-- EXPLANATION
-- ============================================================================
-- These policies allow full CRUD operations on the shipping_methods table.
-- For production, you should restrict these to authenticated users only:
--
-- Alternative (RECOMMENDED for production):
-- CREATE POLICY shipping_methods_admin_only ON shipping_methods
--   FOR ALL USING (auth.role() = 'authenticated');
--
-- This would require users to be logged in. You'd need to set up
-- proper JWT claims or use a custom admin check.
-- ============================================================================
