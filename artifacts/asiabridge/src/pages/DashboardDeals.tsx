import { DashboardLayout } from "@/components/DashboardLayout";
import { useListRfqs, getListRfqsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";
import { useState } from "react";

type StatusFilter = "all" | "negotiating" | "contracted" | "shipped";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  quoted: "Quoted",
  negotiating: "Negotiating",
  contracted: "Contracted",
  shipped: "Shipped",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  quoted: "bg-yellow-100 text-yellow-700",
  negotiating: "bg-purple-100 text-purple-700",
  contracted: "bg-green-100 text-green-700",
  shipped: "bg-gray-100 text-gray-700",
};

export default function DashboardDeals() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: rfqs } = useListRfqs({
    query: { queryKey: getListRfqsQueryKey() }
  });

  const deals = (rfqs ?? []).filter((r) => {
    if (statusFilter === "all") return ["negotiating", "contracted", "shipped"].includes(r.status);
    return r.status === statusFilter;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A]">Deals</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track your trade deals</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#F7941D]/30"
        >
          <option value="all">All Status</option>
          <option value="negotiating">Negotiating</option>
          <option value="contracted">Contracted</option>
          <option value="shipped">Shipped</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Handshake className="h-12 w-12 mb-3 opacity-20" />
            <p className="font-medium text-[#0D1B2A]">No deals yet</p>
            <p className="text-sm mt-1">Deals are created when RFQs are accepted and converted</p>
            <Link href="/dashboard/rfqs">
              <Button variant="outline" className="mt-4">View RFQs</Button>
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {user?.role === "supplier" ? "Buyer" : "Supplier"}
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-sm text-[#0D1B2A] truncate max-w-[200px]">{deal.productTitle}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {user?.role === "supplier" ? deal.buyerName : deal.supplierName}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{deal.quantity}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[deal.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABELS[deal.status] ?? deal.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {new Date(deal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/dashboard/chat/${deal.id}`}>
                      <Button variant="outline" size="sm">Open</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
