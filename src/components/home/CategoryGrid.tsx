import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryGrid() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Loading Categories...
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-lg">No categories available yet. Please check back soon!</p>
        </div>
      </section>
    );
  }
   return (
     <section className="py-20 bg-background">
       <div className="container mx-auto px-4">
         {/* Section Header */}
         <div className="text-center mb-14">
           <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 accent-underline accent-underline-center inline-block">
             Our Product Categories
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto mt-8">
             Explore our comprehensive range of timber, plywood, doors, and hardware 
             solutions for all your construction and interior needs.
           </p>
         </div>
 
         {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 stagger-children">
           {categories.map((category) => (
             <Link
               key={category.id}
               to={`/products?category=${category.id}`}
               className="group relative overflow-hidden rounded-lg bg-card shadow-card card-hover"
             >
               {/* Image */}
               <div className="aspect-square overflow-hidden bg-gray-200">
                 {category.image_path ? (
                   <img
                     src={category.image_path}
                     alt={category.name}
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                   />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                     <span className="text-gray-600 text-sm">No image</span>
                   </div>
                 )}
               </div>

               {/* Content Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex flex-col justify-end p-6">
                 <h3 className="text-xl font-display font-bold text-primary-foreground mb-1">
                   {category.name}
                 </h3>
                 <p className="text-sm text-primary-foreground/70 mb-3 line-clamp-2">
                   {category.description || "Click to explore"}
                 </p>
                 <div className="flex items-center gap-2 text-accent text-sm font-medium opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                   View Products
                   <ArrowRight className="h-4 w-4" />
                 </div>
               </div>
             </Link>
           ))}
         </div>
       </div>
     </section>
   );
 }