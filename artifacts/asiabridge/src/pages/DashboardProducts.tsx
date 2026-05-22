import { DashboardLayout } from "@/components/DashboardLayout";
import { useListProducts, getListProductsQueryKey, useCreateProduct, useDeleteProduct } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Package, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const CATEGORIES = [
  "Machinery & Equipment",
  "Food & Beverages",
  "Chemicals",
  "Metals & Materials",
  "Textiles & Apparel",
  "Agriculture",
  "Electronics",
  "Construction Materials",
  "Other",
];

const COUNTRIES = ["Russia", "Kazakhstan", "Belarus", "Ukraine", "Uzbekistan", "Azerbaijan", "Armenia", "Georgia"];

const UNITS = ["Unit", "Ton", "Kg", "Liter", "Piece", "Box", "Pallet", "Container"];

const CURRENCIES = ["USD", "EUR", "RUB", "CNY"];

type View = "list" | "add";

export default function DashboardProducts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<View>("list");

  const { data: products, refetch } = useListProducts(
    { supplierId: user?.id },
    { query: { enabled: !!user, queryKey: getListProductsQueryKey({ supplierId: user?.id }) } }
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    currency: "USD",
    moq: 1,
    unit: "Unit",
    category: "",
    originCountry: "Russia",
    imageUrl: "",
  });

  const createMutation = useCreateProduct({
    mutation: {
      onSuccess: () => {
        refetch();
        setView("list");
        setFormData({ title: "", description: "", price: 0, currency: "USD", moq: 1, unit: "Unit", category: "", originCountry: "Russia", imageUrl: "" });
        toast({ title: "Product created successfully" });
      },
      onError: () => {
        toast({ title: "Failed to create product", variant: "destructive" });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      data: {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        currency: formData.currency,
        moq: formData.moq,
        unit: formData.unit,
        category: formData.category,
        originCountry: formData.originCountry,
        ...(formData.imageUrl ? { images: [formData.imageUrl] } : {}),
      }
    });
  };

  if (view === "add") {
    return (
      <DashboardLayout>
        <div className="mb-6">
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0D1B2A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>
        </div>

        <div className="max-w-xl bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#0D1B2A] mb-6">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Product Name</Label>
              <Input
                required
                placeholder="e.g., CNC Milling Machine RM-500"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={4}
                placeholder="Describe your product..."
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Price</Label>
                <Input
                  type="number"
                  min={0}
                  required
                  value={formData.price}
                  onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select value={formData.currency} onValueChange={(v) => setFormData((p) => ({ ...p, currency: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Minimum Order Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  required
                  value={formData.moq}
                  onChange={(e) => setFormData((p) => ({ ...p, moq: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Select value={formData.unit} onValueChange={(v) => setFormData((p) => ({ ...p, unit: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Country of Origin</Label>
              <Select value={formData.originCountry} onValueChange={(v) => setFormData((p) => ({ ...p, originCountry: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Image URL (optional)</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={createMutation.isPending} className="bg-[#0D1B2A] hover:bg-[#1a2e47]">
                {createMutation.isPending ? "Creating..." : "Create Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setView("list")}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0D1B2A]">My Products</h1>
        <Button onClick={() => setView("add")} className="bg-[#F7941D] hover:bg-[#e0830c] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!products?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package className="h-12 w-12 mb-3 opacity-20" />
            <p className="font-medium text-[#0D1B2A]">No products yet</p>
            <p className="text-sm mt-1">Add your first product to start selling</p>
            <Button onClick={() => setView("add")} className="mt-4 bg-[#F7941D] hover:bg-[#e0830c] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <Package className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <p className="font-medium text-sm text-[#0D1B2A] truncate max-w-[180px]">{p.title}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{p.category}</td>
                  <td className="px-5 py-4 text-sm font-medium text-[#0D1B2A]">{p.price} {p.currency}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate({ id: p.id })}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
