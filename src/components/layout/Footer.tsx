 import { Link } from "react-router-dom";
 import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
 import { useQuery } from "@tanstack/react-query";
 import { categoryService } from "@/lib/api";
 
 const quickLinks = [
   { name: "Home", path: "/" },
   { name: "Categories", path: "/categories" },
   { name: "About Us", path: "/about" },
   { name: "Contact", path: "/contact" },
 ];
 
 export function Footer() {
   const { data: categories = [] } = useQuery({
     queryKey: ["categories"],
     queryFn: () => categoryService.getAll(),
   });

   return (
     <footer className="bg-primary text-primary-foreground">
       {/* Main Footer */}
       <div className="container mx-auto px-4 py-16">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
           {/* Company Info */}
           <div className="space-y-6">
             <div>
               <h3 className="text-2xl font-display font-bold">Goodwill</h3>
               <p className="text-sm tracking-widest text-accent uppercase">Timbers</p>
             </div>
             <p className="text-primary-foreground/70 text-sm leading-relaxed">
               Your trusted partner for premium timber, plywood, doors, and hardware solutions. 
               Serving builders, architects, and contractors with quality materials.
             </p>
             <div className="flex gap-4">
               <a href="https://wa.me/918638264329" className="text-primary-foreground/60 hover:text-accent transition-colors">
                 <MessageCircle className="h-5 w-5" />
               </a>
               <a href="mailto:goodwilltimber786@gmail.com" className="text-primary-foreground/60 hover:text-accent transition-colors">
                 <Mail className="h-5 w-5" />
               </a>
             </div>
           </div>
 
           {/* Categories - Dynamic from DB */}
           <div>
             <h4 className="text-lg font-display font-semibold mb-6">Categories</h4>
             <ul className="space-y-3">
               {categories.length > 0 ? (
                 categories.map((category) => (
                   <li key={category.id}>
                     <Link
                       to={`/categories`}
                       className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                     >
                       {category.name}
                     </Link>
                   </li>
                 ))
               ) : (
                 <li>
                   <Link
                     to="/categories"
                     className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                   >
                     All Categories
                   </Link>
                 </li>
               )}
             </ul>
           </div>
 
           {/* Quick Links */}
           <div>
             <h4 className="text-lg font-display font-semibold mb-6">Quick Links</h4>
             <ul className="space-y-3">
               {quickLinks.map((item) => (
                 <li key={item.name}>
                   <Link
                     to={item.path}
                     className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                   >
                     {item.name}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>
 
           {/* Contact Info */}
           <div>
             <h4 className="text-lg font-display font-semibold mb-6">Contact Us</h4>
             <ul className="space-y-4">
               <li className="flex items-start gap-3">
                 <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                 <span className="text-sm text-primary-foreground/70">
                   Mirzabag By, Lane 1,<br />
                   West Milan Nagar, Amolapatty,<br />
                   Dibrugarh, Assam 786003
                 </span>
               </li>
               <li className="flex items-center gap-3">
                 <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                 <a
                   href="tel:+918638264329"
                   className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                 >
                   +91 86382 64329
                 </a>
               </li>
               <li className="flex items-center gap-3">
                 <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                 <a
                   href="mailto:goodwilltimber786@gmail.com"
                   className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                 >
                   goodwilltimber786@gmail.com
                 </a>
               </li>
             </ul>
           </div>
         </div>
       </div>
 
       {/* Bottom Bar */}
       <div className="border-t border-wood-light">
         <div className="container mx-auto px-4 py-6">
           <p className="text-center text-sm text-primary-foreground/60">
             © {new Date().getFullYear()} Goodwill Timbers. All Rights Reserved.
           </p>
         </div>
       </div>
     </footer>
   );
 }