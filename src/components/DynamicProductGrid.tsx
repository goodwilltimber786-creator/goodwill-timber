import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryService, productService } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckoutModal } from '@/components/CheckoutModal';
import { MessageCircle, ShoppingCart } from 'lucide-react';

export const DynamicProductGrid = ({ whatsappNumber = '919876543210' }: { whatsappNumber?: string }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<{
    open: boolean;
    product?: { id: string; name: string; price: number };
    mode?: 'buy' | 'inquiry';
  }>({ open: false });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const displayedProducts = selectedCategory
    ? allProducts.filter((p) => p.category_id === selectedCategory)
    : allProducts;

  return (
    <div className="space-y-8">
      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
              className={`cursor-pointer transition-all ${
                !selectedCategory
                  ? 'ring-2 ring-blue-600 border-blue-600'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">All Products</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {allProducts.length} products
                </p>
              </CardContent>
            </Card>

            {categories.map((category) => {
              const categoryProductCount = allProducts.filter(
                (p) => p.category_id === category.id
              ).length;

              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all ${
                    selectedCategory === category.id
                      ? 'ring-2 ring-blue-600 border-blue-600'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6">
                    {category.image_path && (
                      <img
                        src={category.image_path}
                        alt={category.name}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {categoryProductCount} products
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : 'All Products'}
        </h2>

        {displayedProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No products available in this category.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedProducts.map((product) => (
              <Card key={product.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                {product.image_path && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                      src={product.image_path}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 flex-grow">
                      {product.description}
                    </p>
                  )}

                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>

                  <div className="flex gap-2">
                    {product.has_buy_now && (
                      <Button
                        className="flex-1"
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
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                    )}

                    {product.has_contact_us && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          setCheckoutProduct({
                            open: true,
                            product: {
                              id: product.id,
                              name: product.name,
                              price: product.price,
                            },
                            mode: 'inquiry',
                          })
                        }
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Inquiry
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
    </div>
  );
};
