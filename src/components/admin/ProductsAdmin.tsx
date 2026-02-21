import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, categoryService } from '@/lib/api';
import { imageService } from '@/lib/imageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Edit2, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_path: string;
  has_buy_now: boolean;
  has_contact_us: boolean;
  is_featured: boolean;
}

export const ProductsAdmin = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    image_path: '',
    has_buy_now: true,
    has_contact_us: true,
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductForm) =>
      productService.create({
        name: data.name,
        description: data.description || null,
        price: data.price,
        category_id: data.category_id,
        image_path: data.image_path || null,
        has_buy_now: data.has_buy_now,
        has_contact_us: data.has_contact_us,
        is_featured: data.is_featured,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setFormData({
        name: '',
        description: '',
        price: 0,
        category_id: '',
        image_path: '',
        has_buy_now: true,
        has_contact_us: true,
        is_featured: false,
      });
      setImageFile(null);
      setImagePreview('');
      setOpen(false);
      toast.success('Product created successfully');
    },
    onError: () => {
      toast.error('Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductForm }) =>
      productService.update(id, {
        name: data.name,
        description: data.description || null,
        price: data.price,
        category_id: data.category_id,
        image_path: data.image_path || null,
        has_buy_now: data.has_buy_now,
        has_contact_us: data.has_contact_us,
        is_featured: data.is_featured,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category_id: '',
        image_path: '',
        has_buy_now: true,
        has_contact_us: true,
        is_featured: false,
      });
      setImageFile(null);
      setImagePreview('');
      setOpen(false);
      toast.success('Product updated successfully');
    },
    onError: () => {
      toast.error('Failed to update product');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category_id: product.category_id,
        image_path: product.image_path || '',
        has_buy_now: product.has_buy_now,
        has_contact_us: product.has_contact_us,
        is_featured: product.is_featured,
      });
      setImagePreview(product.image_path || '');
      setEditingId(productId);
      setOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }
    if (formData.price < 0) {
      toast.error('Price cannot be negative');
      return;
    }

    try {
      let imagePath = formData.image_path;

      if (imageFile) {
        setIsUploading(true);
        const fileId = editingId || `new-${Date.now()}`;
        imagePath = await imageService.uploadProductImage(imageFile, fileId);
        setIsUploading(false);
      }

      const dataToSubmit = {
        ...formData,
        image_path: imagePath,
      };

      if (editingId) {
        updateMutation.mutate({ id: editingId, data: dataToSubmit });
      } else {
        createMutation.mutate(dataToSubmit);
      }
    } catch (error) {
      setIsUploading(false);
      toast.error('Failed to upload image');
      console.error(error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category_id: '',
        image_path: '',
        has_buy_now: true,
        has_contact_us: true,
        is_featured: false,
      });
      setImageFile(null);
      setImagePreview('');
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  if (isLoadingProducts) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory and pricing</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingId(null)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-primary font-display">
                {editingId ? '✏️ Edit Product' : '➕ Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Product Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Premium Teak Wood"
                  className="border-border focus:border-accent focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Category *
                </label>
                <Select value={formData.category_id} onValueChange={(value) =>
                  setFormData({ ...formData, category_id: value })
                }>
                  <SelectTrigger className="border-border focus:border-accent focus:ring-accent">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Price (₹) *
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0"
                  min="0"
                  className="border-border focus:border-accent focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your product..."
                  rows={3}
                  className="border-border focus:border-accent focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  📸 Product Image
                </label>
                <div className="space-y-2">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-border"
                    />
                  )}
                  <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors bg-muted/30">
                    <Upload className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm text-primary">
                      {imageFile ? imageFile.name : 'Click to upload image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-border">
                <p className="text-sm font-medium text-primary">Available Options</p>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="buy_now"
                    checked={formData.has_buy_now}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, has_buy_now: checked as boolean })
                    }
                  />
                  <label htmlFor="buy_now" className="text-sm font-medium text-muted-foreground cursor-pointer">
                    🛒 Enable "Buy Now" button
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="contact_us"
                    checked={formData.has_contact_us}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, has_contact_us: checked as boolean })
                    }
                  />
                  <label htmlFor="contact_us" className="text-sm font-medium text-muted-foreground cursor-pointer">
                    📧 Enable "Contact Us" button
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked as boolean })
                    }
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-muted-foreground cursor-pointer">
                    ⭐ Mark as Featured Product
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="text-primary border-border hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    createMutation.isPending || updateMutation.isPending || isUploading
                  }
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isUploading ? 'Uploading...' : editingId ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        {isLoadingProducts ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 border-b border-border">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-primary font-semibold">Product Name</TableHead>
                  <TableHead className="text-primary font-semibold">Category</TableHead>
                  <TableHead className="text-primary font-semibold">Price</TableHead>
                  <TableHead className="text-primary font-semibold">Buy Now 🛒</TableHead>
                  <TableHead className="text-primary font-semibold">Contact Us 📧</TableHead>
                  <TableHead className="text-primary font-semibold w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/30 border-border">
                    <TableCell className="font-medium text-primary max-w-xs truncate">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{getCategoryName(product.category_id)}</TableCell>
                    <TableCell className="font-semibold text-primary">₹{product.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      {product.has_buy_now ? (
                        <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                          ✓ Enabled
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Disabled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.has_contact_us ? (
                        <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-medium">
                          ✓ Enabled
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Disabled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="p-1.5 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(product.id)}
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          disabled={deleteMutation.isPending}
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">📦</p>
            <p className="text-lg text-primary font-medium">No products yet</p>
            <p className="text-muted-foreground mt-2">Create your first product to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
