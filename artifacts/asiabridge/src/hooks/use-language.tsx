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
  "nav.register": { ru: "Регистрация", en: "Sign Up" },
  "nav.dashboard": { ru: "Личный кабинет", en: "Dashboard" },
  "nav.logout": { ru: "Выйти", en: "Logout" },

  // Hero
  "hero.title": { ru: "Надёжный мост для вашего B2B бизнеса", en: "A Reliable Bridge for Your B2B Business" },
  "hero.subtitle": { ru: "Прямые поставки от производителей России и стран СНГ покупателям Юго-Восточной Азии", en: "Direct supplies from manufacturers in Russia and CIS countries to wholesale buyers in Southeast Asia" },
  "hero.cta": { ru: "Перейти в каталог", en: "Browse Catalog" },
  "hero.partner": { ru: "Стать партнёром", en: "Become a Partner" },

  // Stats
  "stats.suppliers": { ru: "Поставщики", en: "Suppliers" },
  "stats.buyers": { ru: "Покупатели", en: "Buyers" },
  "stats.products": { ru: "Товары", en: "Products" },
  "stats.deals": { ru: "Сделок закрыто", en: "Deals Closed" },

  // Categories section
  "categories.title": { ru: "Обзор по категориям", en: "Browse by Category" },
  "categories.subtitle": { ru: "Промышленные товары и сырьё от ведущих производителей", en: "Industrial goods and commodities from leading manufacturers" },
  "categories.viewAll": { ru: "Смотреть все", en: "View All" },
  "categories.products": { ru: "товаров", en: "products" },
  "categories.empty": { ru: "Категории не найдены", en: "No categories available" },

  // Features section
  "features.title": { ru: "Почему AsiaBridge?", en: "Why AsiaBridge?" },
  "features.subtitle": { ru: "Безопасная экосистема для международной торговли — от запроса до поставки", en: "A secure end-to-end ecosystem for cross-border trade — from inquiry to delivery" },
  "features.verified.title": { ru: "Проверенные партнёры", en: "Verified Partners" },
  "features.verified.desc": { ru: "Строгая верификация всех поставщиков и покупателей перед допуском на платформу", en: "Rigorous vetting of all suppliers and buyers before platform access" },
  "features.logistics.title": { ru: "Международная логистика", en: "Cross-border Logistics" },
  "features.logistics.desc": { ru: "Сквозные решения по доставке из России и СНГ в страны Юго-Восточной Азии", en: "End-to-end shipping solutions from Russia/CIS to Southeast Asian countries" },
  "features.cycle.title": { ru: "Полный цикл сделки", en: "Full Deal Cycle" },
  "features.cycle.desc": { ru: "Управляйте запросами, переговорами и контрактами в одном месте", en: "Manage RFQs, negotiations, and contracts in one place" },
  "features.insurance.title": { ru: "Страхование грузов", en: "Cargo Insurance" },
  "features.insurance.desc": { ru: "Страхование грузов для защиты ваших инвестиций во время транзита", en: "Cargo insurance to protect your investments during transit" },
  "features.escrow.title": { ru: "Факторинг и эскроу", en: "Factoring & Escrow" },
  "features.escrow.desc": { ru: "Безопасные условия оплаты и финансовые инструменты для каждой сделки", en: "Secure payment terms and financial instruments for every deal" },
  "features.legal.title": { ru: "Юридическая поддержка", en: "Legal Support" },
  "features.legal.desc": { ru: "Помощь с таможенным оформлением и международными контрактами", en: "Assistance with customs clearance and cross-border contracts" },

  // Catalog
  "catalog.title": { ru: "Каталог товаров", en: "Product Catalog" },
  "catalog.search.placeholder": { ru: "Поиск по названию или описанию...", en: "Search by name or description..." },
  "catalog.search.btn": { ru: "Найти", en: "Search" },
  "catalog.filters": { ru: "Фильтры", en: "Filters" },
  "catalog.category": { ru: "Категория", en: "Category" },
  "catalog.category.all": { ru: "Все категории", en: "All Categories" },
  "catalog.country": { ru: "Страна происхождения", en: "Origin Country" },
  "catalog.country.all": { ru: "Все страны", en: "All Countries" },
  "catalog.found": { ru: "товаров найдено", en: "products found" },
  "catalog.empty.title": { ru: "Товары не найдены", en: "No products found" },
  "catalog.empty.desc": { ru: "Попробуйте изменить параметры поиска или фильтры", en: "Try adjusting your search or filters" },
  "catalog.moq": { ru: "Мин. заказ", en: "MOQ" },

  // Product Detail
  "product.rfq": { ru: "Отправить запрос (RFQ)", en: "Send Inquiry (RFQ)" },
  "product.favorite": { ru: "В избранное", en: "Add to Favorites" },
  "product.supplier": { ru: "Поставщик", en: "Supplier" },
  "product.origin": { ru: "Страна производства", en: "Origin Country" },
  "product.price": { ru: "Цена", en: "Price" },
  "product.moq": { ru: "Минимальный заказ", en: "Minimum Order" },
  "product.description": { ru: "Описание", en: "Description" },

  // Login
  "login.title": { ru: "Добро пожаловать", en: "Welcome Back" },
  "login.subtitle": { ru: "Войдите в свой аккаунт AsiaBridge", en: "Sign in to your AsiaBridge account" },
  "login.email": { ru: "Электронная почта", en: "Email" },
  "login.password": { ru: "Пароль", en: "Password" },
  "login.submit": { ru: "Войти", en: "Sign In" },
  "login.submitting": { ru: "Вход...", en: "Signing in..." },
  "login.noAccount": { ru: "Нет аккаунта?", en: "Don't have an account?" },
  "login.register": { ru: "Зарегистрироваться", en: "Register now" },
  "login.error": { ru: "Ошибка входа", en: "Login failed" },

  // Register
  "register.title": { ru: "Создать аккаунт", en: "Create Account" },
  "register.subtitle": { ru: "Выберите, как вы хотите использовать AsiaBridge", en: "Choose how you want to use AsiaBridge" },
  "register.buyer": { ru: "Я — Покупатель", en: "I am a Buyer" },
  "register.buyer.desc": { ru: "Ищу товары у проверенных поставщиков из России и СНГ", en: "Source products from verified suppliers in Russia and CIS" },
  "register.supplier": { ru: "Я — Поставщик", en: "I am a Supplier" },
  "register.supplier.desc": { ru: "Продаю товары оптовым покупателям в Юго-Восточной Азии", en: "Sell products to wholesale buyers in Southeast Asia" },
  "register.as.buyer": { ru: "Регистрация как Покупатель", en: "Register as Buyer" },
  "register.as.supplier": { ru: "Регистрация как Поставщик", en: "Register as Supplier" },
  "register.form.subtitle": { ru: "Заполните данные для начала работы", en: "Fill in your details to get started" },
  "register.email": { ru: "Электронная почта", en: "Email" },
  "register.password": { ru: "Пароль", en: "Password" },
  "register.company": { ru: "Название компании", en: "Company Name" },
  "register.country": { ru: "Страна", en: "Country" },
  "register.category": { ru: "Основная категория товаров", en: "Primary Category" },
  "register.back": { ru: "Назад", en: "Back" },
  "register.submit": { ru: "Завершить регистрацию", en: "Complete Registration" },
  "register.submitting": { ru: "Создание аккаунта...", en: "Creating account..." },
  "register.hasAccount": { ru: "Уже есть аккаунт?", en: "Already have an account?" },
  "register.login": { ru: "Войти", en: "Sign in" },
  "register.error": { ru: "Ошибка регистрации", en: "Registration failed" },

  // Dashboard
  "dashboard.title": { ru: "Личный кабинет", en: "Dashboard" },
  "dashboard.overview": { ru: "Обзор", en: "Overview" },
  "dashboard.products": { ru: "Мои товары", en: "My Products" },
  "dashboard.rfqs": { ru: "Запросы и сообщения", en: "RFQs & Messages" },
  "dashboard.myRfqs": { ru: "Мои запросы", en: "My RFQs" },
  "dashboard.favorites": { ru: "Избранное", en: "Favorites" },
  "dashboard.profile": { ru: "Профиль компании", en: "Company Profile" },

  // Footer
  "footer.marketplace": { ru: "Маркетплейс", en: "Marketplace" },
  "footer.catalog": { ru: "Каталог товаров", en: "Product Catalog" },
  "footer.suppliers": { ru: "Поставщики", en: "Suppliers" },
  "footer.becomeSupplier": { ru: "Стать поставщиком", en: "Become a Supplier" },
  "footer.becomeBuyer": { ru: "Стать покупателем", en: "Become a Buyer" },
  "footer.services": { ru: "Услуги", en: "Services" },
  "footer.logistics": { ru: "Международная логистика", en: "Cross-border Logistics" },
  "footer.escrow": { ru: "Эскроу и факторинг", en: "Escrow & Factoring" },
  "footer.legal": { ru: "Юридическая поддержка", en: "Legal Support" },
  "footer.insurance": { ru: "Страхование", en: "Insurance" },
  "footer.contact": { ru: "Контакты", en: "Contact" },
  "footer.rights": { ru: "Все права защищены", en: "All rights reserved" },
  "footer.terms": { ru: "Условия использования", en: "Terms of Service" },
  "footer.privacy": { ru: "Политика конфиденциальности", en: "Privacy Policy" },
  "footer.desc": { ru: "Прямые поставки от производителей России и СНГ покупателям Юго-Восточной Азии", en: "Direct supplies from Russian and CIS manufacturers to Southeast Asian buyers" },
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
