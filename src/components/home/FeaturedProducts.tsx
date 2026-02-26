 import { Link } from "react-router-dom";
 import { useQuery } from "@tanstack/react-query";
 import { productService, categoryService } from "@/lib/api";
 import { ArrowRight } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
 import { Skeleton } from "@/components/ui/skeleton";
 
 export function FeaturedProducts() {
   const { data: products = [], isLoading } = useQuery({
     queryKey: ["products"],
     queryFn: () => productService.getAll(),
   });

   const { data: categories = [] } = useQuery({
     queryKey: ["categories"],
     queryFn: () => categoryService.getAll(),
   });

   // Get featured products marked in admin
   const featuredProducts = products.filter((p) => p.is_featured);

   const getCategoryName = (categoryId: string) => {
     return categories.find((c) => c.id === categoryId)?.name || "Product";
   };

   if (!isLoading && featuredProducts.length === 0) {
     return null;
   }
   return (
     <section className="py-20 bg-background">
       <div className="container mx-auto px-4">
         {/* Section Header */}
         <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
           <div>
             <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 accent-underline inline-block">
               Featured Products
             </h2>
             <p className="text-muted-foreground max-w-xl mt-8">
               Discover our most popular and best-selling materials, trusted by 
               professionals for quality construction projects.
             </p>
           </div>
           <Button asChild variant="outline" className="w-fit border-foreground text-foreground hover:bg-foreground hover:text-background">
             <Link to="/products">
               View All Products
               <ArrowRight className="ml-2 h-4 w-4" />
             </Link>
           </Button>
         </div>

         {/* Products Grid */}
         {isLoading ? (
           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
             {Array.from({ length: 4 }).map((_, i) => (
               <Card key={i} className="overflow-hidden">
                 <Skeleton className="w-full h-64" />
                 <div className="p-5 space-y-3">
                   <Skeleton className="h-4 w-20" />
                   <Skeleton className="h-5 w-3/4" />
                   <Skeleton className="h-4 w-1/2" />
                 </div>
               </Card>
             ))}
           </div>
         ) : (
           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 stagger-children">
             {featuredProducts.map((product) => (
               <Link
                 key={product.id}
                 to={`/products/${product.id}`}
                 className="group bg-card rounded-lg overflow-hidden shadow-card card-hover"
               >
                 {/* Image */}
                 <div className="relative aspect-square overflow-hidden bg-muted flex items-center justify-center">
                   {product.image_path ? (
                     <img
                       src={product.image_path}
                       alt={product.name}
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                     />
                   ) : (
                     <div className="text-center">
                       <div className="text-5xl mb-2">🛠️</div>
                       <span className="text-muted-foreground text-sm font-medium">{product.name}</span>
                     </div>
                   )}
                 </div>

                 {/* Content */}
                 <div className="p-5">
                   <span className="text-xs font-medium text-accent uppercase tracking-wider">
                     {getCategoryName(product.category_id)}
                   </span>
                   <h3 className="text-lg font-display font-semibold text-foreground mt-1 group-hover:text-accent transition-colors line-clamp-2">
                     {product.name}
                   </h3>
                   <div className="flex items-center justify-between mt-3">
                     <span className="text-sm font-bold text-primary">
                       ₹{product.price.toLocaleString('en-IN')}
                     </span>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-accent transition-colors">
                       <ArrowRight className="h-4 w-4" />
                     </div>
                   </div>
                 </div>
               </Link>
             ))}
           </div>
         )}
       </div>
     </section>
   );
 }