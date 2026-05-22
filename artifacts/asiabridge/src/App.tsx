import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
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
import SupplierProfile from "@/pages/SupplierProfile";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/products" component={DashboardProducts} />
      <Route path="/dashboard/rfqs" component={DashboardRfqs} />
      <Route path="/dashboard/chat/:rfqId" component={DashboardChat} />
      <Route path="/dashboard/favorites" component={DashboardFavorites} />
      <Route path="/dashboard/profile" component={DashboardProfile} />
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
