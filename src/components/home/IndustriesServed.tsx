 import { Building2, Home, Paintbrush, HardHat, Users, Store } from "lucide-react";
 
 const industries = [
   {
     icon: Building2,
     name: "Builders & Developers",
     description: "Residential & commercial projects",
   },
   {
     icon: Paintbrush,
     name: "Architects & Designers",
     description: "Custom material specifications",
   },
   {
     icon: HardHat,
     name: "Contractors",
     description: "Project-based bulk supplies",
   },
   {
     icon: Home,
     name: "Retail Customers",
     description: "Home improvement needs",
   },
   {
     icon: Store,
     name: "Commercial Projects",
     description: "Office & retail interiors",
   },
   {
     icon: Users,
     name: "Interior Designers",
     description: "Premium finish materials",
   },
 ];
 
 export function IndustriesServed() {
   return (
     <section className="py-20 bg-wood text-wood-foreground">
       <div className="container mx-auto px-4">
         {/* Section Header */}
         <div className="text-center mb-14">
           <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 accent-underline accent-underline-center inline-block">
             Industries We Serve
           </h2>
           <p className="text-wood-foreground/70 max-w-2xl mx-auto mt-8">
             From individual homeowners to large-scale developers, we provide 
             tailored solutions for every segment of the construction industry.
           </p>
         </div>
 
         {/* Industries Grid */}
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
           {industries.map((industry, index) => (
             <div
               key={index}
               className="text-center p-6 rounded-lg bg-wood-light/20 hover:bg-wood-light/30 transition-colors"
             >
               <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-4">
                 <industry.icon className="h-8 w-8 text-accent" />
               </div>
               <h3 className="font-display font-semibold text-sm mb-1">
                 {industry.name}
               </h3>
               <p className="text-xs text-wood-foreground/60">
                 {industry.description}
               </p>
             </div>
           ))}
         </div>
       </div>
     </section>
   );
 }