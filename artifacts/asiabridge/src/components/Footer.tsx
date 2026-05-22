import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0D1B2A] text-white border-t border-white/10 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              <span className="text-[#F7941D]">Asia</span>Bridge
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t("footer.marketplace")}</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/catalog" className="hover:text-[#F7941D] transition-colors">{t("footer.catalog")}</Link></li>
              <li><Link href="/suppliers" className="hover:text-[#F7941D] transition-colors">{t("footer.suppliers")}</Link></li>
              <li><Link href="/register" className="hover:text-[#F7941D] transition-colors">{t("footer.becomeSupplier")}</Link></li>
              <li><Link href="/register" className="hover:text-[#F7941D] transition-colors">{t("footer.becomeBuyer")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t("footer.services")}</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><a href="#" className="hover:text-[#F7941D] transition-colors">{t("footer.logistics")}</a></li>
              <li><a href="#" className="hover:text-[#F7941D] transition-colors">{t("footer.escrow")}</a></li>
              <li><a href="#" className="hover:text-[#F7941D] transition-colors">{t("footer.legal")}</a></li>
              <li><a href="#" className="hover:text-[#F7941D] transition-colors">{t("footer.insurance")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>info@asiabridge.b2b</li>
              <li>+7 (800) 000-00-00 (RU)</li>
              <li>+66 (0) 2-000-0000 (TH)</li>
              <li>123 Trade Center, Bangkok, Thailand</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/30">
          <p>&copy; {new Date().getFullYear()} AsiaBridge B2B. {t("footer.rights")}.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-green-400/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="text-xs font-medium">Сайт работает 24/7 — не засыпает</span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">{t("footer.terms")}</a>
              <a href="#" className="hover:text-white transition-colors">{t("footer.privacy")}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
