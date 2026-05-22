import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Package, MessageSquare, Heart, User as UserIcon, LayoutDashboard } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [location] = useLocation();
  const { t } = useLanguage();

  if (!user) return null;

  const supplierLinks = [
    { href: "/dashboard", labelKey: "dashboard.overview", icon: LayoutDashboard },
    { href: "/dashboard/products", labelKey: "dashboard.products", icon: Package },
    { href: "/dashboard/rfqs", labelKey: "dashboard.rfqs", icon: MessageSquare },
    { href: "/dashboard/profile", labelKey: "dashboard.profile", icon: UserIcon },
  ];

  const buyerLinks = [
    { href: "/dashboard", labelKey: "dashboard.overview", icon: LayoutDashboard },
    { href: "/dashboard/rfqs", labelKey: "dashboard.myRfqs", icon: MessageSquare },
    { href: "/dashboard/favorites", labelKey: "dashboard.favorites", icon: Heart },
    { href: "/dashboard/profile", labelKey: "dashboard.profile", icon: UserIcon },
  ];

  const links = user.role === "supplier" ? supplierLinks : buyerLinks;

  return (
    <Layout>
      <div className="flex-1 flex flex-col md:flex-row bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 shrink-0">
          <div className="p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              {t("dashboard.title")}
            </h2>
            <nav className="space-y-1">
              {links.map((link) => {
                const active = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-[#F7941D]/10 text-[#F7941D] border border-[#F7941D]/20"
                        : "text-gray-600 hover:text-[#0D1B2A] hover:bg-gray-100"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </Layout>
  );
}
