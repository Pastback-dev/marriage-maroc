import { Navigation } from "@/components/Navigation";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Utensils, Home as HomeIcon, Music, Camera, UserRound, Paintbrush, ArrowRight, Sparkles } from "lucide-react";
import { useProviders } from "@/hooks/use-providers";
import traditionalHall from "@/assets/moroccan-traditional-hall.png";

export default function Categories() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { data: providers } = useProviders();

  const categories = [
    { id: "traiteur", name: t("category_traiteur"), icon: Utensils, color: "from-orange-400 to-orange-600", bg: "bg-orange-50", desc: t("cat_desc_traiteur") },
    { id: "hall", name: t("category_hall"), icon: HomeIcon, color: "from-blue-400 to-blue-600", bg: "bg-blue-50", desc: t("cat_desc_hall") },
    { id: "dj", name: t("category_dj"), icon: Music, color: "from-purple-400 to-purple-600", bg: "bg-purple-50", desc: t("cat_desc_dj") },
    { id: "cameraman", name: t("category_cameraman"), icon: Camera, color: "from-rose-400 to-rose-600", bg: "bg-rose-50", desc: t("cat_desc_cameraman") },
    { id: "neggafa", name: t("category_neggafa"), icon: UserRound, color: "from-amber-400 to-amber-600", bg: "bg-amber-50", desc: t("cat_desc_neggafa") },
    { id: "decoration", name: t("category_decoration"), icon: Paintbrush, color: "from-emerald-400 to-emerald-600", bg: "bg-emerald-50", desc: t("cat_desc_decoration") },
    { id: "other", name: t("category_other"), icon: Sparkles, color: "from-slate-400 to-slate-600", bg: "bg-slate-50", desc: t("cat_desc_other") },
  ];

  const getProviderCount = (catId: string) => {
    return providers?.filter((p: any) => p.serviceCategory === catId).length || 0;
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />

      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-8 pointer-events-none"
          style={{ backgroundImage: `url(${traditionalHall})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 to-white/80 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-secondary mb-4" data-testid="text-categories-title">
              {t("all_categories")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              {t("categories_subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => {
              const count = getProviderCount(cat.id);
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer"
                  onClick={() => setLocation(`/providers?category=${cat.id}`)}
                  data-testid={`card-category-${cat.id}`}
                >
                  <div className="relative rounded-3xl overflow-hidden bg-white shadow-md border border-slate-100/60 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                    <div className={`h-2 w-full bg-gradient-to-r ${cat.color}`} />
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-16 h-16 rounded-2xl ${cat.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                          <cat.icon className="w-8 h-8 text-current opacity-80" />
                        </div>
                        {count > 0 && (
                          <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full" data-testid={`text-provider-count-${cat.id}`}>
                            {count} {t("nav_providers")}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {cat.desc}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                        {t("browse_providers")} <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}