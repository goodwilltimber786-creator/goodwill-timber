import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductsSidebar } from "@/components/ProductsSidebar";
import { WhatsAppFloating } from "@/components/WhatsAppFloating";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const whatsappNumber = "918638264329"; // Change to your WhatsApp business number

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-primary py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-display font-bold text-primary-foreground text-center">
              Our Products
            </h1>
            <p className="text-primary-foreground/70 text-center max-w-2xl mx-auto mt-3 md:mt-4 text-sm md:text-base">
              Browse our comprehensive catalog of premium timber, plywood, doors, and hardware by category
            </p>
          </div>
        </section>

        {/* Products Section with Sidebar */}
        <section className="py-8 md:py-12 bg-background">
          <div className="container mx-auto px-0 md:px-4">
            <ProductsSidebar whatsappNumber={whatsappNumber} initialCategoryId={categoryId} />
          </div>
        </section>
      </main>

      {/* WhatsApp Floating Button */}
      <WhatsAppFloating 
        phoneNumber={whatsappNumber}
        message="Hi! I'm interested in your products. Can you help me?" 
      />

      <Footer />
    </div>
  );
};

export default Products;