 import { Navbar } from "@/components/layout/Navbar";
 import { Footer } from "@/components/layout/Footer";
 import { Award, Target, Eye, Shield } from "lucide-react";
 import { Stats } from "@/components/home/Stats";
 import { CTABanner } from "@/components/home/CTABanner";
 
 import categoryBulk from "@/assets/category-bulk.jpg";
 
 const About = () => {
   return (
     <div className="min-h-screen">
       <Navbar />
       <main>
         {/* Header */}
         <section className="bg-primary py-12 md:py-16 lg:py-20">
           <div className="container mx-auto px-4">
             <h1 className="text-2xl md:text-3xl lg:text-5xl font-display font-bold text-primary-foreground text-center">
               About Goodwill Timbers
             </h1>
             <p className="text-primary-foreground/70 text-center max-w-2xl mx-auto mt-3 md:mt-4 text-sm md:text-base">
               Four decades of excellence in premium timber and construction materials
             </p>
           </div>
         </section>

         {/* Story Section */}
         <section className="py-12 md:py-16 lg:py-20 bg-background">
           <div className="container mx-auto px-4">
             <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
               <div className="space-y-6">
                 <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground accent-underline inline-block">
                   Our Story
                 </h2>
                 <div className="space-y-3 md:space-y-4 text-muted-foreground text-sm md:text-base mt-6 md:mt-8">
                   <p>
                     Founded in 1985, Goodwill Timbers began as a small timber trading business 
                     with a simple vision: to provide the finest quality wood and construction 
                     materials to builders and homeowners across India.
                   </p>
                   <p>
                     Over four decades, we've grown from a local supplier to one of the most 
                     trusted names in the industry, serving thousands of projects ranging from 
                     residential homes to large commercial developments.
                   </p>
                   <p>
                     Today, our comprehensive catalog includes premium timber, plywood, doors, 
                     hardware, and construction fittings — everything you need to build with 
                     confidence and quality.
                   </p>
                 </div>
               </div>
               <div className="relative">
                 <img
                   src={categoryBulk}
                   alt="Goodwill Timbers Warehouse"
                   className="rounded-lg shadow-xl w-full"
                 />
                 <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-lg shadow-lg">
                   <div className="text-4xl font-display font-bold">40+</div>
                   <div className="text-sm font-medium">Years of Excellence</div>
                 </div>
               </div>
             </div>
           </div>
         </section>
 
         {/* Stats */}
         <Stats />
 
         {/* Mission & Vision */}
         <section className="py-16 md:py-20 bg-cream">
           <div className="container mx-auto px-4">
             <div className="grid md:grid-cols-2 gap-8">
               {/* Mission */}
               <div className="bg-card rounded-lg p-8 md:p-10 shadow-card">
                 <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                   <Target className="h-7 w-7 text-accent" />
                 </div>
                 <h3 className="text-2xl font-display font-bold text-foreground mb-4">Our Mission</h3>
                 <p className="text-muted-foreground leading-relaxed">
                   To be the preferred partner for quality construction materials, delivering 
                   exceptional products and service that help our customers build better, 
                   faster, and more sustainably. We strive to maintain the highest standards 
                   of integrity and customer satisfaction in every transaction.
                 </p>
               </div>
 
               {/* Vision */}
               <div className="bg-card rounded-lg p-8 md:p-10 shadow-card">
                 <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                   <Eye className="h-7 w-7 text-accent" />
                 </div>
                 <h3 className="text-2xl font-display font-bold text-foreground mb-4">Our Vision</h3>
                 <p className="text-muted-foreground leading-relaxed">
                   To become India's most trusted name in timber and construction materials, 
                   known for quality, reliability, and innovation. We envision a future where 
                   every builder and homeowner has access to premium materials that stand the 
                   test of time.
                 </p>
               </div>
             </div>
           </div>
         </section>
 
         {/* Values */}
         <section className="py-16 md:py-20 bg-background">
           <div className="container mx-auto px-4">
             <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 accent-underline accent-underline-center inline-block">
                 Our Core Values
               </h2>
             </div>
 
             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
               {[
                 { icon: Shield, title: "Quality First", desc: "Never compromising on the quality of materials we supply" },
                 { icon: Award, title: "Integrity", desc: "Honest dealings and transparent pricing in every transaction" },
                 { title: "Customer Focus", desc: "Your satisfaction is our primary measure of success" },
                 { title: "Reliability", desc: "Consistent supply and on-time delivery you can count on" },
               ].map((value, index) => (
                 <div key={index} className="text-center p-6">
                   <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4">
                     {value.icon ? (
                       <value.icon className="h-8 w-8 text-accent" />
                     ) : (
                       <span className="text-2xl font-display font-bold text-accent">{index + 1}</span>
                     )}
                   </div>
                   <h3 className="font-display font-semibold text-foreground mb-2">{value.title}</h3>
                   <p className="text-sm text-muted-foreground">{value.desc}</p>
                 </div>
               ))}
             </div>
           </div>
         </section>
 
         {/* CTA */}
         <CTABanner />
       </main>
       <Footer />
     </div>
   );
 };
 
 export default About;