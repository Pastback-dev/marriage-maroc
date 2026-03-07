import { Navigation } from "@/components/Navigation";
import { useProviders } from "@/hooks/use-providers";
import { ProviderCard } from "@/components/ProviderCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Meknes", "Oujda", "Kenitra", "Tetouan",
  "Safi", "Mohammedia", "Khouribga", "El Jadida", "Beni Mellal", "Nador", "Taza", "Settat", "Berrechid",
  "Khemisset", "Guelmim", "Ksar El Kebir", "Larache", "Berkane", "Khenifra", "Taourirt", "Bouskoura",
  "Fquih Ben Salah", "Dakhla", "Sidi Slimane", "Errachidia", "Guercif", "Oulad Teima", "Ben Guerir",
  "Tifelt", "Lqliaa", "Taroudant", "Sefrou", "Essaouira", "Fnideq", "Sidi Kacem", "Tiznit", "Tan-Tan",
  "Ouarzazate", "Youssoufia", "Martil"
].sort();

export default function ProvidersList() {
  const { t } = useTranslation();
  const [city, setCity] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const { data: providers, isLoading } = useProviders({
    city: city === "all" ? undefined : city,
    categories: category === "all" ? undefined : [category],
    search: search === "" ? undefined : search
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-secondary mb-2">Our Vendors</h1>
            <p className="text-muted-foreground">Discover wedding professionals in Morocco</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                className="pl-9 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full sm:w-48 bg-white">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">All Cities</SelectItem>
                {MOROCCAN_CITIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48 bg-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="traiteur">{t("category_traiteur")}</SelectItem>
                <SelectItem value="hall">{t("category_hall")}</SelectItem>
                <SelectItem value="dj">{t("category_dj")}</SelectItem>
                <SelectItem value="cameraman">{t("category_cameraman")}</SelectItem>
                <SelectItem value="neggafa">{t("category_neggafa")}</SelectItem>
                <SelectItem value="decoration">{t("category_decoration")}</SelectItem>
                <SelectItem value="other">{t("category_other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : providers?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border">
            <p className="text-lg text-muted-foreground">No vendors found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers?.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}