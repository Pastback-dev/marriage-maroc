import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, FileText, Eye, Scale, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Policies() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t("policy_privacy_title"),
      icon: Lock,
      content: t("policy_privacy_content")
    },
    {
      title: t("policy_terms_title"),
      icon: Scale,
      content: t("policy_terms_content")
    },
    {
      title: t("policy_security_title"),
      icon: ShieldCheck,
      content: t("policy_security_content")
    },
    {
      title: t("policy_cookie_title"),
      icon: Eye,
      content: t("policy_cookie_content")
    },
    {
      title: t("policy_vendor_title"),
      icon: FileText,
      content: t("policy_vendor_content")
    },
    {
      title: t("policy_updates_title"),
      icon: Bell,
      content: t("policy_updates_content")
    }
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">{t("policies_title")}</h1>
          <p className="text-muted-foreground text-lg">{t("policies_subtitle")}</p>
        </motion.div>

        <div className="grid gap-8">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100/60"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <section.icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-secondary">{section.title}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}