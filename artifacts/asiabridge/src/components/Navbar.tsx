import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full glass-dark border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-[#F7941D]">Asia</span>Bridge
          </Link>
          
          <nav className="hidden md:flex gap-4">
            <Link href="/catalog" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              {t("nav.catalog")}
            </Link>
            <Link href="/suppliers" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              {t("nav.suppliers")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex glass rounded-md p-1">
            <button 
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${language === 'ru' ? 'bg-[#F7941D] text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
              onClick={() => setLanguage('ru')}
            >
              RU
            </button>
            <button 
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${language === 'en' ? 'bg-[#F7941D] text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors mr-2">
                {t("nav.dashboard")}
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="glass border-white/20 text-white hover:bg-white/10 hover:text-white">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-[#F7941D] hover:bg-[#F7941D]/90 text-white font-semibold shadow-lg shadow-orange-500/20 border-0">
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
