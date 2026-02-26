import { useState, useMemo, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProductsFilterProps {
  products: any[];
  categories: any[];
  onFilterChange: (filtered: any[]) => void;
  selectedCategory?: string | null;
}

export const ProductsFilter = ({
  products,
  categories,
  onFilterChange,
  selectedCategory,
}: ProductsFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(selectedCategory || null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['search']));

  // Toggle section expansion
  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections);
    if (newSections.has(section)) {
      newSections.delete(section);
    } else {
      newSections.add(section);
    }
    setExpandedSections(newSections);
  };

  // Get min and max prices from products
  const priceStats = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 };
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  // Real-time filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter - by name and description
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower));

      // Category filter
      const matchesCategory = !selectedCategoryFilter || product.category_id === selectedCategoryFilter;

      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategoryFilter, priceRange]);

  // Notify parent component of filtered results
  useEffect(() => {
    onFilterChange(filteredProducts);
  }, [filteredProducts, onFilterChange]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategoryFilter(null);
    setPriceRange([priceStats.min, priceStats.max]);
  };

  const hasActiveFilters = searchQuery || selectedCategoryFilter || 
    priceRange[0] > priceStats.min || priceRange[1] < priceStats.max;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Filters</h2>
      
      {/* Search Section */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection('search')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors"
        >
          <span className="font-medium text-foreground">Search</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.has('search') ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.has('search') && (
          <div className="px-4 py-3 border-t border-border space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Section */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors"
        >
          <span className="font-medium text-foreground">Category</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.has('category') ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.has('category') && (
          <div className="px-4 py-3 border-t border-border space-y-2">
            <button
              onClick={() => setSelectedCategoryFilter(null)}
              className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                !selectedCategoryFilter
                  ? 'bg-primary/20 text-primary'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryFilter(category.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                  selectedCategoryFilter === category.id
                    ? 'bg-primary/20 text-primary'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors"
        >
          <span className="font-medium text-foreground">Price Range</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.has('price') ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.has('price') && (
          <div className="px-4 py-3 border-t border-border space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const val = Math.max(priceStats.min, Math.min(parseInt(e.target.value) || 0, priceRange[1]));
                    setPriceRange([val, priceRange[1]]);
                  }}
                  min={priceStats.min}
                  max={priceRange[1]}
                  className="text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const val = Math.min(priceStats.max, Math.max(parseInt(e.target.value) || priceStats.max, priceRange[0]));
                    setPriceRange([priceRange[0], val]);
                  }}
                  min={priceRange[0]}
                  max={priceStats.max}
                  className="text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <input
                type="range"
                min={priceStats.min}
                max={priceStats.max}
                value={priceRange[0]}
                onChange={(e) => {
                  const val = Math.min(parseInt(e.target.value), priceRange[1]);
                  setPriceRange([val, priceRange[1]]);
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <input
                type="range"
                min={priceStats.min}
                max={priceStats.max}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Math.max(parseInt(e.target.value), priceRange[0]);
                  setPriceRange([priceRange[0], val]);
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="text-xs text-muted-foreground text-center pt-2">
                ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results and Clear Button */}
      <div className="bg-card rounded-lg border border-border p-3 space-y-2">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> of <span className="font-semibold text-foreground">{products.length}</span>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full text-sm text-primary hover:underline font-medium py-1"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
