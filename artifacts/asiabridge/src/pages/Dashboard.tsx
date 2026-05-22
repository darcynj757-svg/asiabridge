import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MessageSquare, TrendingUp, DollarSign, Handshake, FileText, BookOpen } from "lucide-react";
import {
  useListProducts, getListProductsQueryKey,
  useListRfqs, getListRfqsQueryKey,
} from "@workspace/api-client-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: myProducts } = useListProducts(
    { supplierId: user?.id },
    { query: { enabled: user?.role === "supplier", queryKey: getListProductsQueryKey({ supplierId: user?.id }) } }
  );

  const { data: myRfqs } = useListRfqs({
    query: { enabled: !!user, queryKey: getListRfqsQueryKey() }
  });

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-[#F7941D] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const activeDeals = myRfqs?.filter((r) => ["negotiating", "contracted"].includes(r.status)) ?? [];
  const recentDeals = activeDeals.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-700";
      case "quoted": return "bg-yellow-100 text-yellow-700";
      case "negotiating": return "bg-purple-100 text-purple-700";
      case "contracted": return "bg-green-100 text-green-700";
      case "shipped": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A]">
            Welcome back, {user.companyName || user.email}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {user.companyName} · <span className="capitalize">{user.role}</span>
          </p>
        </div>
        {user.role === "supplier" && (
          <Link href="/dashboard/products">
            <Button className="bg-[#0D1B2A] hover:bg-[#1a2e47] text-white">
              + Add Product
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {user.role === "supplier" ? (
          <>
            <StatCard
              icon={<Package className="h-5 w-5 text-white" />}
              iconBg="bg-[#0D1B2A]"
              label="My Products"
              value={myProducts?.length ?? 0}
            />
            <StatCard
              icon={<Handshake className="h-5 w-5 text-white" />}
              iconBg="bg-orange-500"
              label="Active Deals"
              value={activeDeals.length}
            />
            <StatCard
              icon={<MessageSquare className="h-5 w-5 text-white" />}
              iconBg="bg-sky-500"
              label="Unread Messages"
              value={0}
            />
            <StatCard
              icon={<DollarSign className="h-5 w-5 text-white" />}
              iconBg="bg-green-500"
              label="Total Revenue"
              value="$0"
            />
          </>
        ) : (
          <>
            <StatCard
              icon={<FileText className="h-5 w-5 text-white" />}
              iconBg="bg-[#0D1B2A]"
              label="My RFQs"
              value={myRfqs?.length ?? 0}
            />
            <StatCard
              icon={<Handshake className="h-5 w-5 text-white" />}
              iconBg="bg-orange-500"
              label="Active Deals"
              value={activeDeals.length}
            />
            <StatCard
              icon={<MessageSquare className="h-5 w-5 text-white" />}
              iconBg="bg-sky-500"
              label="Unread Messages"
              value={0}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5 text-white" />}
              iconBg="bg-green-500"
              label="Completed Orders"
              value={myRfqs?.filter((r) => r.status === "shipped").length ?? 0}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0D1B2A]">Recent Deals</h2>
            <Link href="/dashboard/deals">
              <span className="text-sm text-[#F7941D] hover:underline cursor-pointer">View all</span>
            </Link>
          </div>
          {recentDeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Handshake className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No deals yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDeals.map((deal) => (
                <Link key={deal.id} href={`/dashboard/chat/${deal.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div>
                      <p className="font-medium text-sm text-[#0D1B2A] truncate max-w-[200px]">{deal.productTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user.role === "supplier" ? deal.buyerName : deal.supplierName}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(deal.status)}`}>
                      {deal.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-[#0D1B2A] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/messages">
              <QuickAction icon={<MessageSquare className="h-5 w-5 text-sky-500" />} label="Messages" />
            </Link>
            <Link href="/dashboard/rfqs">
              <QuickAction icon={<FileText className="h-5 w-5 text-orange-500" />} label="RFQs" />
            </Link>
            <Link href="/dashboard/deals">
              <QuickAction icon={<Handshake className="h-5 w-5 text-purple-500" />} label="Deals" />
            </Link>
            <Link href="/catalog">
              <QuickAction icon={<BookOpen className="h-5 w-5 text-green-500" />} label="Catalog" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="border border-gray-200 shadow-none">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-[#0D1B2A]">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
      {icon}
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
}
