import { Link, useLocation, Redirect } from "wouter";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import {
  Package,
  MessageSquare,
  Heart,
  User as UserIcon,
  LayoutDashboard,
  FileText,
  Handshake,
} from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();
  const { t } = useLanguage();

  if (isLoading) return null;
  if (!user) return <Redirect to="/login" />;

  const supplierLinks = [
    { href: "/dashboard", labelKey: "dashboard.overview", icon: LayoutDashboard },
    { href: "/dashboard/products", labelKey: "dashboard.products", icon: Package },
    { href: "/dashboard/rfqs", labelKey: "dashboard.rfqs", icon: FileText },
    { href: "/dashboard/messages", labelKey: "dashboard.messages", icon: MessageSquare },
    { href: "/dashboard/deals", labelKey: "dashboard.deals", icon: Handshake },
    { href: "/dashboard/favorites", labelKey: "dashboard.favorites", icon: Heart },
    { href: "/dashboard/profile", labelKey: "dashboard.profile", icon: UserIcon },
  ];

  const buyerLinks = [
    { href: "/dashboard", labelKey: "dashboard.overview", icon: LayoutDashboard },
    { href: "/dashboard/rfqs", labelKey: "dashboard.myRfqs", icon: FileText },
    { href: "/dashboard/messages", labelKey: "dashboard.messages", icon: MessageSquare },
    { href: "/dashboard/deals", labelKey: "dashboard.deals", icon: Handshake },
    { href: "/dashboard/favorites", labelKey: "dashboard.favorites", icon: Heart },
    { href: "/dashboard/profile", labelKey: "dashboard.profile", icon: UserIcon },
  ];

  const links = user.role === "supplier" ? supplierLinks : buyerLinks;

  const initials = (user.companyName || user.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Layout>
      <div className="flex-1 flex flex-col md:flex-row bg-gray-50 min-h-screen">
        <aside className="w-full md:w-60 bg-[#0D1B2A] shrink-0 flex flex-col">
          <div className="p-5 border-b border-white/10">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
              {user.role === "supplier" ? t("dashboard.supplierMenu") : t("dashboard.buyerMenu")}
            </p>
            <p className="text-white font-semibold truncate">{user.companyName || user.email}</p>
          </div>

          <nav className="flex-1 p-3 space-y-0.5">
            {links.map((link) => {
              const active =
                link.href === "/dashboard"
                  ? location === "/dashboard"
                  : location.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F7941D] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.companyName || user.email}</p>
              <p className="text-gray-400 text-[10px] capitalize">{user.role}</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </Layout>
  );
}
