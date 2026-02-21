import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type Category = {
  id: string;
  name: string;
  description: string | null;
  image_path: string | null;
  created_at: string;
};

export type ProductVariant = {
  id: string;
  dimension: string;
  price?: number;
  sku?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  image_path: string | null;
  dimensions?: string | null;
  sku?: string | null;
  has_buy_now: boolean;
  has_contact_us: boolean;
  is_featured: boolean;
  variants?: ProductVariant[] | null;
  created_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  message?: string;
  quantity?: number;
  product_id?: string | null;
  product_name?: string;
  submission_type: 'contact' | 'order' | 'inquiry';
  status: 'new' | 'viewed' | 'contacted' | 'completed';
  total_amount?: number;
  source: 'website' | 'telegram';
  created_at: string;
  updated_at: string;
};
