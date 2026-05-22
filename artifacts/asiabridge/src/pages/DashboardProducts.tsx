import { DashboardLayout } from "@/components/DashboardLayout";
import { useListProducts, getListProductsQueryKey, useCreateProduct, useDeleteProduct, useUpdateProduct } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductStatus } from "@workspace/api-client-react/src/generated/api.schemas";
import { Edit, Trash2 } from "lucide-react";

export default function DashboardProducts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const { data: products, refetch } = useListProducts(
    { supplierId: user?.id },
    { query: { enabled: !!user, queryKey: getListProductsQueryKey({ supplierId: user?.id }) } }
  );

  const createMutation = useCreateProduct({
    mutation: {
      onSuccess: () => {
        refetch();
        setIsOpen(false);
        toast({ title: "Product created" });
      }
    }
  });

  const deleteMutation = useDeleteProduct({
    mutation: {
      onSuccess: () => {
        refetch();
        toast({ title: "Product deleted" });
      }
    }
  });

  const [formData, setFormData] = useState({
    title: "", description: "", price: 0, currency: "USD", moq: 1, unit: "ton", category: "", originCountry: "Russia"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: formData });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sidebar">My Products</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 space-y-2">
                <Label>Title</Label>
                <Input required value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input required value={formData.category} onChange={e => setFormData(p => ({...p, category: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Origin Country</Label>
                <Input required value={formData.originCountry} onChange={e => setFormData(p => ({...p, originCountry: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" required value={formData.price} onChange={e => setFormData(p => ({...p, price: Number(e.target.value)}))} />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input required value={formData.currency} onChange={e => setFormData(p => ({...p, currency: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>MOQ</Label>
                <Input type="number" required value={formData.moq} onChange={e => setFormData(p => ({...p, moq: Number(e.target.value)}))} />
              </div>
              <div className="space-y-2">
                <Label>Unit (e.g. ton, kg, piece)</Label>
                <Input required value={formData.unit} onChange={e => setFormData(p => ({...p, unit: e.target.value}))} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Input required value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} />
              </div>
              <Button type="submit" className="col-span-2 mt-2" disabled={createMutation.isPending}>
                Create Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.price} {p.currency}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {p.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: p.id })}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!products?.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No products found. Add your first product to start selling.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
