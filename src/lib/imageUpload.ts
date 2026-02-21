import { supabase } from './supabase';

export const imageService = {
  /**
   * Upload category image to Supabase storage
   * @param file - File object from input
   * @param categoryId - Category UUID
   * @returns Public URL of uploaded image
   */
  uploadCategoryImage: async (file: File, categoryId: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${categoryId}-${Date.now()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('timber-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('timber-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading category image:', error);
      throw error;
    }
  },

  /**
   * Upload product image to Supabase storage
   * @param file - File object from input
   * @param productId - Product UUID
   * @returns Public URL of uploaded image
   */
  uploadProductImage: async (file: File, productId: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('timber-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('timber-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
  },

  /**
   * Delete image from storage
   * @param imagePath - Full path of image (e.g., 'categories/uuid-123.jpg')
   */
  deleteImage: async (imagePath: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from('timber-images')
        .remove([imagePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },
};
