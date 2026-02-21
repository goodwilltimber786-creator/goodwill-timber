import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryService, productService } from '@/lib/api';
import { ChevronDown } from 'lucide-react';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ContactForm } from '@/components/ContactForm';
import { ProductDetailsModal } from '@/components/ProductDetailsModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MessageCircle, ShoppingCart, Phone, Mail } from 'lucide-react';

interface ProductModalProps {
  whatsappNumber: string;
}

export const ProductsSidebar = ({ whatsappNumber }: ProductModalProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<{
    open: boolean;
    product?: { id: string; name: string; price: number };
    mode?: 'buy' | 'inquiry';
    selectedItems?: any[];
    metadata?: any;
  }>({ open: false });
  const [inquiryModal, setInquiryModal] = useState<{
    open: boolean;
    product?: any;
    showForm: boolean;
  }>({ open: false, showForm: false });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const getProductsByCategory = (categoryId: string) => {
    return allProducts.filter((p) => p.category_id === categoryId);
  };

  // Filter products based on selected category
  const displayProducts = selectedCategoryId 
    ? getProductsByCategory(selectedCategoryId)
    : allProducts;

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-250px)]">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex w-64 bg-background border-r border-border overflow-hidden flex-col" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>
          <div className="p-6 space-y-6">
            {categoriesLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No categories available</p>
              </div>
            ) : (
              categories.map((category) => {
                const products = getProductsByCategory(category.id);
                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-start gap-3 pb-3 border-b border-border">
                      {category.image_path && (
                        <img
                          src={category.image_path}
                          alt={category.name}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">
                          {category.name}
                        </h3>
                        <span className="inline-block mt-1 text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {products.length} products
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 pl-4 border-l border-border">
                      {products.map((product) => (
                        <button
                          key={product.id}
                          className="w-full text-left py-2 px-3 rounded text-sm text-foreground hover:bg-muted transition-colors font-medium"
                          title={product.name}
                        >
                          {product.name}
                        </button>
                      ))}
                      {products.length === 0 && (
                        <p className="text-xs text-muted-foreground py-2 px-3 italic">
                          No products
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto bg-background" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Mobile Category Filter */}
        <div className="lg:hidden sticky top-0 z-10 bg-background border-b border-border">
          <button
            onClick={() => setShowMobileCategories(!showMobileCategories)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors"
          >
            <span className="font-semibold text-foreground">
              {selectedCategoryId
                ? categories.find((c) => c.id === selectedCategoryId)?.name ||
                  'Filter by Category'
                : 'All Products'}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform ${
                showMobileCategories ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showMobileCategories && (
            <div className="border-t border-border bg-muted">
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setShowMobileCategories(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                  !selectedCategoryId
                    ? 'bg-primary/10 text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setShowMobileCategories(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    selectedCategoryId === category.id
                      ? 'bg-primary/10 text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid Content */}
        <div className="p-3 md:p-4 lg:p-6">
          {displayProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products available</p>
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4 lg:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setShowProductDetails(true);
                }}
                className="bg-card rounded border border-border overflow-hidden hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
              >
                {/* Product Image */}
                {product.image_path && (
                  <div className="w-full h-32 md:h-40 overflow-hidden bg-muted">
                    <img
                      src={product.image_path}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-3 md:p-4 flex flex-col h-full">
                  {/* Product Name */}
                  <h3 className="text-sm md:text-base font-semibold text-foreground mb-1 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Product Description */}
                  {product.description && (
                    <p className="text-xs text-muted-foreground mb-2 flex-grow line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="mb-3 pt-1 border-t border-border">
                    <p className="text-sm md:text-base font-semibold text-foreground">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    {product.has_buy_now && (
                      <button
                        onClick={() =>
                          setCheckoutProduct({
                            open: true,
                            product: {
                              id: product.id,
                              name: product.name,
                              price: product.price,
                            },
                            mode: 'buy',
                          })
                        }
                        className="flex-1 py-1.5 md:py-2 px-2 rounded text-xs md:text-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                        Buy
                      </button>
                    )}
                    {product.has_contact_us && (
                      <button
                        onClick={() =>
                          setInquiryModal({
                            open: true,
                            product,
                            showForm: false,
                          })
                        }
                        className="flex-1 py-1.5 md:py-2 px-2 rounded text-xs md:text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                        Ask
                      </button>
                    )}
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutProduct.product && (
        <CheckoutModal
          open={checkoutProduct.open}
          onOpenChange={(open) =>
            setCheckoutProduct({
              open,
              product: checkoutProduct.product,
              mode: checkoutProduct.mode,
            })
          }
          product={checkoutProduct.product}
          whatsappNumber={whatsappNumber}
          mode={checkoutProduct.mode}
        />
      )}

      {/* Inquiry Modal */}
      <Dialog
        open={inquiryModal.open}
        onOpenChange={(open) => {
          if (!open) {
            setInquiryModal({ open: false, product: undefined, showForm: false });
          }
        }}
      >
        <DialogContent className="max-w-md">
          {!inquiryModal.showForm ? (
            <>
              <DialogHeader>
                <DialogTitle>How can we help?</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {inquiryModal.product && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">{inquiryModal.product.name}</p>
                    <p className="text-sm text-gray-600">₹{inquiryModal.product.price}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      setInquiryModal((prev) => ({
                        ...prev,
                        showForm: true,
                      }))
                    }
                    className="w-full py-2.5 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send Inquiry
                  </button>
                  <a
                    href={`tel:${whatsappNumber.replace(/\D/g, '')}`}
                    className="w-full py-2.5 px-4 rounded border border-gray-300 hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 text-gray-700"
                  >
                    <Phone className="w-4 h-4" />
                    Call Us
                  </a>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                      inquiryModal.product
                        ? `Hi! I'm interested in "${inquiryModal.product.name}" (₹${inquiryModal.product.price}). Can you provide more details?`
                        : 'Hi! Can you help me with your products?'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded border border-gray-300 hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 text-gray-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Send us your inquiry</DialogTitle>
              </DialogHeader>
              <ContactForm
                productId={inquiryModal.product?.id}
                productName={inquiryModal.product?.name}
                type="inquiry"
                hideEmail={true}
                onSuccess={() => {
                  setInquiryModal({ open: false, product: undefined, showForm: false });
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Details Modal */}
      <ProductDetailsModal
        open={showProductDetails}
        onOpenChange={setShowProductDetails}
        product={selectedProduct}
        whatsappNumber={whatsappNumber}
        onBuyNow={(selectedProducts: any, metadata: any) => {
          // selectedProducts can be an array or a single product
          const mainProduct = Array.isArray(selectedProducts) ? selectedProducts[0] : selectedProducts;
          setCheckoutProduct({
            open: true,
            product: {
              id: mainProduct.id,
              name: mainProduct.name,
              price: metadata?.totalPrice || mainProduct.price,
            },
            mode: 'buy',
            selectedItems: selectedProducts,
            metadata: metadata,
          });
        }}
      />
    </div>
  );
};
