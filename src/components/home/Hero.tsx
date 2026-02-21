 import { Link } from "react-router-dom";
 import { ArrowRight } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import heroImage from "@/assets/hero-timber.jpg";
 
 export function Hero() {
   return (
     <section className="relative min-h-[90vh] flex items-center">
       {/* Background Image */}
       <div
         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: `url(${heroImage})` }}
       >
         <div className="hero-overlay absolute inset-0" />
       </div>
 
       {/* Content */}
       <div className="relative container mx-auto px-4 py-20">
         <div className="max-w-3xl space-y-8">
           <div className="space-y-2 animate-fade-up">
             <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent text-sm font-medium rounded-full">
               Premium Quality Since 1985
             </span>
           </div>
 
           <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-primary-foreground leading-tight text-shadow-lg animate-fade-up" style={{ animationDelay: "0.1s" }}>
             Premium Timber &<br />
             <span className="text-accent">Hardware Solutions</span><br />
             for Every Build
           </h1>
 
           <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
             From raw timber to finished hardware — quality materials you can trust. 
             Serving builders, architects, and contractors across India.
           </p>
 
           <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
             <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8">
               <Link to="/categories">
                 Explore Products
                 <ArrowRight className="ml-2 h-5 w-5" />
               </Link>
             </Button>
             <Button asChild size="lg" variant="outline" className="border-2 border-primary-foreground text-black hover:bg-primary-foreground/10 text-base px-8 font-semibold bg-white">
               <Link to="/contact">
                 Get a Quote
               </Link>
             </Button>
           </div>
         </div>
       </div>

       {/* Scroll Indicator - Removed */}
     </section>
   );
 }