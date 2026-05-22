import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              <span className="text-primary">Asia</span>Bridge
            </h3>
            <p className="text-sm text-gray-400">
              {t("hero.subtitle") || "Direct supplies from manufacturers in Russia and CIS countries to buyers in Southeast Asia."}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link></li>
              <li><Link href="/suppliers" className="hover:text-primary transition-colors">Suppliers</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Become a Supplier</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Become a Buyer</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Cross-border Logistics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Escrow & Factoring</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Legal Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Insurance</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@asiabridge.b2b</li>
              <li>+7 (800) 000-00-00 (RU)</li>
              <li>+66 (0) 2-000-0000 (TH)</li>
              <li>123 Trade Center, Bangkok, Thailand</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-sidebar-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} AsiaBridge B2B. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
