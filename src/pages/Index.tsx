import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { IndustriesServed } from "@/components/home/IndustriesServed";
import { Stats } from "@/components/home/Stats";
import { CTABanner } from "@/components/home/CTABanner";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <CategoryGrid />
        <WhyChooseUs />
        <FeaturedProducts />
        <IndustriesServed />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
