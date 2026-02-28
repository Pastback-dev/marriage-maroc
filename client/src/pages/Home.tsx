import { ArrowRight, Star, Sparkles, HeartHandshake, Users as UsersIcon, Receipt, MapPin, Utensils, Home as HomeIcon, Music, Camera, UserRound, Paintbrush } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProviders } from "@/hooks/use-providers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import heroWedding from "@/assets/hero-moroccan-hall.png";
import traditionalHall from "@/assets/moroccan-traditional-hall.png";

export default function Home() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [budget, setBudget] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const { toast } = useToast();
  
  const { data: providers } = useProviders();

  const cities = [
    { id: "Casablanca", name: t("city_casablanca") },
    { id: "Rabat", name: t("city_rabat") },
    { id: "Marrakech", name: t("city_marrakech") },
    { id: "Fes", name: t("city_fes") },
    { id: "Tangier", name: t("city_tangier") },
    { id: "Agadir", name: t("city_agadir") },
  ];

  const handleAiRecommendation = () => {
    if (!city) {
      toast({
        title: t("city"),
        description: t("select_city"),
        variant: "destructive"
      });
      return;
    }
    setLocation(`/plan?city=${city}&budget=${budget}&guests=${guests}`);
  };

  const categories = [
    { id: "traiteur", name: t("category_traiteur"), icon: Utensils, color: "bg-orange-50 text-orange-600" },
    { id: "hall", name: t("category_hall"), icon: HomeIcon, color: "bg-blue-50 text-blue-600" },
    { id: "dj", name: t("category_dj"), icon: Music, color: "bg-purple-50 text-purple-600" },
    { id: "cameraman", name: t("category_cameraman"), icon: Camera, color: "bg-rose-50 text-rose-600" },
    { id: "neggafa", name: t("category_neggafa"), icon: UserRound, color: "bg-amber-50 text-amber-600" },
    { id: "decoration", name: t("category_decoration"), icon: Paintbrush, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-12">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 pointer-events-none" 
          style={{ backgroundImage: `url(${heroWedding})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e]/95 via-[#1a0a2e]/80 to-[#1a0a2e]/70 z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-5 leading-tight drop-shadow-lg" data-testid="text-hero-title">
                {t("hero_title").split(t("hero_span"))[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-primary to-amber-300 drop-shadow-none">{t("hero_span")}</span>
                {t("hero_title").split(t("hero_span"))[1]}
              </h1>
              <p className="text-base md:text-lg text-white/90 mb-8 max-w-xl leading-relaxed drop-shadow-sm">
                {t("hero_subtitle")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all rounded-full min-h-12">
                    {t("start_planning")} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/providers">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold backdrop-blur-sm rounded-full min-h-12">
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
              <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-amber-50/50 pb-5 pt-8 px-8">
                  <CardTitle className="flex items-center gap-3 text-xl font-display text-secondary" data-testid="text-ai-title">
                    <div className="p-2 bg-gradient-to-br from-primary/20 to-amber-200/30 rounded-xl">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    {t("ai_box_title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-8 pt-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                        <UsersIcon className="w-3 h-3 text-primary/70" /> {t("guest_count")}
                      </label>
                      <Input 
                        type="number" 
                        placeholder="200"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="bg-muted/30 border border-border/30 h-11 text-base rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all"
                        data-testid="input-guests"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-primary/70" /> {t("city")}
                      </label>
                      <Select value={city} onValueChange={setCity}>
                        <SelectTrigger className="bg-muted/30 border border-border/30 h-11 text-base rounded-xl focus:ring-primary/20 focus:border-primary/30 transition-all" data-testid="select-city">
                          <SelectValue placeholder={t("select_city")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/30 shadow-xl p-1.5">
                          {cities.map(c => (
                            <SelectItem key={c.id} value={c.id} className="rounded-lg py-2.5 focus:bg-primary/8 focus:text-primary transition-colors cursor-pointer">{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                      <Receipt className="w-3 h-3 text-primary/70" /> {t("budget")}
                    </label>
                    <Input 
                      type="number" 
                      placeholder="80,000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="bg-muted/30 border border-border/30 h-11 text-base rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all"
                      data-testid="input-budget"
                    />
                  </div>
                  <Button 
                    onClick={handleAiRecommendation}
                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white shadow-lg shadow-secondary/15 rounded-xl transition-all active:scale-[0.98]"
                    data-testid="button-generate"
                  >
                    {t("get_recommendation")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section - Redesigned UI */}
      <section className="py-24 bg-slate-50/40 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-5 pointer-events-none" 
          style={{ backgroundImage: `url(${traditionalHall})` }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-secondary mb-4">{t("all_categories")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">{t("categories_subtitle")}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer"
                onClick={() => setLocation(`/providers?category=${cat.id}&city=${city}`)}
              >
                <div className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-white shadow-sm border border-slate-100/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm`}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-bold text-secondary text-center group-hover:text-primary transition-colors duration-300">
                    {cat.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Improved Spacing & Style */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-secondary mb-6">{t("why_choose")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">{t("features_intro")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                icon: Sparkles,
                title: t("ai_powered"),
                desc: t("ai_desc"),
                accent: "border-amber-200 bg-amber-50/30"
              },
              {
                icon: Star,
                title: t("curated"),
                desc: t("curated_desc"),
                accent: "border-emerald-200 bg-emerald-50/30"
              },
              {
                icon: HeartHandshake,
                title: t("budget_mgmt"),
                desc: t("budget_desc"),
                accent: "border-blue-200 bg-blue-50/30"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`p-10 rounded-[2.5rem] border-2 transition-all duration-500 group relative overflow-hidden ${feature.accent}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 text-primary">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4 tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{feature.desc}</p>
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
            <p className="text-white/60 text-sm mt-2">{t("footer_tagline")}</p>
          </div>
          <div className="flex gap-8 text-sm text-white/80">
            <Link href="/providers" className="hover:text-primary transition-colors">{t("nav_providers")}</Link>
            <Link href="/categories" className="hover:text-primary transition-colors">{t("nav_categories")}</Link>
            <Link href="/rules" className="hover:text-primary transition-colors">{t("nav_rules")}</Link>
          </div>
          <p className="text-white/40 text-xs">&copy; 2025 Arsi</p>
        </div>
      </footer>
    </div>
  );
}
