 import { useState } from "react";
 import { Link, useLocation } from "react-router-dom";
 import { Menu, X, Phone, ChevronDown, Package } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { cn } from "@/lib/utils";
 
 const navLinks = [
   { name: "Home", path: "/" },
   { name: "Products", path: "/products" },
   { name: "About Us", path: "/about" },
   { name: "Contact", path: "/contact" },
   { name: "My Orders", path: "/my-orders", icon: Package },
 ];
 
 export function Navbar() {
   const [isOpen, setIsOpen] = useState(false);
   const location = useLocation();
 
   return (
     <header className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-sm shadow-lg">
       <nav className="container mx-auto px-4">
         <div className="flex h-20 items-center justify-between">
           {/* Logo */}
           <Link to="/" className="flex items-center gap-3">
             <div className="flex flex-col">
               <span className="text-2xl font-display font-bold text-primary-foreground">
                 Goodwill
               </span>
               <span className="text-sm font-medium tracking-widest text-accent uppercase">
                 Timbers
               </span>
             </div>
           </Link>
 
           {/* Desktop Navigation */}
           <div className="hidden lg:flex items-center gap-8">
             {navLinks.map((link) => (
               <Link
                 key={link.path}
                 to={link.path}
                 className={cn(
                   "text-sm font-medium transition-colors duration-200 relative py-2 flex items-center gap-2",
                   location.pathname === link.path
                     ? "text-accent"
                     : "text-primary-foreground/80 hover:text-primary-foreground"
                 )}
               >
                 {link.icon && <link.icon className="h-4 w-4" />}
                 {link.name}
                 {location.pathname === link.path && (
                   <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
                 )}
               </Link>
             ))}
           </div>
 
           {/* Desktop CTA */}
           <div className="hidden lg:flex items-center gap-4">
             <a
               href="tel:+918638264329"
               className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
             >
               <Phone className="h-4 w-4" />
               <span className="text-sm font-medium">+91 86382 64329</span>
             </a>
             <Button asChild variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
               <Link to="/contact">Get a Quote</Link>
             </Button>
           </div>
 
           {/* Mobile Menu Button */}
           <button
             onClick={() => setIsOpen(!isOpen)}
             className="lg:hidden text-primary-foreground p-2"
             aria-label="Toggle menu"
           >
             {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
           </button>
         </div>
 
         {/* Mobile Navigation */}
         {isOpen && (
           <div className="lg:hidden absolute top-20 left-0 w-full bg-primary border-t border-wood-light animate-fade-in">
             <div className="container px-4 py-6 flex flex-col gap-4">
               {navLinks.map((link) => (
                 <Link
                   key={link.path}
                   to={link.path}
                   onClick={() => setIsOpen(false)}
                   className={cn(
                     "text-base font-medium py-2 transition-colors flex items-center gap-2",
                     location.pathname === link.path
                       ? "text-accent"
                       : "text-primary-foreground/80"
                   )}
                 >
                   {link.icon && <link.icon className="h-5 w-5" />}
                   {link.name}
                 </Link>
               ))}
               <hr className="border-wood-light" />
               <a
                 href="tel:+918638264329"
                 className="flex items-center gap-2 text-primary-foreground/80"
               >
                 <Phone className="h-4 w-4" />
                 <span className="text-sm">+91 86382 64329</span>
               </a>
               <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                 <Link to="/contact" onClick={() => setIsOpen(false)}>
                   Get a Quote
                 </Link>
               </Button>
             </div>
           </div>
         )}
       </nav>
     </header>
   );
 }