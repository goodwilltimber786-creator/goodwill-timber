import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { contactService, productService } from '@/lib/api';
import { sendTelegramNotification, formatOrderNotification } from '@/lib/telegram';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

interface SelectedProduct {
  productId: string;
  productName: string;
  quantity: number;
}

interface ContactFormProps {
  productName?: string;
  productId?: string;
  type: 'contact' | 'order' | 'inquiry';
  hideEmail?: boolean;
  onSuccess?: () => void;
}

export const ContactForm = ({
  productName,
  productId,
  type,
  hideEmail = false,
  onSuccess,
}: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    productId && productName ? [{ productId, productName, quantity: 1 }] : []
  );

  // Fetch products for sidebar
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Create product list message
      const productsList = selectedProducts
        .map((p) => `• ${p.productName} (Qty: ${p.quantity})`)
        .join('\n');
      
      const finalMessage = productsList 
        ? `${data.message}\n\n📦 Selected Products:\n${productsList}`
        : data.message;

      // Save to database
      const submission = await contactService.create({
        name: data.name,
        email: data.email || 'not-provided@inquiry.local',
        phone: data.phone,
        message: finalMessage,
        product_id: selectedProducts[0]?.productId || null,
        submission_type: type,
        status: 'new',
        source: 'website',
      });

      // Send Telegram notification
      const telegramMessage = formatOrderNotification({
        name: data.name,
        email: data.email || 'N/A',
        phone: data.phone,
        message: finalMessage,
        productName: selectedProducts.map((p) => p.productName).join(', ') || productName,
        type: type,
      });

      await sendTelegramNotification(telegramMessage);

      return submission;
    },
    onSuccess: () => {
      toast.success(
        type === 'order'
          ? 'Order submitted successfully! We will contact you soon.'
          : 'Thank you for your inquiry! We will get back to you soon.'
      );
      setFormData({ name: '', email: '', phone: '', message: '' });
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Form submission error:', error);
      toast.error('Failed to submit. Please try again.');
    },
  });

  const toggleProduct = (product: any) => {
    const exists = selectedProducts.find((p) => p.productId === product.id);
    if (exists) {
      setSelectedProducts(selectedProducts.filter((p) => p.productId !== product.id));
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { productId: product.id, productName: product.name, quantity: 1 },
      ]);
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId ? { ...p, quantity } : p
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!hideEmail && !formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Message is required');
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="flex gap-6">
      {/* Product Sidebar */}
      <div className="hidden lg:block w-48 flex-shrink-0">
        <div className="sticky top-4 space-y-3 max-h-[600px] overflow-y-auto">
          <h3 className="font-semibold text-foreground text-sm">Select Products</h3>
          <div className="space-y-2">
            {products.map((product) => {
              const isSelected = selectedProducts.some((p) => p.productId === product.id);
              return (
                <div
                  key={product.id}
                  className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleProduct(product)}
                >
                  {product.image_path && (
                    <img
                      src={product.image_path}
                      alt={product.name}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                  )}
                  <p className="text-xs font-medium text-foreground truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">₹{product.price}</p>
                  {isSelected && (
                    <div className="mt-2 flex items-center gap-1">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-primary">Selected</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-4">
        <div>
          <Label htmlFor="name" className="font-medium mb-1 text-foreground">
            Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your full name"
            disabled={mutation.isPending}
            className="border-border focus:border-primary"
          />
        </div>

        {!hideEmail && (
          <div>
            <Label htmlFor="email" className="font-medium mb-1 text-foreground">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              disabled={mutation.isPending}
              className="border-border focus:border-primary"
            />
          </div>
        )}

        <div>
          <Label htmlFor="phone" className="font-medium mb-1 text-foreground">
            Phone Number *
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            disabled={mutation.isPending}
            className="border-border focus:border-primary"
          />
        </div>

        {/* Selected Products Section */}
        {selectedProducts.length > 0 && (
          <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
            <p className="text-sm font-semibold text-foreground mb-3">Selected Products</p>
            <div className="space-y-2">
              {selectedProducts.map((selected) => (
                <div key={selected.productId} className="flex items-center gap-2 bg-background p-2 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{selected.productName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateProductQuantity(selected.productId, selected.quantity - 1)
                      }
                      className="px-2 py-1 text-xs bg-muted rounded hover:bg-muted/80"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {selected.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateProductQuantity(selected.productId, selected.quantity + 1)
                      }
                      className="px-2 py-1 text-xs bg-muted rounded hover:bg-muted/80"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedProducts(
                          selectedProducts.filter((p) => p.productId !== selected.productId)
                        )
                      }
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="message" className="font-medium mb-1 text-foreground">
            Message *
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Your message or requirements..."
            rows={4}
            disabled={mutation.isPending}
            className="border-border focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-2.5 px-4 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending
            ? 'Submitting...'
            : type === 'order'
              ? 'Place Order'
              : 'Send Message'}
        </button>
      </form>
    </div>
  );
};
