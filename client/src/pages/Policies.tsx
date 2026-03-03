import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, FileText, Eye, Scale, Bell } from "lucide-react";

export default function Policies() {
  const sections = [
    {
      title: "Privacy Policy",
      icon: Lock,
      content: "At Arsi, we take your privacy seriously. We collect only the information necessary to provide you with the best wedding planning experience. This includes your contact details, wedding preferences, and guest list information. We never sell your data to third parties."
    },
    {
      title: "Terms of Service",
      icon: Scale,
      content: "By using Arsi, you agree to provide accurate information and use the platform for its intended purpose of wedding planning. Providers agree to maintain high standards of service and authentic representation of their work."
    },
    {
      title: "Data Security",
      icon: ShieldCheck,
      content: "We use industry-standard encryption and security measures to protect your personal information and planning data. Your account is secured with password hashing and secure session management."
    },
    {
      title: "Cookie Policy",
      icon: Eye,
      content: "We use essential cookies to keep you logged in and remember your preferences. These cookies are necessary for the platform to function correctly and provide a seamless user experience."
    },
    {
      title: "Vendor Guidelines",
      icon: FileText,
      content: "Vendors must adhere to our quality standards, including using authentic photos of their own work and providing transparent pricing. Failure to comply may result in removal from the platform."
    },
    {
      title: "Updates to Policies",
      icon: Bell,
      content: "We may update these policies from time to time to reflect changes in our services or legal requirements. We will notify users of any significant changes via the platform."
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">Platform Policies</h1>
          <p className="text-muted-foreground text-lg">Transparency and trust are the foundation of Arsi.</p>
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