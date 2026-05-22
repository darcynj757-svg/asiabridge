import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Package, MessageSquare, Heart, User as UserIcon, LayoutDashboard } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const supplierLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "My Products", icon: Package },
    { href: "/dashboard/rfqs", label: "RFQs & Messages", icon: MessageSquare },
    { href: "/dashboard/profile", label: "Company Profile", icon: UserIcon },
  ];

  const buyerLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/rfqs", label: "My RFQs", icon: MessageSquare },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
  ];

  const links = user.role === "supplier" ? supplierLinks : buyerLinks;

  return (
    <Layout>
      <div className="flex-1 flex flex-col md:flex-row bg-[#0D1B2A] min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 glass-dark border-r border-white/10 shrink-0">
          <div className="p-6">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
              Dashboard
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
                        ? "bg-[#F7941D]/15 text-[#F7941D] border border-[#F7941D]/25" 
                        : "text-white/60 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
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
