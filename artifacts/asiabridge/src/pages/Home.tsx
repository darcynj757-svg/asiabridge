import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/hooks/use-language";
import { useGetStats, getGetStatsQueryKey, useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
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
      <section className="relative h-[620px] w-full flex items-center justify-center overflow-hidden">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/60 via-[#0D1B2A]/50 to-[#0a1628]/90 z-10" />
            <img
              src={slide.img}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}

        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-[#F7941D] w-6' : 'w-2 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto font-medium">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" className="bg-[#F7941D] hover:bg-[#F7941D]/90 text-white text-lg h-14 px-8 font-semibold w-full sm:w-auto shadow-xl shadow-orange-500/30 border-0">
                {t("hero.cta")}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" className="glass text-white text-lg h-14 px-8 font-semibold w-full sm:w-auto hover:bg-white/15 border-white/30">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section — transparent, glass cards */}
      <section className="py-14 border-b border-white/8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: "Suppliers", value: stats?.totalSuppliers },
              { label: "Buyers", value: stats?.totalBuyers },
              { label: "Products", value: stats?.totalProducts },
              { label: "Deals Closed", value: stats?.totalDeals },
            ].map(({ label, value }) => (
              <div key={label} className="glass rounded-2xl p-6 text-center space-y-2">
                <div className="text-4xl font-black text-[#F7941D]">
                  {statsLoading ? <Skeleton className="h-10 w-20 mx-auto bg-white/10" /> : value || 0}
                </div>
                <div className="text-sm font-semibold text-white uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section — transparent background */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Browse by Category</h2>
              <p className="text-white/50 max-w-2xl">Discover industrial supplies and commodities from top manufacturers.</p>
            </div>
            <Link href="/catalog">
              <Button variant="ghost" className="text-[#F7941D] hover:text-[#F7941D]/80 hover:bg-[#F7941D]/10 hidden sm:flex">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categoriesLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl bg-white/5" />
              ))
            ) : categories?.length ? (
              categories.map((cat, i) => (
                <Link key={i} href={`/catalog?category=${encodeURIComponent(cat.name)}`}>
                  <div className="glass rounded-xl p-6 h-full cursor-pointer group hover:border-[#F7941D]/40 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200">
                    <h3 className="font-semibold text-lg text-white group-hover:text-[#F7941D] transition-colors line-clamp-2">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-white/40 mt-3">
                      {cat.count} products
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-white/40">
                No categories available.
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/catalog">
              <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10 w-full">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section — transparent, glass cards with white text */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Why AsiaBridge?</h2>
            <p className="text-white/50">We provide a secure, end-to-end ecosystem for cross-border trade, eliminating risks and reducing friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass rounded-2xl p-6 flex gap-4 group hover:border-[#F7941D]/30 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-xl glass-orange flex items-center justify-center text-[#F7941D]">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F7941D] transition-colors">{feature.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
