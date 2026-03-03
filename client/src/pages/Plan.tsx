import { Navigation } from "@/components/Navigation";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useProviders } from "@/hooks/use-providers";
import { t } from "i18next";
import { useToast } from "@/hooks/use-toast";

export default function Plan() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: providers } = useProviders(); // This will fetch providers from API
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get distinct categories from providers for dropdown
  const categories = Array.from(
    new Set(providers?.map((p) => p.category) || [])
  ).sort();

  const handleGenerate = async () => {
    if (!selectedCity || !selectedCategory) {
      toast({
        title: t("select_city_and_category"),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    // Filter providers by city and category
    const filtered = providers?.filter(
      (p) => p.city === selectedCity && p.category === selectedCategory
    ) || [];

    setSearchResults(filtered);
    setLoading(false);

    // Navigate to a simple results view or just display here
    if (filtered.length === 0) {
      toast({
        title: t("no_providers_found"),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-secondary">
            {t("ai_box_title")}
          </h1>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300 text-xl font-display">
              {t("ai_box_title").split(t("ai_box_title"))[1]}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* City Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t("city")}
              </label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="flex-1 min-w-64 bg-white border border-border/30 rounded-xl px-3 py-2 text-base font-medium focus:ring-primary/20 focus:border-primary/30 transition-all">
                  <SelectValue placeholder={t("select_city")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/30 shadow-xl p-1.5 bg-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="rounded-lg py-2.5 focus:bg-primary/8 focus:text-primary transition-colors cursor-pointer">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-primary" />
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t("category")}
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="flex-1 min-w-64 bg-white border border-border/30 rounded-xl px-3 py-2 text-base font-medium focus:ring-primary/20 focus:border-primary/30 transition-all">
                  <SelectValue placeholder={t("select_category")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/30 shadow-xl p-1.5 bg-white">
                  {["traiteur", "hall", "dj", "cameraman", "neggafa", "decoration", "other"].map((cat) => (
                    <SelectItem key={cat} value={cat} className="rounded-lg py-2.5 focus:bg-primary/8 focus:text-primary transition-colors cursor-pointer">
                      {t(`category_${cat}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGenerate}
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white shadow-lg shadow-secondary/15 rounded-xl transition-all active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("generating")}
              </>
            ) : (
              {t("generate_plan")}
            )}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults?.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary mb-4">
              {t("providers_found")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((provider) => (
                <Card key={provider.id} className="border-primary/20 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 uppercase tracking-wide text-xs font-bold">
                        {provider.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2 line-clamp-1">
                      {provider.displayName || provider.username}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {provider.description || "No description available."}
                    </p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {provider.city}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Fallback when no results */}
        {!loading && searchResults?.length === 0 && selectedCity && selectedCategory && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t("no_providers_match")}</p>
            <Button variant="outline" onClick={() => setLocation("/providers")}>
              {t("browse_providers")}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}