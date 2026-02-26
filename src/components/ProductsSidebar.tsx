import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryService, productService } from '@/lib/api';
import { ChevronDown, X, Filter } from 'lucide-react';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ContactForm } from '@/components/ContactForm';
import { ProductDetailsModal } from '@/components/ProductDetailsModal';
import { ProductsFilter } from '@/components/ProductsFilter';
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
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<any[] | null>(null);
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
    selectedVariantIds?: string[];
  }>({ open: false, showForm: false, selectedVariantIds: [] });

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

  // Use filteredProducts from filter component, or fall back to displayProducts
  const productsToDisplay = filteredProducts ?? displayProducts;

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-250px)]">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex w-80 bg-card border-r border-border overflow-hidden flex-col" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>
          <div className="p-6">
            {/* Desktop Filter */}
            <ProductsFilter
              products={selectedCategoryId ? getProductsByCategory(selectedCategoryId) : allProducts}
              categories={categories}
              onFilterChange={setFilteredProducts}
              selectedCategory={selectedCategoryId}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto bg-background" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Mobile Filter Button */}
        <div className="lg:hidden sticky top-0 z-10 bg-card border-b border-border">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors"
          >
            <span className="font-semibold text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </span>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform ${
                showMobileFilter ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Filter Panel */}
        {showMobileFilter && (
          <div className="lg:hidden bg-card border-b border-border p-4 md:p-6 max-h-96 overflow-y-auto">
            <ProductsFilter
              products={selectedCategoryId ? getProductsByCategory(selectedCategoryId) : allProducts}
              categories={categories}
              onFilterChange={setFilteredProducts}
              selectedCategory={selectedCategoryId}
            />
          </div>
        )}

        {/* Products Grid Content */}
        <div className="p-3 md:p-4 lg:p-6">
          {productsToDisplay.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products available</p>
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4 lg:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productsToDisplay.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setShowProductDetails(true);
                }}
                className="bg-card rounded border border-border overflow-hidden hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
              >
                {/* Product Image */}
                <div className="w-full h-32 md:h-40 overflow-hidden bg-muted flex items-center justify-center">
                  {product.image_path ? (
                    <img
                      src={product.image_path}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-1">🛠️</div>
                    </div>
                  )}
                </div>

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
                        onClick={(e) => {
                          e.stopPropagation();
                          setCheckoutProduct({
                            open: true,
                            product: {
                              id: product.id,
                              name: product.name,
                              price: product.price,
                            },
                            mode: 'buy',
                          })
                        }}
                        className="flex-1 py-1.5 md:py-2 px-2 rounded text-xs md:text-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                        Buy
                      </button>
                    )}
                    {product.has_contact_us && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInquiryModal({
                            open: true,
                            product,
                            showForm: false,
                            selectedVariantIds: ['base'],
                          })
                        }}
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
            setInquiryModal({ open: false, product: undefined, showForm: false, selectedVariantIds: [] });
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

                {/* Base Product and Variants Selection */}
                {inquiryModal.product && (
                  <div className="space-y-2 border-t border-gray-200 pt-3">
                    <p className="text-xs font-semibold text-foreground">Select items:</p>
                    <div className="space-y-1.5">
                      {/* Base Product */}
                      <button
                        onClick={() => {
                          setInquiryModal((prev) => {
                            const selected = prev.selectedVariantIds || [];
                            return {
                              ...prev,
                              selectedVariantIds: selected.includes('base')
                                ? selected.filter((v) => v !== 'base')
                                : [...selected, 'base'],
                            };
                          });
                        }}
                        className={`w-full px-2 py-1.5 rounded text-xs border transition-colors text-left ${
                          inquiryModal.selectedVariantIds?.includes('base')
                            ? 'border-primary bg-primary/10 text-primary font-medium'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`flex items-center gap-2 flex-shrink-0 ${
                            inquiryModal.selectedVariantIds?.includes('base')
                              ? 'bg-primary border-primary text-white'
                              : 'border-gray-300'
                          }`}>
                            <span className={`w-3 h-3 rounded border flex items-center justify-center text-[10px] ${
                              inquiryModal.selectedVariantIds?.includes('base')
                                ? 'bg-primary border-primary text-white'
                                : 'border-gray-300'
                            }`}>
                              {inquiryModal.selectedVariantIds?.includes('base') && '✓'}
                            </span>
                          </span>
                          <span className="font-medium flex-1">
                            {inquiryModal.product.dimensions || '-'}
                          </span>
                          <span className="font-medium flex-shrink-0">₹{inquiryModal.product.price}</span>
                        </div>
                      </button>

                      {/* Variants */}
                      {inquiryModal.product.variants && inquiryModal.product.variants.length > 0 && (
                        <>
                          {inquiryModal.product.variants.map((variant: any, idx: number) => {
                            const variantObj = typeof variant === 'string' ? JSON.parse(variant) : variant;
                            const variantId = variantObj.id || `variant-${idx}`;
                            const isSelected = inquiryModal.selectedVariantIds?.includes(variantId);

                            return (
                              <button
                                key={variantId}
                                onClick={() => {
                                  setInquiryModal((prev) => {
                                    const selected = prev.selectedVariantIds || [];
                                    return {
                                      ...prev,
                                      selectedVariantIds: selected.includes(variantId)
                                        ? selected.filter((v) => v !== variantId)
                                        : [...selected, variantId],
                                    };
                                  });
                                }}
                                className={`w-full px-2 py-1.5 rounded text-xs border transition-colors text-left ${
                                  isSelected
                                    ? 'border-primary bg-primary/10 text-primary font-medium'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`flex items-center gap-2 flex-shrink-0 ${
                                    isSelected
                                      ? 'bg-primary border-primary text-white'
                                      : 'border-gray-300'
                                  }`}>
                                    <span className={`w-3 h-3 rounded border flex items-center justify-center text-[10px] ${
                                      isSelected
                                        ? 'bg-primary border-primary text-white'
                                        : 'border-gray-300'
                                    }`}>
                                      {isSelected && '✓'}
                                    </span>
                                  </span>
                                  <span className="font-medium flex-1">
                                    {variantObj.dimension}
                                  </span>
                                  <span className="font-medium flex-shrink-0">₹{variantObj.price || '-'}</span>
                                </div>
                              </button>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2 border-t border-gray-200 pt-3">
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
                  setInquiryModal({ open: false, product: undefined, showForm: false, selectedVariantIds: [] });
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
