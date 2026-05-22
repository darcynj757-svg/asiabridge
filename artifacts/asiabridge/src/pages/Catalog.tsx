import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/hooks/use-language";
import { useListProducts, getListProductsQueryKey, useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, MapPin, Building2, Package } from "lucide-react";

export default function Catalog() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const category = searchParams.get("category") || "";
  const country = searchParams.get("country") || "";
  const search = searchParams.get("search") || "";
  
  const [searchInput, setSearchInput] = useState(search);

  const { data: products, isLoading: productsLoading } = useListProducts(
    { category, country, search },
    { query: { queryKey: getListProductsQueryKey({ category, country, search }) } }
  );

  const { data: categories } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    if (category) params.set("category", category);
    if (country) params.set("country", country);
    setLocation(`/catalog?${params.toString()}`);
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setLocation(`/catalog?${params.toString()}`);
  };

  return (
    <Layout>
      {/* Header bar */}
      <div className="bg-[#0D1B2A] py-8 border-b border-white/10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-6">{t("catalog.title") || "Product Catalog"}</h1>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
              <Input 
                type="search" 
                placeholder="Search products by name, description..." 
                className="pl-10 h-12 glass border-white/20 text-white placeholder:text-white/30 focus-visible:ring-[#F7941D] focus-visible:border-[#F7941D]/50 bg-transparent"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="bg-[#F7941D] hover:bg-[#F7941D]/90 text-white h-12 px-8 font-semibold border-0 shadow-lg shadow-orange-500/20">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="bg-[#0D1B2A] min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-64 shrink-0 space-y-6">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Filter className="h-5 w-5 text-[#F7941D]" />
                  <h2 className="font-semibold text-white text-lg">Filters</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/60">Category</label>
                    <Select value={category || "all"} onValueChange={(val) => updateFilter("category", val)}>
                      <SelectTrigger className="w-full glass border-white/20 text-white bg-transparent focus:ring-[#F7941D]">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories?.map(cat => (
                          <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/60">Origin Country</label>
                    <Select value={country || "all"} onValueChange={(val) => updateFilter("country", val)}>
                      <SelectTrigger className="w-full glass border-white/20 text-white bg-transparent focus:ring-[#F7941D]">
                        <SelectValue placeholder="All Countries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        <SelectItem value="Russia">Russia</SelectItem>
                        <SelectItem value="Belarus">Belarus</SelectItem>
                        <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <main className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white/80">
                  {productsLoading ? (
                    <Skeleton className="h-6 w-32 bg-white/10" />
                  ) : (
                    <><span className="text-[#F7941D] font-bold">{products?.length || 0}</span> Products Found</>
                  )}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {productsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-96 w-full rounded-xl bg-white/5" />
                  ))
                ) : products?.length ? (
                  products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <div className="glass rounded-xl overflow-hidden cursor-pointer group hover:border-[#F7941D]/40 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-200 h-full flex flex-col">
                        <div className="aspect-[4/3] bg-white/5 relative overflow-hidden">
                          {product.images?.[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <Package className="h-12 w-12" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <span className="glass text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                              {product.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg text-white group-hover:text-[#F7941D] transition-colors line-clamp-2 mb-2">
                            {product.title}
                          </h3>
                          
                          <div className="text-xl font-bold text-[#F7941D] mb-4">
                            {product.price.toLocaleString()} {product.currency}
                            <span className="text-sm font-normal text-white/40 ml-1">
                              / {product.unit}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm text-white/50 mt-auto">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-white/30" />
                              <span>MOQ: <span className="font-medium text-white/70">{product.moq} {product.unit}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-white/30" />
                              <span className="truncate">{product.supplierName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-white/30" />
                              <span>{product.originCountry}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass mb-4">
                      <Search className="h-8 w-8 text-white/40" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                    <p className="text-white/40">Try adjusting your search or filters to find what you're looking for.</p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
