import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useGetProduct, getGetProductQueryKey, useCreateRfq, useAddFavorite, useRemoveFavorite, useListFavorites, getListFavoritesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Package, ShieldCheck, Heart, FileText, Anchor, Plane } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_IMAGES: Record<string, string> = {
  "Machinery & Equipment": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=675&fit=crop&auto=format",
  "Food & Beverages": "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1200&h=675&fit=crop&auto=format",
  "Chemicals": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=675&fit=crop&auto=format",
};

const TITLE_IMAGES: Record<string, string> = {
  "hydraulic press": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=675&fit=crop&auto=format",
  "electric motor": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1200&h=675&fit=crop&auto=format",
  "sunflower oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&h=675&fit=crop&auto=format",
  "wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=675&fit=crop&auto=format",
  "buckwheat": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&h=675&fit=crop&auto=format",
  "npk": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=675&fit=crop&auto=format",
  "polyethylene": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&h=675&fit=crop&auto=format",
};

function getProductImage(title: string, category: string, images?: string[]): string {
  if (images?.[0]) return images[0];
  const lower = title.toLowerCase();
  for (const [key, url] of Object.entries(TITLE_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return CATEGORY_IMAGES[category] ?? "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=675&fit=crop&auto=format";
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const productId = parseInt(params.id);

  const { data: product, isLoading: productLoading } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) }
  });

  const { data: favorites } = useListFavorites({
    query: { 
      queryKey: getListFavoritesQueryKey(),
      enabled: !!user && user.role === 'buyer'
    }
  });

  const isFavorite = favorites?.some(f => f.productId === productId);

  const addFavoriteMutation = useAddFavorite({
    mutation: {
      onSuccess: () => {
        toast({ title: "Added to favorites" });
      }
    }
  });

  const removeFavoriteMutation = useRemoveFavorite({
    mutation: {
      onSuccess: () => {
        toast({ title: "Removed from favorites" });
      }
    }
  });

  const toggleFavorite = () => {
    if (!user) return setLocation("/login");
    if (isFavorite) {
      removeFavoriteMutation.mutate({ data: { productId } });
    } else {
      addFavoriteMutation.mutate({ data: { productId } });
    }
  };

  const [rfqQuantity, setRfqQuantity] = useState(product?.moq || 1);
  const [rfqMessage, setRfqMessage] = useState("");
  const [isRfqOpen, setIsRfqOpen] = useState(false);

  const rfqMutation = useCreateRfq({
    mutation: {
      onSuccess: () => {
        setIsRfqOpen(false);
        toast({ title: "RFQ Sent successfully" });
      }
    }
  });

  const handleSendRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setLocation("/login");
    if (!product) return;
    rfqMutation.mutate({
      data: {
        productId: product.id,
        supplierId: product.supplierId,
        quantity: rfqQuantity,
        message: rfqMessage
      }
    });
  };

  // Logistics calculator state
  const [transportMethod, setTransportMethod] = useState<'sea' | 'air'>('sea');
  const [volume, setVolume] = useState<number>(1);
  const [destCountry, setDestCountry] = useState("Thailand");

  const calcEstimatedCost = () => {
    const rate = transportMethod === 'sea' ? 120 : 450;
    return rate * volume;
  };

  if (productLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-[400px] w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return <Layout><div className="container p-8 text-center">Product not found</div></Layout>;
  }

  return (
    <Layout>
      <div className="bg-gray-50 border-b border-border py-4">
        <div className="container mx-auto px-4 text-sm text-muted-foreground flex items-center gap-2">
          <Link href="/catalog" className="hover:text-primary">Catalog</Link>
          <span>/</span>
          <Link href={`/catalog?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">{product.category}</Link>
          <span>/</span>
          <span className="text-sidebar">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Product Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                <img
                  src={getProductImage(product.title, product.category ?? "", product.images ?? [])}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                      {product.category}
                    </span>
                    <h1 className="text-3xl font-bold text-sidebar mb-2">{product.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {product.originCountry}</span>
                      <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-green-600"/> Verified Origin</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleFavorite}
                    className={isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400"}
                  >
                    <Heart className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} />
                  </Button>
                </div>

                <div className="py-6 border-y border-border my-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Target Price</p>
                      <p className="text-3xl font-bold text-primary">
                        {product.price.toLocaleString()} <span className="text-lg text-sidebar">{product.currency}</span>
                        <span className="text-sm font-normal text-muted-foreground ml-1">/ {product.unit}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Minimum Order Quantity (MOQ)</p>
                      <p className="text-xl font-bold text-sidebar">
                        {product.moq} {product.unit}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-sidebar mb-3">Product Description</h3>
                  <div className="prose max-w-none text-muted-foreground">
                    {product.description || "No description provided."}
                  </div>
                </div>

                {product.certificates && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-sidebar mb-3">Certificates & Compliance</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span>{product.certificates}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Logistics Calculator */}
            <div className="bg-white rounded-xl border border-border p-8">
              <h3 className="text-xl font-bold text-sidebar mb-6 flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                Cross-border Logistics Calculator
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block text-muted-foreground">Route</Label>
                    <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-border">
                      <div className="flex-1 font-medium">{product.originCountry} (Moscow)</div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <select 
                          className="w-full bg-transparent font-medium focus:outline-none"
                          value={destCountry}
                          onChange={(e) => setDestCountry(e.target.value)}
                        >
                          <option>Thailand</option>
                          <option>Cambodia</option>
                          <option>Vietnam</option>
                          <option>Indonesia</option>
                          <option>Malaysia</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block text-muted-foreground">Transport Method</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        type="button"
                        variant={transportMethod === 'sea' ? 'default' : 'outline'}
                        className={transportMethod === 'sea' ? 'bg-sidebar text-white' : ''}
                        onClick={() => setTransportMethod('sea')}
                      >
                        <Anchor className="mr-2 h-4 w-4" /> Sea (25-45 days)
                      </Button>
                      <Button 
                        type="button"
                        variant={transportMethod === 'air' ? 'default' : 'outline'}
                        className={transportMethod === 'air' ? 'bg-sidebar text-white' : ''}
                        onClick={() => setTransportMethod('air')}
                      >
                        <Plane className="mr-2 h-4 w-4" /> Air (7-10 days)
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block text-muted-foreground">Volume (Tons)</Label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 5, 10, 20].map(v => (
                        <Button 
                          key={v}
                          type="button"
                          variant={volume === v ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setVolume(v)}
                        >
                          {v}t
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center border border-border">
                  <div className="text-sm text-muted-foreground mb-2 text-center">Estimated Shipping Cost</div>
                  <div className="text-4xl font-black text-primary text-center mb-4">
                    ~${calcEstimatedCost().toLocaleString()}
                  </div>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex justify-between"><span>Rate per ton:</span> <span>${transportMethod === 'sea' ? '120' : '450'}</span></li>
                    <li className="flex justify-between"><span>Customs clearance:</span> <span>Not included</span></li>
                    <li className="flex justify-between"><span>Insurance:</span> <span>Available on request</span></li>
                  </ul>
                  <Button variant="outline" className="w-full mt-6 bg-white">Request Exact Quote</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Supplier Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <h3 className="font-bold text-lg text-sidebar mb-4">Supplier Details</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <div className="font-semibold text-sidebar">{product.supplierName}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {product.supplierCountry}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <ShieldCheck className="h-4 w-4" /> Verified Business Entity
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" /> Registered on AsiaBridge
                </div>
              </div>

              <div className="space-y-3">
                <Dialog open={isRfqOpen} onOpenChange={setIsRfqOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
                      onClick={(e) => {
                        if (!user) {
                          e.preventDefault();
                          setLocation("/login");
                        } else if (user.role === 'supplier') {
                          e.preventDefault();
                          toast({ title: "Suppliers cannot send RFQs", variant: "destructive" });
                        }
                      }}
                    >
                      Send RFQ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request for Quotation</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSendRfq} className="space-y-4 mt-4">
                      <div>
                        <Label>Product</Label>
                        <div className="font-medium">{product.title}</div>
                      </div>
                      <div>
                        <Label>Quantity ({product.unit})</Label>
                        <Input 
                          type="number" 
                          min={product.moq} 
                          value={rfqQuantity} 
                          onChange={(e) => setRfqQuantity(Number(e.target.value))} 
                        />
                        <div className="text-xs text-muted-foreground mt-1">Minimum order: {product.moq}</div>
                      </div>
                      <div>
                        <Label>Message to Supplier</Label>
                        <Textarea 
                          placeholder="Include your target port, specific requirements, and any questions."
                          rows={4}
                          value={rfqMessage}
                          onChange={(e) => setRfqMessage(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={rfqMutation.isPending}>
                        {rfqMutation.isPending ? "Sending..." : "Send Request"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full h-12" onClick={() => setLocation(`/suppliers/${product.supplierId}`)}>
                  View Supplier Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { Truck, ArrowRight } from "lucide-react";
