 import { Link } from "react-router-dom";
 import { Phone, ArrowRight } from "lucide-react";
 import { Button } from "@/components/ui/button";
 
 export function CTABanner() {
   return (
     <section className="py-20 bg-cream">
       <div className="container mx-auto px-4">
         <div className="bg-primary rounded-2xl p-10 md:p-16 text-center md:text-left">
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
             <div className="space-y-4">
               <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
                 Need Bulk Orders or<br />
                 <span className="text-accent">Custom Requirements?</span>
               </h2>
               <p className="text-primary-foreground/70 max-w-lg">
                 Our sales team is ready to help you with project-specific materials, 
                 bulk pricing, and custom specifications.
               </p>
             </div>
 
             <div className="flex flex-col sm:flex-row gap-4">
               <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                 <Link to="/contact">
                   Contact Sales Team
                   <ArrowRight className="ml-2 h-5 w-5" />
                 </Link>
               </Button>
               <Button asChild size="lg" variant="outline" className="border-2 border-primary-foreground text-black hover:bg-primary-foreground hover:text-primary">
                 <a href="tel:+918638264329">
                   <Phone className="mr-2 h-5 w-5" />
                   Call Now
                 </a>
               </Button>
             </div>
           </div>
         </div>
       </div>
     </section>
   );
 }