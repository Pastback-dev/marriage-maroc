import { ArrowRight, Star, Sparkles, HeartHandshake, Users as UsersIcon, Receipt, MapPin, Utensils, Home as HomeIcon, Music, Camera, UserRound, Paintbrush } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { GuestTable } from "@/components/GuestTable";
import { useGuests } from "@/hooks/use-guests";
import { Footer } from "@/components/Footer";
import { SearchResultsDialog } from "@/components/SearchResultsDialog";
import heroWedding from "@/assets/hero-moroccan-hall.png";
import traditionalHall from "@/assets/moroccan-traditional-hall.png";

export default function Home() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [city, setCity] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toast } = useToast();

  const { data: allGuests, isLoading: guestsLoading } = useGuests();

  // Filter only validated guests for the community list
  const validatedGuests = useMemo(() => {
    return allGuests?.filter(guest => guest.validated) || [];
  }, [allGuests]);

  const cities = [
    { id: "Casablanca", name: t("city_casablanca") },
    { id: "Rabat", name: t("city_rabat") },
    { id: "Marrakech", name: t("city_marrakech") },
    { id: "Fes", name: t("city_fes") },
    { id: "Tangier", name: t("city_tangier") },
    { id: "Agadir", name: t("city_agadir") },
  ];

  const categories = [
    { id: "traiteur", name: t("category_traiteur"), icon: Utensils },
    { id: "hall", name: t("category_hall"), icon: HomeIcon },
    { id: "dj", name: t("category_dj"), icon: Music },
    { id: "cameraman", name: t("category_cameraman"), icon: Camera },
    { id: "neggafa", name: t("category_neggafa"), icon: UserRound },
    { id: "decoration", name: t("category_decoration"), icon: Paintbrush },
    { id: "other", name: t("category_other"), icon: Sparkles },
  ];

  const handleSearch = () => {
    if (!city) {
      toast({
        title: "City Required",
        description: "Please select a city to search for providers.",
        variant: "destructive"
      });
      return;
    }

    if (selectedCategories.length === 0) {
      toast({
        title: "Category Required",
        description: "Please select at least one service category.",
        variant: "destructive"
      });
      return;
    }

    setIsSearchOpen(true);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-12">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${heroWedding})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10" />

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
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold rounded-full min-h-12">
                    {t("browse_providers")}
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Provider Search Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-white shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-amber-50/50 pb-5 pt-8 px-8">
                  <CardTitle className="flex items-center gap-3 text-xl font-display text-secondary" data-testid="text-search-title">
                    <div className="p-2 bg-gradient-to-br from-primary/20 to-amber-200/30 rounded-xl">
                      <span className="text-primary"><MapPin className="w-5 h-5" /></span>
                    </div>
                    Find Wedding Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-8 pt-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-primary/70" /> Select City
                    </label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="bg-white border border-border/50 h-11 text-base rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all" data-testid="select-city">
                        <SelectValue placeholder="Choose a city..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/30 shadow-xl p-1.5 bg-white">
                        {cities.map(c => (
                          <SelectItem key={c.id} value={c.id} className="rounded-lg py-2.5 focus:bg-primary/8 focus:text-primary transition-colors cursor-pointer">{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
                      Service Categories
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => {
                        const isSelected = selectedCategories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${isSelected
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-border/50 hover:border-primary/30 hover:bg-slate-50"
                              }`}
                            data-testid={`category-${cat.id}`}
                          >
                            <cat.icon className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            <span className={`text-xs font-medium text-center ${isSelected ? "text-primary" : "text-secondary"}`}>
                              {cat.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={handleSearch}
                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white shadow-lg shadow-secondary/15 rounded-xl transition-all active:scale-[0.98]"
                    data-testid="button-search-providers"
                  >
                    Find Providers
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Results Dialog */}
      <SearchResultsDialog 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        city={city} 
        categories={selectedCategories} 
      />

      {/* Categories Section */}
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6">
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
                onClick={() => {
                  setCity(""); // Clear city for broad category search
                  setSelectedCategories([cat.id]);
                  setIsSearchOpen(true);
                }}
              >
                <div className="flex flex-col items-center gap-4 p-6 rounded-[2rem] bg-white shadow-sm border border-slate-100/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                    <cat.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-secondary text-center group-hover:text-primary transition-colors duration-300">
                    {cat.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-secondary mb-6">{t("why_choose")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">{t("features_intro")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16 mb-24">
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

          {/* Global Guest List Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold text-secondary mb-4">Community Guest List</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">See how other couples are planning their celebrations across Morocco.</p>
            </div>
            <Card className="border-primary/10 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <GuestTable
                  guests={validatedGuests}
                  isLoading={guestsLoading}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}