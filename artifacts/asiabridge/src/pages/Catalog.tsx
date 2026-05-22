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

const CATEGORY_IMAGES: Record<string, string> = {
  "Machinery & Equipment": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=450&fit=crop&auto=format",
  "Food & Beverages": "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&h=450&fit=crop&auto=format",
  "Chemicals": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=450&fit=crop&auto=format",
  "metals": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=450&fit=crop&auto=format",
  "wood": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=450&fit=crop&auto=format",
  "textiles": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=450&fit=crop&auto=format",
  "energy": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=450&fit=crop&auto=format",
};

const TITLE_IMAGES: Record<string, string> = {
  "hydraulic press": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=450&fit=crop&auto=format",
  "electric motor": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&h=450&fit=crop&auto=format",
  "sunflower oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=450&fit=crop&auto=format",
  "wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=450&fit=crop&auto=format",
  "buckwheat": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=450&fit=crop&auto=format",
  "npk": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=450&fit=crop&auto=format",
  "polyethylene": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=450&fit=crop&auto=format",
};

function getProductImage(title: string, category: string, images?: string[]): string {
  if (images?.[0]) return images[0];
  const lowerTitle = title.toLowerCase();
  for (const [key, url] of Object.entries(TITLE_IMAGES)) {
    if (lowerTitle.includes(key)) return url;
  }
  return CATEGORY_IMAGES[category] ?? "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&auto=format";
}

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
          <h1 className="text-3xl font-bold text-white mb-6">{t("catalog.title")}</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
              <Input
                type="search"
                placeholder={t("catalog.search.placeholder")}
                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-[#F7941D]"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="bg-[#F7941D] hover:bg-[#F7941D]/90 text-white h-12 px-8 font-semibold border-0">
              {t("catalog.search.btn")}
            </Button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Filter className="h-5 w-5 text-[#F7941D]" />
                  <h2 className="font-semibold text-[#0D1B2A] text-lg">{t("catalog.filters")}</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t("catalog.category")}</label>
                    <Select value={category || "all"} onValueChange={(val) => updateFilter("category", val)}>
                      <SelectTrigger className="w-full border-gray-200 focus:ring-[#F7941D]">
                        <SelectValue placeholder={t("catalog.category.all")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("catalog.category.all")}</SelectItem>
                        {categories?.map(cat => (
                          <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t("catalog.country")}</label>
                    <Select value={country || "all"} onValueChange={(val) => updateFilter("country", val)}>
                      <SelectTrigger className="w-full border-gray-200 focus:ring-[#F7941D]">
                        <SelectValue placeholder={t("catalog.country.all")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("catalog.country.all")}</SelectItem>
                        <SelectItem value="Россия">🇷🇺 Россия</SelectItem>
                        <SelectItem value="Казахстан">🇰🇿 Казахстан</SelectItem>
                        <SelectItem value="Узбекистан">🇺🇿 Узбекистан</SelectItem>
                        <SelectItem value="Беларусь">🇧🇾 Беларусь</SelectItem>
                        <SelectItem value="Вьетнам">🇻🇳 Вьетнам</SelectItem>
                        <SelectItem value="Таиланд">🇹🇭 Таиланд</SelectItem>
                        <SelectItem value="Индонезия">🇮🇩 Индонезия</SelectItem>
                        <SelectItem value="Малайзия">🇲🇾 Малайзия</SelectItem>
                        <SelectItem value="Филиппины">🇵🇭 Филиппины</SelectItem>
                        <SelectItem value="Сингапур">🇸🇬 Сингапур</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <main className="flex-1">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700">
                  {productsLoading ? (
                    <Skeleton className="h-6 w-36" />
                  ) : (
                    <><span className="text-[#F7941D] font-bold text-xl">{products?.length ?? 0}</span> {t("catalog.found")}</>
                  )}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {productsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-96 w-full rounded-xl" />
                  ))
                ) : products?.length ? (
                  products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer group hover:border-[#F7941D]/60 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
                        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                          <img
                            src={getProductImage(product.title, product.category ?? "", product.images ?? [])}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <span className="bg-white/95 text-[#0D1B2A] text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                              {product.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="font-bold text-base text-[#0D1B2A] group-hover:text-[#F7941D] transition-colors line-clamp-2 mb-2">
                            {product.title}
                          </h3>

                          <div className="text-xl font-bold text-[#F7941D] mb-3">
                            {product.price.toLocaleString()} {product.currency}
                            <span className="text-sm font-normal text-gray-400 ml-1">/ {product.unit}</span>
                          </div>

                          <div className="space-y-1.5 text-sm text-gray-500 mt-auto">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-400 shrink-0" />
                              <span>{t("catalog.moq")}: <span className="font-medium text-gray-700">{product.moq} {product.unit}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                              <span className="truncate">{product.supplierName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                              <span>{product.originCountry}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#0D1B2A] mb-2">{t("catalog.empty.title")}</h3>
                    <p className="text-gray-400">{t("catalog.empty.desc")}</p>
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
