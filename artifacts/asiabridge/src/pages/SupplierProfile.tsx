import { Layout } from "@/components/Layout";
import { useGetUser, getGetUserQueryKey, useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { Building2, Globe, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Package } from "lucide-react";

export default function SupplierProfile({ params }: { params: { id: string } }) {
  const supplierId = parseInt(params.id);

  const { data: supplier } = useGetUser(supplierId, {
    query: { queryKey: getGetUserQueryKey(supplierId) }
  });

  const { data: products } = useListProducts(
    { supplierId },
    { query: { queryKey: getListProductsQueryKey({ supplierId }) } }
  );

  if (!supplier) return null;

  return (
    <Layout>
      <div className="bg-sidebar py-12 border-b border-sidebar-border text-white">
        <div className="container mx-auto px-4 flex items-start gap-6">
          <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{supplier.companyName}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {supplier.country}</span>
              <span className="flex items-center gap-1"><Package className="h-4 w-4"/> {supplier.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border">
            <h3 className="font-bold text-lg mb-4">About Company</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {supplier.companyDescription || "No description provided."}
            </p>
            <div className="space-y-3 text-sm">
              {supplier.contactWebsite && (
                <div className="flex items-center gap-2 text-primary">
                  <Globe className="h-4 w-4" /> <a href={supplier.contactWebsite} target="_blank" rel="noreferrer">{supplier.contactWebsite}</a>
                </div>
              )}
              {supplier.contactPhone && (
                <div className="flex items-center gap-2 text-sidebar">
                  <Phone className="h-4 w-4 text-muted-foreground" /> {supplier.contactPhone}
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <h2 className="text-xl font-bold mb-6">Products ({products?.length || 0})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products?.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="h-full hover:shadow-md transition-all cursor-pointer border-border group overflow-hidden">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <Package className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg text-sidebar group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {product.title}
                    </h3>
                    <div className="text-xl font-bold text-sidebar mb-4">
                      {product.price.toLocaleString()} {product.currency}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}
