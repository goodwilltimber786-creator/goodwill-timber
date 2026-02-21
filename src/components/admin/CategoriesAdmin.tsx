import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/lib/api';
import { imageService } from '@/lib/imageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit2, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryForm {
  name: string;
  description: string;
  image_path: string;
}

export const CategoriesAdmin = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    description: '',
    image_path: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CategoryForm) =>
      categoryService.create({
        name: data.name,
        description: data.description || null,
        image_path: data.image_path || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setFormData({ name: '', description: '', image_path: '' });
      setImageFile(null);
      setImagePreview('');
      setOpen(false);
      toast.success('Category created successfully');
    },
    onError: () => {
      toast.error('Failed to create category');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryForm }) =>
      categoryService.update(id, {
        name: data.name,
        description: data.description || null,
        image_path: data.image_path || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      setFormData({ name: '', description: '', image_path: '' });
      setImageFile(null);
      setImagePreview('');
      setOpen(false);
      toast.success('Category updated successfully');
    },
    onError: () => {
      toast.error('Failed to update category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete category');
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

  const handleEdit = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        image_path: category.image_path || '',
      });
      setImagePreview(category.image_path || '');
      setEditingId(categoryId);
      setOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      let imagePath = formData.image_path;

      if (imageFile) {
        setIsUploading(true);
        // Use category id or timestamp for unique filename
        const fileId = editingId || `new-${Date.now()}`;
        imagePath = await imageService.uploadCategoryImage(imageFile, fileId);
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
      setFormData({ name: '', description: '', image_path: '' });
      setImageFile(null);
      setImagePreview('');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage your product categories</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingId(null)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary font-display">
                {editingId ? '✏️ Edit Category' : '➕ Create New Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Category Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Timber, Hardware"
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
                  placeholder="Write a brief description for this category..."
                  rows={3}
                  className="border-border focus:border-accent focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  📸 Category Image
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
                  {isUploading ? 'Uploading...' : editingId ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-32 bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-shadow border border-border bg-white overflow-hidden">
              <div className="relative h-32 bg-muted overflow-hidden">
                {category.image_path ? (
                  <img
                    src={category.image_path}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
                    <span className="text-3xl">📁</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg text-primary font-display">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category.id)}
                    className="flex-1 text-primary border-border hover:bg-muted"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(category.id)}
                    disabled={deleteMutation.isPending}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-border bg-gradient-to-br from-muted/30 to-background">
          <CardContent className="text-center py-12">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-lg text-primary font-medium">No categories yet</p>
            <p className="text-muted-foreground mt-2">Create your first category to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
