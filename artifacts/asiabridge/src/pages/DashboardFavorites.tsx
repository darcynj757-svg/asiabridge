import { DashboardLayout } from "@/components/DashboardLayout";
import { useListFavorites, getListFavoritesQueryKey, useRemoveFavorite } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type Tab = "products" | "suppliers";

export default function DashboardFavorites() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("products");

  const { data: favorites, refetch } = useListFavorites({
    query: { queryKey: getListFavoritesQueryKey() }
  });

  const removeMutation = useRemoveFavorite({
    mutation: {
      onSuccess: () => {
        refetch();
        toast({ title: "Removed from favorites" });
      }
    }
  });

  const productFavs = favorites ?? [];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0D1B2A]">Favorites</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your saved products and suppliers</p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab("products")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "products"
              ? "border-[#0D1B2A] text-[#0D1B2A]"
              : "border-transparent text-gray-500 hover:text-[#0D1B2A]"
          }`}
        >
          <Package className="h-4 w-4" />
          Products ({productFavs.length})
        </button>
        <button
          onClick={() => setTab("suppliers")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "suppliers"
              ? "border-[#0D1B2A] text-[#0D1B2A]"
              : "border-transparent text-gray-500 hover:text-[#0D1B2A]"
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Suppliers (0)
        </button>
      </div>

      {tab === "products" && (
        <>
          {productFavs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
              <Heart className="h-12 w-12 mb-3 opacity-20" />
              <p className="font-medium text-[#0D1B2A]">No favorite products</p>
              <p className="text-sm mt-1">Browse the catalog and save products you like</p>
              <Link href="/catalog">
                <Button className="mt-4 bg-[#0D1B2A] hover:bg-[#1a2e47] text-white">Browse Catalog</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {productFavs.map((fav) => {
                const p = fav.product;
                if (!p) return null;
                return (
                  <Card key={fav.id} className="overflow-hidden border-gray-200 shadow-none hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} className="w-full h-full object-cover" alt={p.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <Link href={`/products/${p.id}`}>
                        <h3 className="font-semibold text-[#0D1B2A] hover:text-[#F7941D] mb-1 truncate cursor-pointer transition-colors">{p.title}</h3>
                      </Link>
                      <p className="font-bold text-[#0D1B2A] mb-3">{p.price} {p.currency} / {p.unit}</p>
                      <div className="flex gap-2">
                        <Link href={`/products/${p.id}`} className="flex-1">
                          <Button variant="outline" className="w-full text-sm">View</Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 border-red-200"
                          onClick={() => removeMutation.mutate({ data: { productId: p.id } })}
                        >
                          <Heart className="h-4 w-4" fill="currentColor" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === "suppliers" && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
          <svg className="h-12 w-12 mb-3 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p className="font-medium text-[#0D1B2A]">No favorite suppliers</p>
          <p className="text-sm mt-1">Save suppliers you like to find them quickly</p>
        </div>
      )}
    </DashboardLayout>
  );
}
