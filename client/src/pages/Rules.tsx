import { Navigation } from "@/components/Navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ShieldCheck, ImageIcon, Package, DollarSign, Star, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Rules() {
  const { t } = useTranslation();

  const rules = [
    { icon: ImageIcon, title: t("rule_photos_title"), desc: t("rule_photos_desc"), color: "bg-blue-50 text-blue-600" },
    { icon: Package, title: t("rule_packs_title"), desc: t("rule_packs_desc"), color: "bg-purple-50 text-purple-600" },
    { icon: DollarSign, title: t("rule_pricing_title"), desc: t("rule_pricing_desc"), color: "bg-emerald-50 text-emerald-600" },
    { icon: Star, title: t("rule_reviews_title"), desc: t("rule_reviews_desc"), color: "bg-amber-50 text-amber-600" },
    { icon: ShieldCheck, title: t("rule_quality_title"), desc: t("rule_quality_desc"), color: "bg-rose-50 text-rose-600" },
    { icon: AlertTriangle, title: t("rule_violations_title"), desc: t("rule_violations_desc"), color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full mb-6">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">{t("rules_badge")}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-secondary mb-4" data-testid="text-rules-title">
              {t("rules_title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              {t("rules_subtitle")}
            </p>
          </motion.div>

          <div className="space-y-6">
            {rules.map((rule, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100/60 hover:shadow-lg transition-all duration-300 flex items-start gap-6"
                data-testid={`card-rule-${idx}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${rule.color} flex items-center justify-center shrink-0`}>
                  <rule.icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-secondary mb-2">{rule.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{rule.desc}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/40 text-xs">&copy; 2024 Arsi Wedding Planner</p>
        </div>
      </footer>
    </div>
  );
}
