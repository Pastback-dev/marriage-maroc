import { useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Store, Utensils, Home as HomeIcon,
  Music, Camera, UserRound, Paintbrush, Loader2,
  Upload, ImagePlus, Trash2, ImageIcon, MapPin, Sparkles,
  FileText, DollarSign
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef } from "react";

const MOROCCO_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Meknes", "Oujda", "Kenitra", "Tetouan"
];

const SERVICE_CATEGORIES = [
  { id: "traiteur", name: "Catering", desc: "Exquisite Moroccan cuisine.", icon: Utensils, color: "from-orange-400 to-orange-600", bg: "bg-orange-50", border: "border-orange-300", selected: "ring-orange-500 bg-orange-50" },
  { id: "hall", name: "Wedding Venues", desc: "Magnificent reception halls.", icon: HomeIcon, color: "from-blue-400 to-blue-600", bg: "bg-blue-50", border: "border-blue-300", selected: "ring-blue-500 bg-blue-50" },
  { id: "dj", name: "DJ & Live Orchestra", desc: "Premium DJ sets.", icon: Music, color: "from-purple-400 to-purple-600", bg: "bg-purple-50", border: "border-purple-300", selected: "ring-purple-500 bg-purple-50" },
  { id: "cameraman", name: "Photography", desc: "Cinematic storytelling.", icon: Camera, color: "from-rose-400 to-rose-600", bg: "bg-rose-50", border: "border-rose-300", selected: "ring-rose-500 bg-rose-50" },
  { id: "neggafa", name: "Bridal Makeup", desc: "The art of bridal beauty.", icon: UserRound, color: "from-amber-400 to-amber-600", bg: "bg-amber-50", border: "border-amber-300", selected: "ring-amber-500 bg-amber-50" },
  { id: "decoration", name: "Decor", desc: "Magical Moroccan paradise.", icon: Paintbrush, color: "from-emerald-400 to-emerald-600", bg: "bg-emerald-50", border: "border-emerald-300", selected: "ring-emerald-500 bg-emerald-50" },
];

