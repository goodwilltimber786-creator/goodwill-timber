import { supabase, Category, Product, ContactSubmission } from './supabase';

// Category Services
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<Category | null> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  create: async (category: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Omit<Category, 'id' | 'created_at'>>): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Product Services
export const productService = {
  getAll: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getByCategory: async (categoryId: string): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  create: async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Contact Submission Services
export const contactService = {
  create: async (submission: Omit<ContactSubmission, 'id' | 'created_at' | 'updated_at'>): Promise<ContactSubmission> => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([submission])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getAll: async (): Promise<ContactSubmission[]> => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getByType: async (type: 'contact' | 'order' | 'inquiry'): Promise<ContactSubmission[]> => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('submission_type', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  updateStatus: async (id: string, status: 'new' | 'viewed' | 'contacted' | 'completed'): Promise<ContactSubmission> => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
