import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useRegister } from "@workspace/api-client-react";
import { RegisterInputRole } from "@workspace/api-client-react/src/generated/api.schemas";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ShoppingCart } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { refetchUser } = useAuth();
  const { toast } = useToast();
  
  const [role, setRole] = useState<RegisterInputRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");

  const registerMutation = useRegister({
    mutation: {
      onSuccess: () => {
        refetchUser();
        setLocation("/dashboard");
      },
      onError: (error: any) => {
        toast({
          title: "Registration failed",
          description: error.message || "Something went wrong",
          variant: "destructive"
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    registerMutation.mutate({ 
      data: { 
        email, 
        password, 
        role, 
        companyName, 
        country, 
        category 
      } 
    });
  };

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 py-12">
        <div className="w-full max-w-xl">
          {!role ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-sidebar mb-2">Create an account</h1>
                <p className="text-muted-foreground">Select how you want to use AsiaBridge</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card 
                  className="cursor-pointer hover:border-primary transition-colors border-2"
                  onClick={() => setRole('buyer')}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                      <ShoppingCart className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold">I am a Buyer</h3>
                    <p className="text-sm text-muted-foreground">
                      Source products from verified suppliers in Russia and CIS
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:border-primary transition-colors border-2"
                  onClick={() => setRole('supplier')}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                      <Building2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold">I am a Supplier</h3>
                    <p className="text-sm text-muted-foreground">
                      Sell your products to wholesale buyers in Southeast Asia
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="text-center text-sm mt-6">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            <Card className="shadow-lg border-border">
              <CardHeader className="space-y-2 text-center pb-6">
                <CardTitle className="text-3xl font-bold text-sidebar">
                  Register as {role === 'buyer' ? 'Buyer' : 'Supplier'}
                </CardTitle>
                <CardDescription className="text-base">
                  Fill in your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Primary Category</Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-1/3"
                      onClick={() => setRole(null)}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="w-2/3 bg-primary text-primary-foreground hover:bg-primary/90" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating account..." : "Complete Registration"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
