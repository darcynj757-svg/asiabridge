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
    { icon: ShieldCheck, titleKey: "features.verified.title", descKey: "features.verified.desc" },
    { icon: Truck, titleKey: "features.logistics.title", descKey: "features.logistics.desc" },
    { icon: Globe, titleKey: "features.cycle.title", descKey: "features.cycle.desc" },
    { icon: FileText, titleKey: "features.insurance.title", descKey: "features.insurance.desc" },
    { icon: CreditCard, titleKey: "features.escrow.title", descKey: "features.escrow.desc" },
    { icon: Scale, titleKey: "features.legal.title", descKey: "features.legal.desc" },
  ];

  const statsData = [
    { labelKey: "stats.suppliers", value: stats?.totalSuppliers },
    { labelKey: "stats.buyers", value: stats?.totalBuyers },
    { labelKey: "stats.products", value: stats?.totalProducts },
    { labelKey: "stats.deals", value: stats?.totalDeals },
  ];

  return (
    <Layout>
      {/* Hero Section — stats overlaid at bottom with glass effect */}
      <section className="relative w-full overflow-hidden" style={{ height: "calc(100vh - 64px)", minHeight: 520, maxHeight: 800 }}>
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/60 via-[#0D1B2A]/50 to-[#0D1B2A]/85 z-10" />
            <img src={slide.img} alt={slide.alt} className="w-full h-full object-cover object-center" />
          </div>
        ))}

        {/* Hero text */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-24 pb-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/catalog">
              <Button size="lg" className="bg-[#F7941D] hover:bg-[#F7941D]/90 text-white text-base px-8 font-semibold w-full sm:w-auto shadow-xl shadow-orange-500/30 border-0">
                {t("hero.cta")}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white/50 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm text-base px-8 font-semibold w-full sm:w-auto">
                {t("hero.partner")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats — glass cards inside hero at the bottom */}
        <div className="relative z-20 px-4 pb-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsData.map(({ labelKey, value }) => (
                <div
                  key={labelKey}
                  className="rounded-2xl p-5 text-center space-y-1"
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(20px) saturate(160%)",
                    WebkitBackdropFilter: "blur(20px) saturate(160%)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.18)",
                  }}
                >
                  <div className="text-4xl md:text-5xl font-black text-[#F7941D]">
                    {statsLoading ? <Skeleton className="h-12 w-16 mx-auto bg-white/10" /> : value ?? 0}
                  </div>
                  <div className="text-xs font-bold text-white uppercase tracking-widest">{t(labelKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide dots — below stats cards */}
        <div className="relative z-20 flex justify-center gap-2 pb-6 pt-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-[#F7941D] w-6' : 'w-2 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </section>

      {/* Trade Direction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0D1B2A] mb-3">Торговля Россия ↔ АСЕАН</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Прямые поставки между Россией, СНГ и странами Юго-Восточной Азии без посредников</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => window.location.href = '/catalog?country=Россия'}>
              <img src="https://images.unsplash.com/photo-1513326738677-b964603b136d?w=600&h=300&fit=crop&auto=format" alt="Россия и СНГ" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 via-[#0D1B2A]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs font-bold text-[#F7941D] uppercase tracking-widest mb-1">Экспортёры</div>
                <h3 className="text-xl font-bold text-white mb-1">Россия и СНГ → АСЕАН</h3>
                <p className="text-white/70 text-sm">Металл, зерно, удобрения, лес, химия, текстиль</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => window.location.href = '/catalog?country=Вьетнам'}>
              <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=300&fit=crop&auto=format" alt="АСЕАН страны" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 via-[#0D1B2A]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs font-bold text-[#F7941D] uppercase tracking-widest mb-1">Импортёры</div>
                <h3 className="text-xl font-bold text-white mb-1">АСЕАН → Россия</h3>
                <p className="text-white/70 text-sm">Кофе, каучук, пальмовое масло, морепродукты, рис</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['🇻🇳 Вьетнам','🇹🇭 Таиланд','🇮🇩 Индонезия','🇲🇾 Малайзия','🇵🇭 Филиппины','🇸🇬 Сингапур','🇰🇭 Камбоджа','🇲🇲 Мьянма'].map(c => (
              <span key={c} className="bg-gray-100 border border-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-full">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#0D1B2A] mb-3">{t("categories.title")}</h2>
              <p className="text-gray-500 max-w-xl">{t("categories.subtitle")}</p>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center gap-1 text-[#F7941D] hover:text-[#F7941D]/80 font-medium text-sm transition-colors">
              {t("categories.viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoriesLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-44 w-full rounded-xl" />
              ))
            ) : categories?.length ? (
              categories.map((cat, i) => {
                const catImages: Record<string, string> = {
                  metals: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=220&fit=crop&auto=format',
                  wood: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=220&fit=crop&auto=format',
                  food: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=220&fit=crop&auto=format',
                  chemicals: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=220&fit=crop&auto=format',
                  textiles: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=220&fit=crop&auto=format',
                  energy: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=220&fit=crop&auto=format',
                };
                const img = catImages[cat.name] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=220&fit=crop&auto=format';
                return (
                  <Link key={i} href={`/catalog?category=${encodeURIComponent(cat.name)}`}>
                    <div className="rounded-xl overflow-hidden border border-gray-200 cursor-pointer group hover:border-[#F7941D] hover:shadow-lg transition-all duration-200 relative">
                      <img src={img} alt={cat.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="font-semibold text-sm text-white group-hover:text-[#F7941D] transition-colors capitalize">{cat.name}</h3>
                        <p className="text-xs text-white/70 mt-0.5">{cat.count} {t("categories.products")}</p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                {t("categories.empty")}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/catalog">
              <Button variant="outline" className="w-full border-[#F7941D] text-[#F7941D]">
                {t("categories.viewAll")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0D1B2A] mb-4">{t("features.title")}</h2>
            <p className="text-gray-500 leading-relaxed">{t("features.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl border border-gray-200 bg-white hover:border-[#F7941D]/40 hover:shadow-md group transition-all duration-200">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#F7941D]/10 flex items-center justify-center text-[#F7941D]">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[#0D1B2A] mb-2 group-hover:text-[#F7941D] transition-colors">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{t(feature.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
