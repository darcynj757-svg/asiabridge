import { DashboardLayout } from "@/components/DashboardLayout";
import { useListFavorites, getListFavoritesQueryKey, useRemoveFavorite } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardFavorites() {
  const { toast } = useToast();
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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sidebar">Saved Products</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites?.map(fav => {
          const p = fav.product;
          if (!p) return null;
          return (
            <Card key={fav.id} className="relative overflow-hidden group">
              <div className="aspect-[4/3] bg-muted">
                {p.images?.[0] ? (
                  <img src={p.images[0]} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package className="h-12 w-12 text-gray-300" /></div>
                )}
              </div>
              <CardContent className="p-4">
                <Link href={`/products/${p.id}`}>
                  <h3 className="font-bold text-lg hover:text-primary mb-2 truncate">{p.title}</h3>
                </Link>
                <div className="font-bold mb-4">{p.price} {p.currency} / {p.unit}</div>
                <div className="flex gap-2">
                  <Link href={`/products/${p.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => removeMutation.mutate({ data: { productId: p.id } })}
                  >
                    <Heart className="h-4 w-4" fill="currentColor" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!favorites?.length && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No saved products yet. Browse the catalog to find items.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
