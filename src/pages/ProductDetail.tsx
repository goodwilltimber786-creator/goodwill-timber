import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService, categoryService } from "@/lib/api";
import { ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'buy' | 'inquiry'>('inquiry');

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id || ""),
    enabled: !!id,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Product";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-20">
          <div className="container mx-auto px-4 text-center">
            <Loader2 className="inline-block h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground mt-4">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-display font-bold text-foreground mb-4">
              Product Not Found
            </h1>
            <p className="text-muted-foreground mb-6">Sorry, we couldn't find the product you're looking for.</p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <section className="bg-muted py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/products" className="hover:text-foreground transition-colors">
                Products
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-muted shadow-lg">
                {product.image_path ? (
                  <img
                    src={product.image_path}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <span className="text-sm font-medium text-accent uppercase tracking-wider">
                    {getCategoryName(product.category_id)}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
                    {product.name}
                  </h1>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
                  <p className="text-muted-foreground text-sm mb-1">Price</p>
                  <p className="text-4xl font-display font-bold text-primary">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Prices may vary based on quantity and specifications</p>
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-2">About This Product</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <Card className="bg-muted/50 p-6 border-accent/20">
                  <h3 className="font-display font-semibold text-foreground mb-4">
                    How would you like to proceed?
                  </h3>
                  <div className="space-y-3">
                    {product.has_buy_now && (
                      <Button
                        onClick={() => {
                          setModalMode('buy');
                          setCheckoutOpen(true);
                        }}
                        size="lg"
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                      >
                        🛒 Buy Now
                      </Button>
                    )}
                    {product.has_contact_us && (
                      <Button
                        onClick={() => {
                          setModalMode('inquiry');
                          setCheckoutOpen(true);
                        }}
                        variant="outline"
                        size="lg"
                        className="w-full border-primary text-primary hover:bg-primary/10"
                      >
                        📧 Send Inquiry
                      </Button>
                    )}
                    {!product.has_buy_now && !product.has_contact_us && (
                      <Button asChild size="lg" variant="outline" className="w-full">
                        <Link to="/contact">Get in Touch</Link>
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Trust Badges */}
                <div className="flex gap-4 text-sm text-muted-foreground pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <span>Authentic Products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚚</span>
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Info */}
            <div className="mt-16 pt-12 border-t border-border">
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                More Information
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="font-display font-semibold text-foreground mb-2">📋 Specifications</h3>
                  <p className="text-sm text-muted-foreground">
                    For detailed specifications and technical details, please contact our team.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="font-display font-semibold text-foreground mb-2">🎁 Bulk Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    Special pricing available for large quantity orders. Contact us for bulk quotes.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="font-display font-semibold text-foreground mb-2">💳 Payment Options</h3>
                  <p className="text-sm text-muted-foreground">
                    We accept multiple payment methods. Details will be provided during checkout.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        product={product}
        mode={modalMode}
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;