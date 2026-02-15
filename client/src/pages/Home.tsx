import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ArrowRight, Star, Sparkles, HeartHandshake, Users as UsersIcon, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProviders } from "@/hooks/use-providers";

import heroWedding from "@/assets/hero-wedding.png";

export default function Home() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [budget, setBudget] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  
  const { data: providers } = useProviders();

  const handleAiRecommendation = () => {
    // In a real app, this would store the intent and redirect to plan page with prefilled data
    setLocation("/plan");
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden py-12">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-multiply pointer-events-none" 
          style={{ backgroundImage: `url(${heroWedding})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                {t("hero_title").split(t("hero_span"))[0]}
                <span className="text-primary">{t("hero_span")}</span>
                {t("hero_title").split(t("hero_span"))[1]}
              </h1>
              <p className="text-xl text-gray-200 mb-8 font-light max-w-xl">
                {t("hero_subtitle")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                    {t("start_planning")} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/providers">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold backdrop-blur-sm">
                    {t("browse_providers")}
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* AI Recommendation Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-display text-secondary">
                    <Sparkles className="w-6 h-6 text-primary" />
                    {t("ai_box_title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <UsersIcon className="w-4 h-4" /> {t("guest_count")}
                    </label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 200"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="bg-muted/50 border-none h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <Receipt className="w-4 h-4" /> {t("budget")}
                    </label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 80000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="bg-muted/50 border-none h-12 text-lg"
                    />
                  </div>
                  <Button 
                    onClick={handleAiRecommendation}
                    className="w-full h-14 text-lg font-bold bg-secondary hover:bg-secondary/90 text-white shadow-lg"
                  >
                    {t("get_recommendation")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4">{t("why_choose")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We combine traditional Moroccan elegance with modern planning tools to make your special day effortless.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: t("ai_powered"),
                desc: t("ai_desc")
              },
              {
                icon: Star,
                title: t("curated"),
                desc: t("curated_desc")
              },
              {
                icon: HeartHandshake,
                title: t("budget_mgmt"),
                desc: t("budget_desc")
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-8 rounded-2xl border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-2xl font-display font-bold">ARSI</span>
            <p className="text-white/60 text-sm mt-2">Making Moroccan weddings unforgettable.</p>
          </div>
          <div className="flex gap-8 text-sm text-white/80">
            <Link href="/providers" className="hover:text-primary transition-colors">Providers</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link href="/register" className="hover:text-primary transition-colors">Register</Link>
          </div>
          <p className="text-white/40 text-xs">© 2024 Arsi Wedding Planner</p>
        </div>
      </footer>
    </div>
  );
}
