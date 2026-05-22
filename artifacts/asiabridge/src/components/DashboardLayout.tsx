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
      <div className="flex-1 flex flex-col md:flex-row bg-gray-50">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-border shrink-0">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Dashboard
            </h2>
            <nav className="space-y-1">
              {links.map((link) => {
                const active = location === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active 
                        ? "bg-primary/10 text-primary" 
                        : "text-sidebar hover:bg-gray-100"
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
