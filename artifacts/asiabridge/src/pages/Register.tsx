import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useRegister } from "@workspace/api-client-react";
import { RegisterInputRole } from "@workspace/api-client-react/src/generated/api.schemas";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ShoppingCart } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { refetchUser } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [role, setRole] = useState<RegisterInputRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");

  const registerMutation = useRegister({
    mutation: {
      onSuccess: async () => {
        await refetchUser();
        setLocation("/dashboard");
      },
      onError: (error: any) => {
        toast({
          title: t("register.error"),
          description: error.message || "Something went wrong",
          variant: "destructive"
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    registerMutation.mutate({ data: { email, password, role, companyName, country, category } });
  };

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 py-12">
        <div className="w-full max-w-xl">
          {!role ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-2xl font-bold mb-3">
                  <span className="text-[#F7941D]">Asia</span><span className="text-[#0D1B2A]">Bridge</span>
                </div>
                <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2">{t("register.title")}</h1>
                <p className="text-gray-500">{t("register.subtitle")}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card
                  className="cursor-pointer hover:border-[#F7941D] transition-all duration-200 border-2 border-gray-200 hover:shadow-md"
                  onClick={() => setRole('buyer')}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-[#F7941D]/10 rounded-full flex items-center justify-center mx-auto text-[#F7941D]">
                      <ShoppingCart className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#0D1B2A]">{t("register.buyer")}</h3>
                    <p className="text-sm text-gray-500">{t("register.buyer.desc")}</p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:border-[#F7941D] transition-all duration-200 border-2 border-gray-200 hover:shadow-md"
                  onClick={() => setRole('supplier')}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-[#F7941D]/10 rounded-full flex items-center justify-center mx-auto text-[#F7941D]">
                      <Building2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#0D1B2A]">{t("register.supplier")}</h3>
                    <p className="text-sm text-gray-500">{t("register.supplier.desc")}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center text-sm">
                <span className="text-gray-500">{t("register.hasAccount")} </span>
                <Link href="/login" className="text-[#F7941D] hover:underline font-medium">
                  {t("register.login")}
                </Link>
              </div>
            </div>
          ) : (
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="space-y-2 text-center pb-6">
                <CardTitle className="text-2xl font-bold text-[#0D1B2A]">
                  {role === 'buyer' ? t("register.as.buyer") : t("register.as.supplier")}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {t("register.form.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">{t("register.email")}</Label>
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border-gray-300 focus-visible:ring-[#F7941D]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">{t("register.password")}</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="border-gray-300 focus-visible:ring-[#F7941D]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-gray-700">{t("register.company")}</Label>
                    <Input id="companyName" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="border-gray-300 focus-visible:ring-[#F7941D]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-gray-700">{t("register.country")}</Label>
                      <Input id="country" required value={country} onChange={(e) => setCountry(e.target.value)} className="border-gray-300 focus-visible:ring-[#F7941D]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-700">{t("register.category")}</Label>
                      <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="border-gray-300 focus-visible:ring-[#F7941D]" />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <Button type="button" variant="outline" className="w-1/3 border-gray-300 text-gray-700" onClick={() => setRole(null)}>
                      {t("register.back")}
                    </Button>
                    <Button type="submit" className="w-2/3 bg-[#F7941D] hover:bg-[#F7941D]/90 text-white border-0 font-semibold" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? t("register.submitting") : t("register.submit")}
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
