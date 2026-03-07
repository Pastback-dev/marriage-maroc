import { Navigation } from "@/components/Navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ImageIcon, 
  Package, 
  DollarSign, 
  Star, 
  AlertTriangle, 
  CheckCircle2,
  Home as HomeIcon,
  Users,
  Heart,
  UserRound,
  Ban,
  Gavel,
  Wallet
} from "lucide-react";
import { Footer } from "@/components/Footer";

export default function Rules() {
  const { t } = useTranslation();

  const platformRules = [
    { icon: ImageIcon, title: t("rule_photos_title"), desc: t("rule_photos_desc"), color: "bg-blue-50 text-blue-600" },
    { icon: Package, title: t("rule_packs_title"), desc: t("rule_packs_desc"), color: "bg-purple-50 text-purple-600" },
    { icon: DollarSign, title: t("rule_pricing_title"), desc: t("rule_pricing_desc"), color: "bg-emerald-50 text-emerald-600" },
    { icon: Star, title: t("rule_reviews_title"), desc: t("rule_reviews_desc"), color: "bg-amber-50 text-amber-600" },
    { icon: ShieldCheck, title: t("rule_quality_title"), desc: t("rule_quality_desc"), color: "bg-rose-50 text-rose-600" },
    { icon: AlertTriangle, title: t("rule_violations_title"), desc: t("rule_violations_desc"), color: "bg-red-50 text-red-600" },
  ];

  const eventRules = [
    { icon: HomeIcon, title: t("rule_venue_title"), desc: t("rule_venue_desc"), color: "bg-slate-50 text-slate-600" },
    { icon: Users, title: t("rule_staff_title"), desc: t("rule_staff_desc"), color: "bg-indigo-50 text-indigo-600" },
    { icon: Heart, title: t("rule_family_title"), desc: t("rule_family_desc"), color: "bg-pink-50 text-pink-600" },
    { icon: UserRound, title: t("rule_clothing_title"), desc: t("rule_clothing_desc"), color: "bg-amber-50 text-amber-600" },
    { icon: Ban, title: t("rule_conduct_title"), desc: t("rule_conduct_desc"), color: "bg-orange-50 text-orange-600" },
    { icon: Gavel, title: t("rule_violation_title"), desc: t("rule_violation_desc"), color: "bg-red-50 text-red-600" },
    { icon: Wallet, title: t("rule_fees_title"), desc: t("rule_fees_desc"), color: "bg-emerald-50 text-emerald-600" },
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

          <div className="space-y-16">
            {/* Platform Standards */}
            <div>
              <h2 className="text-2xl font-display font-bold text-secondary mb-8 border-b pb-4">Platform Standards</h2>
              <div className="space-y-6">
                {platformRules.map((rule, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100/60 hover:shadow-lg transition-all duration-300 flex items-start gap-6"
                    data-testid={`card-platform-rule-${idx}`}
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

            {/* Event Conduct */}
            <div>
              <h2 className="text-2xl font-display font-bold text-secondary mb-8 border-b pb-4">Event Conduct</h2>
              <div className="space-y-6">
                {eventRules.map((rule, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100/60 hover:shadow-lg transition-all duration-300 flex items-start gap-6"
                    data-testid={`card-event-rule-${idx}`}
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}