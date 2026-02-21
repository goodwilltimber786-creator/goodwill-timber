import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, MessageSquare, Check } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';

interface ProductDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  whatsappNumber: string;
  onBuyNow?: (product: any, selectedVariant?: any) => void;
}

export const ProductDetailsModal = ({
  open,
  onOpenChange,
  product,
  whatsappNumber,
  onBuyNow,
}: ProductDetailsModalProps) => {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);

  if (!product) return null;

  const variants = product.variants || [];
  const hasVariants = variants.length > 0;

  // Get the selected products (can be multiple)
  const getSelectedProducts = () => {
    const selected: any[] = [];

    // Add base product if selected
    if (selectedVariantIds.includes('base')) {
      selected.push({
        ...product,
        selectedType: 'base',
      });
    }

    // Add selected variants
    variants.forEach((variant: any, idx: number) => {
      const variantObj = typeof variant === 'string' ? JSON.parse(variant) : variant;
      const variantId = variantObj.id || `variant-${idx}`;
      
      if (selectedVariantIds.includes(variantId)) {
        selected.push({
          ...product,
          selectedVariant: variantObj,
          selectedType: 'variant',
          price: variantObj.price || product.price,
          sku: variantObj.sku || product.sku,
          dimension: variantObj.dimension || variantObj.dimensions,
        });
      }
    });

    return selected;
  };

  const selectedProducts = getSelectedProducts();
  const totalPrice = selectedProducts.reduce((sum: number, item: any) => sum + (item.price || product.price), 0);
  const toggleSelection = (id: string) => {
    setSelectedVariantIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          {product.image_path && (
            <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
              <img
                src={product.image_path}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Description
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Base Product Option & Variants */}
          <div className="border rounded-lg p-3">
            <h3 className="text-xs font-semibold text-foreground mb-2">
              Select Options
            </h3>
            
            {/* All Options in Compact Grid */}
            <div className="space-y-1.5">
              {/* Base Product */}
              <button
                onClick={() => toggleSelection('base')}
                className={`w-full p-2 rounded-lg border-2 transition-all text-left ${
                  selectedVariantIds.includes('base')
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">
                      {product.dimensions ? product.dimensions : 'Standard'}
                    </div>
                    {product.sku && (
                      <div className="text-xs text-muted-foreground truncate">
                        {product.sku}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="text-xs font-bold text-primary">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    {selectedVariantIds.includes('base') && (
                      <Check className="w-3 h-3 text-primary" />
                    )}
                  </div>
                </div>
              </button>

              {/* Variants */}
              {hasVariants &&
                variants.map((variant: any, idx: number) => {
                  const variantObj = typeof variant === 'string' ? JSON.parse(variant) : variant;
                  const variantId = variantObj.id || `variant-${idx}`;
                  const variantPrice = variantObj.price || product.price;
                  
                  return (
                    <button
                      key={variantId}
                      onClick={() => toggleSelection(variantId)}
                      className={`w-full p-2 rounded-lg border-2 transition-all text-left ${
                        selectedVariantIds.includes(variantId)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-foreground truncate">
                            {variantObj.dimension || variantObj.dimensions || 'Standard'}
                          </div>
                          {variantObj.sku && (
                            <div className="text-xs text-muted-foreground truncate">
                              {variantObj.sku}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className="text-xs font-bold text-primary">
                            ₹{variantPrice.toLocaleString('en-IN')}
                          </div>
                          {selectedVariantIds.includes(variantId) && (
                            <Check className="w-3 h-3 text-primary" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Selected Items Summary - Compact */}
          {selectedProducts.length > 0 && (
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/30">
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {selectedProducts.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground truncate">
                      {item.dimension || item.dimensions || 'Standard'}
                    </span>
                    <span className="font-bold text-primary flex-shrink-0">
                      ₹{(item.price || product.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary/20">
                <span className="text-xs font-semibold text-foreground">
                  Total ({selectedProducts.length} items):
                </span>
                <span className="text-sm font-bold text-primary">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!showInquiryForm && selectedProducts.length > 0 ? (
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                How can we help?
              </h3>
              
              {product.has_buy_now && (
                <Button
                  onClick={() => {
                    onBuyNow?.(selectedProducts, {
                      itemCount: selectedProducts.length,
                      totalPrice: totalPrice,
                    });
                    onOpenChange(false);
                  }}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  size="lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              )}

              {product.has_contact_us && (
                <Button
                  onClick={() => setShowInquiryForm(true)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Inquiry
                </Button>
              )}

              <a
                href={`tel:${whatsappNumber.replace(/\D/g, '')}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md border border-input hover:bg-muted transition-colors font-medium text-foreground"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hi! I'm interested in "${product.name}". Items selected: ${selectedProducts.map((item: any) => item.dimension || 'Standard').join(', ')}. Total: ₹${totalPrice}. Can you help me?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md border border-input hover:bg-muted transition-colors font-medium text-foreground"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          ) : showInquiryForm ? (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Send us your inquiry
                </h3>
                <button
                  onClick={() => setShowInquiryForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ←
                </button>
              </div>
              <ContactForm
                productId={product.id}
                productName={`${product.name} - ${selectedProducts.map((item: any) => item.dimension || 'Standard').join(', ')}`}
                type="inquiry"
                hideEmail={true}
                onSuccess={() => {
                  setShowInquiryForm(false);
                  onOpenChange(false);
                }}
              />
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Please select at least one option to proceed
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
