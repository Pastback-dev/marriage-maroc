import { ArrowRight, Star, Sparkles, HeartHandshake, Users as UsersIcon, Receipt, MapPin, Utensils, Home as HomeIcon, Music, Camera, UserRound, Paintbrush } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProviders } from "@/hooks/use-providers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [budget, setBudget] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const { toast } = useToast();
  
  const { data: providers } = useProviders();

  const handleAiRecommendation = () => {
    if (!city) {
      toast({
        title: t("city"),
        description: t("select_city"),
        variant: "destructive"
      });
      return;
    }
    // In a real app, we would pass city, budget, guests to the planning engine
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
              <p className="text-xl text-gray-200 mb-8 font-light max-w-xl leading-relaxed">
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
                <CardHeader className="bg-primary/5 pb-6 pt-10 px-10">
                  <CardTitle className="flex items-center gap-3 text-2xl font-display text-secondary">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    {t("ai_box_title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-10">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-1">
                        <UsersIcon className="w-3 h-3 text-primary" /> {t("guest_count")}
                      </label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 200"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="bg-muted/40 border-none h-12 text-lg rounded-2xl focus-visible:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 text-primary" /> {t("city")}
                      </label>
                      <Select value={city} onValueChange={setCity}>
                        <SelectTrigger className="bg-muted/40 border-none h-12 text-lg rounded-2xl focus:ring-primary/20 transition-all">
                          <SelectValue placeholder={t("select_city")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                          {["Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir"].map(c => (
                            <SelectItem key={c} value={c} className="rounded-xl py-3 focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-1">
                      <Receipt className="w-3 h-3 text-primary" /> {t("budget")}
                    </label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 80000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="bg-muted/40 border-none h-12 text-lg rounded-2xl focus-visible:ring-primary/20 transition-all"
                    />
                  </div>
                  <Button 
                    onClick={handleAiRecommendation}
                    className="w-full h-14 text-lg font-bold bg-secondary hover:bg-secondary/90 text-white shadow-xl shadow-secondary/20 rounded-2xl transition-all active:scale-[0.98] hover-elevate"
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
      <section className="py-24 bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">Every detail of your wedding deserves perfection. Our platform brings you the best of Morocco with ease.</p>
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
