import { DashboardLayout } from "@/components/DashboardLayout";
import { useListRfqs, getListRfqsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DashboardRfqs() {
  const { user } = useAuth();
  
  const { data: rfqs } = useListRfqs({
    query: { queryKey: getListRfqsQueryKey() }
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'quoted': return 'bg-yellow-100 text-yellow-800';
      case 'negotiating': return 'bg-purple-100 text-purple-800';
      case 'contracted': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sidebar">RFQs & Deals</h1>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Counterpart</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rfqs?.map(rfq => (
              <TableRow key={rfq.id}>
                <TableCell className="font-medium">{rfq.productTitle || `Product #${rfq.productId}`}</TableCell>
                <TableCell>{user?.role === 'supplier' ? rfq.buyerName : rfq.supplierName}</TableCell>
                <TableCell>{rfq.quantity}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${getStatusColor(rfq.status)}`}>
                    {rfq.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(rfq.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/chat/${rfq.id}`}>
                    <Button variant="outline" size="sm">Open</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {!rfqs?.length && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No RFQs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
