import { createContext, useContext, useState, ReactNode } from "react";

type Language = "ru" | "en";

interface Translations {
  [key: string]: {
    ru: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  "nav.catalog": { ru: "Каталог", en: "Catalog" },
  "nav.suppliers": { ru: "Поставщики", en: "Suppliers" },
  "nav.login": { ru: "Войти", en: "Login" },
  "nav.register": { ru: "Регистрация", en: "Register" },
  "nav.dashboard": { ru: "Личный кабинет", en: "Dashboard" },
  
  // Hero
  "hero.title": { ru: "Надежный мост для вашего B2B бизнеса", en: "A Reliable Bridge for Your B2B Business" },
  "hero.subtitle": { ru: "Прямые поставки от производителей России и стран СНГ покупателям Юго-Восточной Азии.", en: "Direct supplies from manufacturers in Russia and CIS countries to buyers in Southeast Asia." },
  "hero.cta": { ru: "Перейти в каталог", en: "Go to Catalog" },

  // Catalog
  "catalog.title": { ru: "Каталог товаров", en: "Product Catalog" },
  "catalog.search": { ru: "Искать товары по названию, описанию...", en: "Search products by name, description..." },
  "catalog.filters": { ru: "Фильтры", en: "Filters" },
  "catalog.category": { ru: "Категория", en: "Category" },
  "catalog.country": { ru: "Страна происхождения", en: "Origin Country" },

  // Dashboard
  "dashboard.title": { ru: "Личный кабинет", en: "Dashboard" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ru");

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
