import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-primary">Asia</span>Bridge
          </Link>
          
          <nav className="hidden md:flex gap-4">
            <Link href="/catalog" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {t("nav.catalog")}
            </Link>
            <Link href="/suppliers" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {t("nav.suppliers")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-sidebar-border rounded-md p-1">
            <button 
              className={`px-2 py-1 text-xs font-medium rounded ${language === 'ru' ? 'bg-primary text-primary-foreground' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setLanguage('ru')}
            >
              RU
            </button>
            <button 
              className={`px-2 py-1 text-xs font-medium rounded ${language === 'en' ? 'bg-primary text-primary-foreground' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors mr-2">
                {t("nav.dashboard")}
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-white">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="border-sidebar-border text-white hover:bg-sidebar-accent hover:text-white">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {t("nav.register")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