export default function ProviderDashboard() {
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [changingCity, setChangingCity] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);

  // Fetch provider details from profiles table
  const { data: providerDetails } = useQuery({
    queryKey: ["provider-details", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!user,
  });

  const cityMutation = useMutation({
    mutationFn: async (city: string) => {
      if (!user?.id) throw new Error("User not found");
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          city: city,
          role: 'provider'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "City saved" });
      setChangingCity(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Error saving city", description: error.message });
    }
  });

  const categoryMutation = useMutation({
    mutationFn: async (serviceCategory: string) => {
      if (!user?.id) throw new Error("User not found");
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          service_category: serviceCategory,
          role: 'provider'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Service selected" });
      setSelectedCategory(null);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Error saving service", description: error.message });
    }
  });

  const descriptionMutation = useMutation({
    mutationFn: async (description: string) => {
      if (!user?.id) throw new Error("User not found");
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          description: description,
          role: 'provider'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Description saved" });
      setEditingDescription(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Error saving description", description: error.message });
    }
  });

  const priceMutation = useMutation({
    mutationFn: async ({ priceMin, priceMax }: { priceMin: number; priceMax: number }) => {
      if (!user?.id) throw new Error("User not found");
      
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          price_min: priceMin,
          price_max: priceMax,
          role: 'provider'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-details", user?.id] });
      toast({ title: "Pricing saved" });
      setEditingPrice(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Error saving pricing", description: error.message });
    }
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  
  if (!user || user.role !== "provider") { 
    setLocation("/login"); 
    return null; 
  }

  const currentCategory = user.serviceCategory;
  const currentCatInfo = SERVICE_CATEGORIES.find(c => c.id === currentCategory);
  
  const currentPriceMin = providerDetails?.price_min || 0;
  const currentPriceMax = providerDetails?.price_max || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary">Provider Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user.displayName || user.username}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="border-primary/20 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${currentCatInfo?.bg || 'bg-slate-100'} flex items-center justify-center`}>
                {currentCatInfo ? <currentCatInfo.icon className="w-7 h-7 opacity-80" /> : <Store className="w-7 h-7 opacity-40" />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Service</p>
                <p className="text-xl font-bold text-secondary">{currentCatInfo?.name || "Not selected"}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedCategory(currentCategory || "")}>
                {currentCategory ? "Change" : "Select"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-emerald-600 opacity-80" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your City</p>
                <p className="text-xl font-bold text-secondary">{user.city || "Not set"}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setChangingCity(true)}>
                {user.city ? "Change" : "Set City"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Card */}
        <Card className="border-primary/20 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> Pricing
            </CardTitle>
            <CardDescription>Set your price range for services</CardDescription>
          </CardHeader>
          <CardContent>
            {editingPrice ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Price (MAD)</label>
                  <Input 
                    type="number" 
                    defaultValue={currentPriceMin}
                    placeholder="e.g., 150"
                    id="price-min-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Price (MAD)</label>
                  <Input 
                    type="number" 
                    defaultValue={currentPriceMax}
                    placeholder="e.g., 500"
                    id="price-max-input"
                  />
                </div>
                <div className="flex gap-3 md:col-span-2">
                  <Button 
                    onClick={() => {
                      const min = parseInt((document.getElementById('price-min-input') as HTMLInputElement).value);
                      const max = parseInt((document.getElementById('price-max-input') as HTMLInputElement).value);
                      if (min > 0 && max >= min) {
                        priceMutation.mutate({ priceMin: min, priceMax: max });
                      } else {
                        toast({ variant: "destructive", title: "Invalid prices", description: "Max must be >= min and both must be positive" });
                      }
                    }}
                    disabled={priceMutation.isPending}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    {priceMutation.isPending && <Loader2 className="animate-spin mr-2" />} Save Pricing
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPrice(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Price Range</p>
                  <p className="text-xl font-bold text-secondary">
                    {currentPriceMin > 0 || currentPriceMax > 0 
                      ? `${currentPriceMin.toLocaleString()} - ${currentPriceMax.toLocaleString()} MAD`
                      : "Not set"}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setEditingPrice(true)}>
                  {currentPriceMin > 0 || currentPriceMax > 0 ? "Edit" : "Set Pricing"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedCategory !== null && (
          <div className="mb-8">
            <ServiceCategoryPicker
              pendingSelection={selectedCategory}
              onSelect={setSelectedCategory}
              onConfirm={() => categoryMutation.mutate(selectedCategory)}
              onCancel={() => setSelectedCategory(null)}
              isPending={categoryMutation.isPending}
            />
          </div>
        )}

        {changingCity && (
          <div className="mb-8">
            <CityPicker
              currentCity={user.city}
              onConfirm={(city) => cityMutation.mutate(city)}
              onCancel={() => setChangingCity(false)}
              isPending={cityMutation.isPending}
            />
          </div>
        )}

        <Card className="mb-8 border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Business Description
            </CardTitle>
            <CardDescription>Tell couples about your services, experience, and what makes you unique.</CardDescription>
          </CardHeader>
          <CardContent>
            {editingDescription ? (
              <div className="space-y-4">
                <Textarea 
                  defaultValue={user.description || ""} 
                  placeholder="Write a detailed description of your business..."
                  className="min-h-[150px]"
                  id="business-description"
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                      const val = (document.getElementById('business-description') as HTMLTextAreaElement).value;
                      descriptionMutation.mutate(val);
                    }}
                    disabled={descriptionMutation.isPending}
                  >
                    {descriptionMutation.isPending && <Loader2 className="animate-spin mr-2" />} Save Description
                  </Button>
                  <Button variant="outline" onClick={() => setEditingDescription(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {user.description || "No description added yet. Add one to help couples understand your services."}
                </p>
                <Button variant="outline" onClick={() => setEditingDescription(true)}>
                  {user.description ? "Edit Description" : "Add Description"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <PhotoGallery userId={user.id} />
      </div>
    </div>
  );
}

function PhotoGallery({ userId }: { userId: string }) {
  // ... same as before ...
}