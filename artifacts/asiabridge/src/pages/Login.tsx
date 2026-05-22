import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useLogin } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

export default function Login() {
  const [, setLocation] = useLocation();
  const { refetchUser } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin({
    mutation: {
      onSuccess: async () => {
        await refetchUser();
        setLocation("/dashboard");
      },
      onError: (error: any) => {
        const description =
          error.status === 401
            ? t("login.invalidCredentials")
            : t("login.serverError");
        toast({
          title: t("login.error"),
          description,
          variant: "destructive"
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { email, password } });
  };

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md shadow-lg border-gray-200">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="text-2xl font-bold mb-1">
              <span className="text-[#F7941D]">Asia</span><span className="text-[#0D1B2A]">Bridge</span>
            </div>
            <CardTitle className="text-2xl font-bold text-[#0D1B2A]">{t("login.title")}</CardTitle>
            <CardDescription className="text-base text-gray-500">
              {t("login.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">{t("login.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-300 focus-visible:ring-[#F7941D]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">{t("login.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-gray-300 focus-visible:ring-[#F7941D]"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-base bg-[#F7941D] hover:bg-[#F7941D]/90 text-white border-0 font-semibold"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t("login.submitting") : t("login.submit")}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">{t("login.noAccount")} </span>
              <Link href="/register" className="text-[#F7941D] hover:underline font-medium">
                {t("login.register")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
