import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Variant {
  id: string;
  sku?: string;
  dimensions?: string;
  price?: number;
}

interface ProductVariantSelectorProps {
  variants: Variant[];
  productName: string;
  onAddToCart: (variant: Variant, quantity: number) => void;
}

export default function ProductVariantSelector({
  variants,
  productName,
  onAddToCart,
}: ProductVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
    onAddToCart(selectedVariant, quantity);
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border border-border">
      <div>
        <h3 className="font-semibold text-primary mb-4">Available Variants</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => {
                setSelectedVariant(variant);
                setQuantity(1);
              }}
              className={`text-left p-4 rounded-lg border-2 transition ${
                selectedVariant?.id === variant.id
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-primary">
                    {variant.dimensions && `${variant.dimensions}`}
                    {!variant.dimensions && 'Standard'}
                  </p>
                  {variant.sku && (
                    <p className="text-xs text-muted-foreground">SKU: {variant.sku}</p>
                  )}
                </div>
                {variant.price && (
                  <p className="font-bold text-accent text-lg">₹{(variant.price).toFixed(2)}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedVariant && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-primary">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-20 px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              min="1"
            />
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart {selectedVariant.price && `- ₹${(selectedVariant.price * quantity).toFixed(2)}`}
          </Button>
        </div>
      )}
    </div>
  );
}
