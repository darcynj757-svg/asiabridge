import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full glass-nav">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-1">
            <span className="text-[#F7941D]">Asia</span>
            <span className="text-[#0D1B2A]">Bridge</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link href="/catalog" className="text-sm font-medium text-gray-600 hover:text-[#0D1B2A] transition-colors">
              {t("nav.catalog")}
            </Link>
            <Link href="/suppliers" className="text-sm font-medium text-gray-600 hover:text-[#0D1B2A] transition-colors">
              {t("nav.suppliers")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              className={`px-3 py-1.5 text-xs font-semibold transition-all ${language === 'ru' ? 'bg-[#F7941D] text-white' : 'text-gray-500 hover:text-gray-700 bg-white'}`}
              onClick={() => setLanguage('ru')}
            >
              RU
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-semibold transition-all ${language === 'en' ? 'bg-[#F7941D] text-white' : 'text-gray-500 hover:text-gray-700 bg-white'}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#0D1B2A]">
                  {t("nav.dashboard")}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="border-gray-300 text-gray-700">
                {t("nav.logout")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#0D1B2A]">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-[#F7941D] hover:bg-[#F7941D]/90 text-white font-semibold border-0 shadow-sm">
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
