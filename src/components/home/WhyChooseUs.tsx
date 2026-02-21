 import { Shield, Truck, Users, Award, IndianRupee, Clock } from "lucide-react";
 
 const features = [
   {
     icon: Award,
     title: "Premium Quality",
     description: "Sourced from the finest forests and mills, ensuring superior grade materials for every project.",
   },
   {
     icon: Users,
     title: "Trusted by Professionals",
     description: "Builders, architects, and contractors across India rely on us for consistent quality.",
   },
   {
     icon: Truck,
     title: "Reliable Delivery",
     description: "On-time delivery to your site with careful handling and proper packaging.",
   },
   {
     icon: IndianRupee,
     title: "Competitive Pricing",
     description: "Best value for premium materials with transparent pricing and bulk discounts.",
   },
   {
     icon: Shield,
     title: "Quality Assured",
     description: "Every product undergoes rigorous quality checks before reaching you.",
   },
   {
     icon: Clock,
     title: "40+ Years Experience",
     description: "Four decades of expertise serving the construction and interior industry.",
   },
 ];
 
 export function WhyChooseUs() {
   return (
     <section className="py-20 bg-cream">
       <div className="container mx-auto px-4">
         {/* Section Header */}
         <div className="text-center mb-14">
           <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 accent-underline accent-underline-center inline-block">
             Why Choose Goodwill Timbers
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto mt-8">
             We're committed to providing the best quality materials and service 
             to help you build with confidence.
           </p>
         </div>
 
         {/* Features Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
           {features.map((feature, index) => (
             <div
               key={index}
               className="bg-card rounded-lg p-8 shadow-card card-hover"
             >
               <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                 <feature.icon className="h-7 w-7 text-accent" />
               </div>
               <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                 {feature.title}
               </h3>
               <p className="text-muted-foreground text-sm leading-relaxed">
                 {feature.description}
               </p>
             </div>
           ))}
         </div>
       </div>
     </section>
   );
 }