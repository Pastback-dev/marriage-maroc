import { Navigation } from "@/components/Navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Heart, Shield, Users, Sparkles, MapPin, Star } from "lucide-react";
import { Footer } from "@/components/Footer";
import traditionalHall from "@/assets/moroccan-traditional-hall.png";

export default function AboutUs() {
  const { t } = useTranslation();

  const values = [
    { icon: Heart, title: t("about_value_passion"), desc: t("about_value_passion_desc"), color: "bg-rose-50 text-rose-600" },
    { icon: Shield, title: t("about_value_trust"), desc: t("about_value_trust_desc"), color: "bg-blue-50 text-blue-600" },
    { icon: Users, title: t("about_value_community"), desc: t("about_value_community_desc"), color: "bg-amber-50 text-amber-600" },
  ];

  const stats = [
    { value: "6", label: t("about_stat_cities") },
    { value: "6", label: t("about_stat_categories") },
    { value: "24/7", label: t("about_stat_support") },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />

      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: `url(${traditionalHall})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/95 to-secondary/80 z-0" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-white/80 text-sm font-medium">{t("about_badge")}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6" data-testid="text-about-title">
              {t("about_title")}
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              {t("about_subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-display font-bold text-primary mb-2" data-testid={`text-stat-${idx}`}>{stat.value}</p>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4">{t("about_mission_title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              {t("about_mission_desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100/60 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${val.color} flex items-center justify-center mb-6`}>
                  <val.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{val.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MapPin className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold text-secondary mb-4">{t("about_coverage_title")}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {t("about_coverage_desc")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir"].map((city) => (
                <span key={city} className="px-5 py-2 bg-primary/5 text-primary font-semibold rounded-full text-sm border border-primary/10" data-testid={`badge-city-${city.toLowerCase()}`}>
                  {t(`city_${city.toLowerCase()}`)}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}