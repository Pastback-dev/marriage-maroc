import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "hero_title": "Your Dream Moroccan Wedding Awaits",
      "hero_span": "Moroccan Wedding",
      "hero_subtitle": "Plan your perfect \"Arsi\" with our AI-powered planner. From Neggafas to Traiteurs, discover the best providers in Morocco.",
      "start_planning": "Start Planning Free",
      "browse_providers": "Browse Providers",
      "ai_box_title": "Instant AI Recommendation",
      "guest_count": "Number of Guests",
      "budget": "Total Budget (MAD)",
      "city": "City",
      "select_city": "Select City",
      "get_recommendation": "Get AI Recommendation",
      "nav_plan": "My Plan",
      "nav_guests": "Guests",
      "nav_providers": "Providers",
      "all_categories": "All Categories",
      "categories_subtitle": "Discover everything you need for your special day",
      "category_traiteur": "Catering",
      "category_hall": "Venues",
      "category_dj": "Music & DJ",
      "category_cameraman": "Photography",
      "category_neggafa": "Neggafa",
      "category_decoration": "Decoration",
      "city_rabat": "Rabat",
      "city_casablanca": "Casablanca",
      "city_marrakech": "Marrakech",
      "city_fes": "Fes",
      "city_tangier": "Tangier",
      "city_agadir": "Agadir",
      "sign_in": "Sign In",
      "get_started": "Get Started",
      "why_choose": "Why Choose Arsi?",
      "ai_powered": "AI-Powered Planning",
      "ai_desc": "Tell us your budget and style, and we'll generate the perfect vendor package instantly.",
      "curated": "Curated Providers",
      "curated_desc": "Every Neggafa, Traiteur, and Hall is vetted for quality and authenticity.",
      "budget_mgmt": "Budget Management",
      "budget_desc": "Track every Dirham. Manage guest lists and payments in one dashboard."
    }
  },
  fr: {
    translation: {
      "hero_title": "Votre Mariage Marocain de Rêve Vous Attend",
      "hero_span": "Mariage Marocain",
      "hero_subtitle": "Planifiez votre \"Arsi\" parfait avec notre planificateur IA. Des Neggafas aux Traiteurs, découvrez les meilleurs prestataires au Maroc.",
      "start_planning": "Commencer Gratuitement",
      "browse_providers": "Parcourir les Prestataires",
      "ai_box_title": "Recommandation IA Instantanée",
      "guest_count": "Nombre d'invités",
      "budget": "Budget Total (MAD)",
      "city": "Ville",
      "select_city": "Sélectionner la ville",
      "get_recommendation": "Obtenir une recommandation IA",
      "nav_plan": "Mon Plan",
      "nav_guests": "Invités",
      "nav_providers": "Prestataires",
      "all_categories": "Toutes les Catégories",
      "categories_subtitle": "Découvrez tout ce dont vous avez besoin pour votre grand jour",
      "category_traiteur": "Traiteur",
      "category_hall": "Salles",
      "category_dj": "Musique & DJ",
      "category_cameraman": "Photographie",
      "category_neggafa": "Neggafa",
      "category_decoration": "Décoration",
      "city_rabat": "Rabat",
      "city_casablanca": "Casablanca",
      "city_marrakech": "Marrakech",
      "city_fes": "Fès",
      "city_tangier": "Tanger",
      "city_agadir": "Agadir",
      "sign_in": "Se Connecter",
      "get_started": "Commencer",
      "why_choose": "Pourquoi Choisir Arsi?",
      "ai_powered": "Planification par IA",
      "ai_desc": "Dites-nous votre budget et votre style, et nous générerons instantanément le forfait vendeur parfait.",
      "curated": "Prestataires Sélectionnés",
      "curated_desc": "Chaque Neggafa, Traiteur et Salle est vérifié pour sa qualité et son authenticité.",
      "budget_mgmt": "Gestion du Budget",
      "budget_desc": "Suivez chaque Dirham. Gérez les listes d'invités et les paiements dans un seul tableau de bord."
    }
  },
  ar: {
    translation: {
      "hero_title": "عرسك المغربي المثالي في انتظارك",
      "hero_span": "عرس مغربي",
      "hero_subtitle": "خطط لـ \"عرسك\" المثالي من خلال مخططنا المدعوم بالذكاء الاصطناعي. من النكافات إلى الممونين، اكتشف أفضل المزودين في المغرب.",
      "start_planning": "ابدأ التخطيط مجاناً",
      "browse_providers": "تصفح المزودين",
      "ai_box_title": "توصية فورية بالذكاء الاصطناعي",
      "guest_count": "عدد الضيوف",
      "budget": "الميزانية الإجمالية (درهم)",
      "city": "المدينة",
      "select_city": "اختر المدينة",
      "get_recommendation": "احصل على توصية الذكاء الاصطناعي",
      "nav_plan": "خطتي",
      "nav_guests": "الضيوف",
      "nav_providers": "المزودون",
      "all_categories": "كل الفئات",
      "categories_subtitle": "اكتشف كل ما تحتاجه ليومك الكبير",
      "category_traiteur": "ممون الحفلات",
      "category_hall": "قاعات الأفراح",
      "category_dj": "الموسيقى و دي جي",
      "category_cameraman": "التصوير الفوتوغرافي",
      "category_neggafa": "النكافة",
      "category_decoration": "الديكور",
      "city_rabat": "الرباط",
      "city_casablanca": "الدار البيضاء",
      "city_marrakech": "مراكش",
      "city_fes": "فاس",
      "city_tangier": "طنجة",
      "city_agadir": "أكادير",
      "sign_in": "تسجيل الدخول",
      "get_started": "ابدأ الآن",
      "why_choose": "لماذا تختار عرسي؟",
      "ai_powered": "تخطيط مدعوم بالذكاء الاصطناعي",
      "ai_desc": "أخبرنا بميزانيتك وأسلوبك، وسنقوم بإنشاء حزمة البائعين المثالية على الفور.",
      "curated": "مزودون مختارون",
      "curated_desc": "يتم فحص كل نكافة وممون وقاعة لضمان الجودة والأصالة.",
      "budget_mgmt": "إدارة الميزانية",
      "budget_desc": "تتبع كل درهم. إدارة قوائم الضيوف والمدفوعات في لوحة تحكم واحدة."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
