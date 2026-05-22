import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/hooks/use-language";
import { useGetStats, getGetStatsQueryKey, useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, ShieldCheck, Truck, CreditCard, Scale, FileText, ArrowRight } from "lucide-react";

import bgBangkok from "@assets/1_1779437848935.jpeg";
import bgSingapore from "@assets/2_1779437853225.png";
import bgPhnomPenh from "@assets/3_1779437853225.jpeg";
import bgKL from "@assets/4_1779437853225.webp";

const SLIDES = [
  { img: bgBangkok, alt: "Bangkok" },
  { img: bgSingapore, alt: "Singapore" },
  { img: bgPhnomPenh, alt: "Phnom Penh" },
  { img: bgKL, alt: "Kuala Lumpur" },
];

export default function Home() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { data: stats, isLoading: statsLoading } = useGetStats({
    query: { queryKey: getGetStatsQueryKey() }
  });

  const { data: categories, isLoading: categoriesLoading } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() }
  });

  const features = [
    { icon: ShieldCheck, title: "Verified Partners", desc: "Rigorous vetting process for all suppliers and buyers." },
    { icon: Truck, title: "Cross-border Logistics", desc: "End-to-end shipping solutions from Russia/CIS to SE Asia." },
    { icon: Globe, title: "Full Deal Cycle", desc: "Manage RFQs, negotiations, and contracts in one place." },
    { icon: FileText, title: "AsiaBridge Insurance", desc: "Cargo insurance to protect your investments during transit." },
    { icon: CreditCard, title: "Factoring & Escrow", desc: "Secure payment terms and financial instruments." },
    { icon: Scale, title: "Legal Support", desc: "Assistance with customs clearance and cross-border contracts." },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[600px] w-full flex items-center justify-center overflow-hidden">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-sidebar/70 z-10" />
            <img
              src={slide.img}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-medium">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 px-8 font-semibold w-full sm:w-auto">
                {t("hero.cta")}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white text-sidebar-foreground bg-white hover:bg-gray-100 text-lg h-14 px-8 font-semibold w-full sm:w-auto">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-black text-sidebar">
                {statsLoading ? <Skeleton className="h-10 w-20 mx-auto" /> : stats?.totalSuppliers || 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Suppliers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-sidebar">
                {statsLoading ? <Skeleton className="h-10 w-20 mx-auto" /> : stats?.totalBuyers || 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Buyers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-sidebar">
                {statsLoading ? <Skeleton className="h-10 w-20 mx-auto" /> : stats?.totalProducts || 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Products</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-sidebar">
                {statsLoading ? <Skeleton className="h-10 w-20 mx-auto" /> : stats?.totalDeals || 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Deals Closed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-sidebar mb-4">Browse by Category</h2>
              <p className="text-muted-foreground max-w-2xl">Discover industrial supplies and commodities from top manufacturers.</p>
            </div>
            <Link href="/catalog">
              <Button variant="ghost" className="text-primary hover:text-primary/80 hidden sm:flex">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoriesLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))
            ) : categories?.length ? (
              categories.map((cat, i) => (
                <Link key={i} href={`/catalog?category=${encodeURIComponent(cat.name)}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-border group hover:border-primary/50">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                      <h3 className="font-semibold text-lg text-sidebar group-hover:text-primary transition-colors line-clamp-2">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-4">
                        {cat.count} products
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                No categories available.
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/catalog">
              <Button variant="outline" className="w-full">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sidebar mb-4">Why AsiaBridge?</h2>
            <p className="text-muted-foreground">We provide a secure, end-to-end ecosystem for cross-border trade, eliminating risks and reducing friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl bg-gray-50 border border-border/50">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sidebar mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
