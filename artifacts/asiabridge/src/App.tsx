import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { LanguageProvider } from "@/hooks/use-language";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import DashboardProducts from "@/pages/DashboardProducts";
import DashboardRfqs from "@/pages/DashboardRfqs";
import DashboardChat from "@/pages/DashboardChat";
import DashboardFavorites from "@/pages/DashboardFavorites";
import DashboardProfile from "@/pages/DashboardProfile";
import DashboardMessages from "@/pages/DashboardMessages";
import DashboardDeals from "@/pages/DashboardDeals";
import SupplierProfile from "@/pages/SupplierProfile";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#F7941D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/dashboard/products">{() => <ProtectedRoute component={DashboardProducts} />}</Route>
      <Route path="/dashboard/rfqs">{() => <ProtectedRoute component={DashboardRfqs} />}</Route>
      <Route path="/dashboard/chat/:rfqId">{() => <ProtectedRoute component={DashboardChat} />}</Route>
      <Route path="/dashboard/messages">{() => <ProtectedRoute component={DashboardMessages} />}</Route>
      <Route path="/dashboard/deals">{() => <ProtectedRoute component={DashboardDeals} />}</Route>
      <Route path="/dashboard/favorites">{() => <ProtectedRoute component={DashboardFavorites} />}</Route>
      <Route path="/dashboard/profile">{() => <ProtectedRoute component={DashboardProfile} />}</Route>
      <Route path="/suppliers/:id" component={SupplierProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <LanguageProvider>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </LanguageProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
