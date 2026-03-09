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
  FileText, Banknote, Phone, MessageCircle, UserCircle, Link as LinkIcon, ExternalLink
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const MOROCCO_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Meknes", "Oujda", "Kenitra", "Tetouan"
];

const SERVICE_CATEGORIES = [
  { id: "traiteur", icon: Utensils, color: "from-orange-400 to-orange-600", bg: "bg-orange-50", border: "border-orange-300", selected: "ring-orange-500 bg-orange-50" },
  { id: "hall", icon: HomeIcon, color: "from-blue-400 to-blue-600", bg: "bg-blue-50", border: "border-blue-300", selected: "ring-blue-500 bg-blue-50" },
  { id: "dj", icon: Music, color: "from-purple-400 to-purple-600", bg: "bg-purple-50", border: "border-purple-300", selected: "ring-purple-500 bg-purple-50" },
  { id: "cameraman", icon: Camera, color: "from-rose-400 to-rose-600", bg: "bg-rose-50", border: "border-rose-300", selected: "ring-rose-500 bg-rose-50" },
  { id: "neggafa", icon: UserRound, color: "from-amber-400 to-amber-600", bg: "bg-amber-50", border: "border-amber-300", selected: "ring-amber-500 bg-amber-50" },
  { id: "decoration", icon: Paintbrush, color: "from-emerald-400 to-emerald-600", bg: "bg-emerald-50", border: "border-emerald-300", selected: "ring-emerald-500 bg-emerald-50" },
  { id: "other", icon: Sparkles, color: "from-slate-400 to-slate-600", bg: "bg-slate-50", border: "border-slate-300", selected: "ring-slate-500 bg-slate-50" },
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
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const { t } = useTranslation();

  const nameMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!user?.id) throw new Error("User not found");
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: name,
          role: 'provider'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Name updated" });
      setEditingName(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Error saving name", description: error.message });
    }
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
    mutationFn: async ({ min, max }: { min: number; max: number }) => {
      if (!user?.id) throw new Error("User not found");
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          price_min: min,
          price_max: max,
          role: 'provider'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Pricing updated" });
      setEditingPrice(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Error saving pricing", description: error.message });
    }
  });

  const phoneMutation = useMutation({
    mutationFn: async (phone: string) => {
      if (!user?.id) throw new Error("User not found");
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          phone: phone,
          role: 'provider'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Phone number saved" });
      setEditingPhone(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Error saving phone", description: error.message });
    }
  });

  const urlMutation = useMutation({
    mutationFn: async (url: string) => {
      if (!user?.id) throw new Error("User not found");
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          url: url,
          role: 'provider'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Link updated" });
      setEditingUrl(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Error saving link", description: error.message });
    }
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user || user.role !== "provider") {
    setLocation("/login");
    return null;
  }

  const currentCategory = user.serviceCategory;
  const currentCatInfo = SERVICE_CATEGORIES.find(c => c.id === currentCategory);

  // Clean phone number for WhatsApp link (remove non-digits)
  const whatsappNumber = user.phone?.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary">{t("pd_title")}</h1>
          <p className="text-muted-foreground mt-2">{t("pd_welcome", { name: user.displayName || user.username })}</p>
        </div>

        <div className="mb-8">
          <PhotoGallery userId={user.id} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/20 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <UserCircle className="w-7 h-7 text-primary opacity-80" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("pd_business_name")}</p>
                <p className="text-xl font-bold text-secondary truncate max-w-[120px]">{user.displayName || t("pd_not_set")}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditingName(true)}>
                {t("pd_edit")}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${currentCatInfo?.bg || 'bg-slate-100'} flex items-center justify-center`}>
                {currentCatInfo ? <currentCatInfo.icon className="w-7 h-7 opacity-80" /> : <Store className="w-7 h-7 opacity-40" />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("pd_service")}</p>
                <p className="text-xl font-bold text-secondary">{currentCatInfo ? t(`category_${currentCatInfo.id}`) : t("pd_not_set")}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedCategory(currentCategory || "")}>
                {t("pd_edit")}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-emerald-600 opacity-80" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("pd_city")}</p>
                <p className="text-xl font-bold text-secondary">{user.city || t("pd_not_set")}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setChangingCity(true)}>
                {t("pd_edit")}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Banknote className="w-7 h-7 text-amber-600 opacity-80" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("pd_price")}</p>
                <p className="text-xl font-bold text-secondary">
                  {user.priceMin !== null ? `${user.priceMin.toLocaleString()} MAD` : t("pd_not_set")}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditingPrice(true)}>
                {t("pd_edit")}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Large Phone Card */}
          <Card className="border-primary/30 shadow-md bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center justify-between gap-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center shadow-inner">
                <Phone className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{t("pd_phone_label")}</p>
                <p className="text-3xl font-bold text-secondary tracking-tight">
                  {user.phone || t("pd_not_set")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-primary/20 hover:bg-primary/5"
                  onClick={() => setEditingPhone(true)}
                >
                  {t("pd_edit_number")}
                </Button>
                {whatsappNumber && (
                  <Button
                    className="flex-1 h-12 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 rounded-xl transition-all active:scale-95"
                    onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Website/Social Link Card */}
          <Card className="border-primary/30 shadow-md bg-gradient-to-br from-white to-purple-50/30 overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center justify-between gap-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-purple-100 flex items-center justify-center shadow-inner">
                <LinkIcon className="w-10 h-10 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{t("pd_link_label")}</p>
                <p className="text-xl font-bold text-secondary tracking-tight truncate max-w-[250px]">
                  {user.url || t("pd_no_link")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-primary/20 hover:bg-primary/5"
                  onClick={() => setEditingUrl(true)}
                >
                  {t("pd_edit_link")}
                </Button>
                {user.url && (
                  <Button
                    className="flex-1 h-12 font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 rounded-xl transition-all active:scale-95"
                    onClick={() => window.open(user.url!, '_blank')}
                  >
                    <ExternalLink className="w-5 h-5 mr-2" /> {t("pd_visit_link")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {editingName && (
          <div className="mb-8">
            <NamePicker
              currentName={user.displayName}
              onConfirm={(name: string) => nameMutation.mutate(name)}
              onCancel={() => setEditingName(false)}
              isPending={nameMutation.isPending}
            />
          </div>
        )}

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
              onConfirm={(city: string) => cityMutation.mutate(city)}
              onCancel={() => setChangingCity(false)}
              isPending={cityMutation.isPending}
            />
          </div>
        )}

        {editingPrice && (
          <div className="mb-8">
            <PricePicker
              currentMin={user.priceMin}
              currentMax={user.priceMax}
              onConfirm={(min: number, max: number) => priceMutation.mutate({ min, max })}
              onCancel={() => setEditingPrice(false)}
              isPending={priceMutation.isPending}
            />
          </div>
        )}

        {editingPhone && (
          <div className="mb-8">
            <PhonePicker
              currentPhone={user.phone}
              onConfirm={(phone: string) => phoneMutation.mutate(phone)}
              onCancel={() => setEditingPhone(false)}
              isPending={phoneMutation.isPending}
            />
          </div>
        )}

        {editingUrl && (
          <div className="mb-8">
            <UrlPicker
              currentUrl={user.url}
              onConfirm={(url: string) => urlMutation.mutate(url)}
              onCancel={() => setEditingUrl(false)}
              isPending={urlMutation.isPending}
            />
          </div>
        )}

        <Card className="mb-8 border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> {t("pd_desc_title")}
            </CardTitle>
            <CardDescription>{t("pd_desc_subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {editingDescription ? (
              <div className="space-y-4">
                <Textarea
                  defaultValue={user.description || ""}
                  placeholder={t("pd_desc_placeholder")}
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
                    {descriptionMutation.isPending && <Loader2 className="animate-spin mr-2" />} {t("pd_save_desc")}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingDescription(false)}>{t("cancel")}</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {user.description || t("pd_no_desc")}
                </p>
                <Button variant="outline" onClick={() => setEditingDescription(true)}>
                  {user.description ? t("pd_edit_desc") : t("pd_add_desc")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PhotoGallery({ userId }: { userId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<{ url: string; file: File }[]>([]);
  const { t } = useTranslation();

  const { data: photos, isLoading } = useQuery({
    queryKey: ["provider-photos", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provider_photos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (previews.length === 0) return;

      const currentCount = photos?.length || 0;
      if (currentCount + previews.length > 5) {
        throw new Error("Maximum 5 photos allowed in portfolio");
      }

      setIsUploading(true);

      for (const preview of previews) {
        const fileExt = preview.file.name.split('.').pop();
        const fileName = `${userId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolios')
          .upload(fileName, preview.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolios')
          .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from('provider_photos')
          .insert({
            user_id: userId,
            image_url: publicUrl,
            description: null
          });

        if (dbError) throw dbError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-photos", userId] });
      toast({ title: `${previews.length} photo(s) uploaded successfully` });
      setPreviews([]);
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
      setIsUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (photo: any) => {
      const path = photo.image_url.split('/portfolios/')[1];
      await supabase.storage.from('portfolios').remove([path]);
      await supabase.from('provider_photos').delete().eq('id', photo.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-photos", userId] });
      toast({ title: "Photo deleted" });
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentCount = photos?.length || 0;
    const pendingCount = previews.length;

    const totalPotential = currentCount + pendingCount + files.length;

    if (totalPotential > 5) {
      const allowedCount = 5 - (currentCount + pendingCount);
      if (allowedCount <= 0) {
        toast({
          variant: "destructive",
          title: "Limit reached",
          description: "You already have 5 photos in your portfolio."
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "Partial selection",
        description: `Only ${allowedCount} more photo(s) can be added to reach the limit of 5.`
      });

      const allowedFiles = files.slice(0, allowedCount);
      const newPreviews = allowedFiles.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
    } else {
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const isAtLimit = (photos?.length || 0) >= 5;

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5 text-primary" /> {t("pd_gallery_title")}</CardTitle>
        <CardDescription>{t("pd_gallery_subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          disabled={isAtLimit}
        />

        {previews.length > 0 && (
          <div className="mb-8 p-6 border-2 border-dashed rounded-2xl bg-primary/5">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
              {previews.map((p, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm">
                  <img src={p.url} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setPreviews(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button onClick={() => uploadMutation.mutate()} disabled={isUploading} className="bg-primary hover:bg-primary/90">
                {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 w-4 h-4" />}
                {t("pd_upload_photos", { count: previews.length })}
              </Button>
              <Button variant="outline" onClick={() => setPreviews([])}>{t("pd_clear_all")}</Button>
            </div>
          </div>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAtLimit}
          className="w-full mb-8 p-12 border-2 border-dashed rounded-2xl hover:bg-primary/5 hover:border-primary/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
            <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-lg font-bold text-secondary">
            {isAtLimit ? t("pd_limit_reached") : t("pd_add_photos")}
          </p>
          <p className="text-sm text-muted-foreground">
            {isAtLimit ? t("pd_limit_desc") : t("pd_select_hint")}
          </p>
        </button>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
        ) : photos?.length === 0 ? (
          <div className="text-center py-12 border rounded-2xl bg-slate-50/50">
            <p className="text-muted-foreground">{t("pd_gallery_empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos?.map((photo) => (
              <div key={photo.id} className="group relative rounded-2xl overflow-hidden border shadow-sm aspect-square">
                <img src={photo.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => { if (confirm(t("pd_delete_confirm"))) deleteMutation.mutate(photo); }}
                  >
                    <Trash2 className="w-4 h-4" /> {t("pd_delete_photo")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NamePicker({ currentName, onConfirm, onCancel, isPending }: any) {
  const [name, setName] = useState(currentName || "");
  const { t } = useTranslation();
  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle>{t("pd_name_title")}</CardTitle>
        <CardDescription>{t("pd_name_subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-xs space-y-6">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("pd_name_placeholder")}
            className="h-12 rounded-xl"
          />
          <div className="flex gap-3">
            <Button onClick={() => onConfirm(name)} disabled={!name || isPending} className="bg-secondary hover:bg-secondary/90">
              {isPending && <Loader2 className="animate-spin mr-2" />} {t("pd_save_name")}
            </Button>
            <Button variant="outline" onClick={onCancel}>{t("cancel")}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceCategoryPicker({ pendingSelection, onSelect, onConfirm, onCancel, isPending }: any) {
  const { t } = useTranslation();
  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle>{t("pd_service_title")}</CardTitle>
        <CardDescription>{t("pd_service_subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${pendingSelection === cat.id
                ? `ring-2 ${cat.selected} ${cat.border}`
                : "border-border hover:border-primary/30 hover:bg-slate-50"
                }`}
            >
              <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center mb-4 shadow-sm`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-secondary text-lg">{t(`category_${cat.id}`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(`cat_desc_${cat.id}`)}</p>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onConfirm}
            disabled={!pendingSelection || isPending}
            className="bg-secondary hover:bg-secondary/90 px-8"
          >
            {isPending && <Loader2 className="animate-spin mr-2" />} {t("pd_confirm_selection")}
          </Button>
          {onCancel && <Button variant="outline" onClick={onCancel}>{t("cancel")}</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

function CityPicker({ currentCity, onConfirm, onCancel, isPending }: any) {
  const [city, setCity] = useState(currentCity || "");
  const { t } = useTranslation();
  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle>{t("pd_city_title")}</CardTitle>
        <CardDescription>{t("pd_city_subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-xs space-y-6">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder={t("choose_city")} /></SelectTrigger>
            <SelectContent className="rounded-xl">
              {MOROCCO_CITIES.map(c => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-3">
            <Button onClick={() => onConfirm(city)} disabled={!city || isPending} className="bg-secondary hover:bg-secondary/90">
              {isPending && <Loader2 className="animate-spin mr-2" />} {t("pd_save_city")}
            </Button>
            <Button variant="outline" onClick={onCancel}>{t("cancel")}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PricePicker({ currentMin, currentMax, onConfirm, onCancel, isPending }: any) {
  const [min, setMin] = useState(currentMin || 0);
  const [max, setMax] = useState(currentMax || 0);
  const { t } = useTranslation();
  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle>{t("pd_price_title")}</CardTitle>
        <CardDescription>{t("pd_price_subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-md space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("pd_min_price")}</label>
              <Input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                placeholder="e.g. 5000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("pd_max_price")}</label>
              <Input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                placeholder="e.g. 15000"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => onConfirm(min, max)} disabled={isPending} className="bg-secondary hover:bg-secondary/90">
              {isPending && <Loader2 className="animate-spin mr-2" />} {t("pd_save_pricing")}
            </Button>
            <Button variant="outline" onClick={onCancel}>{t("cancel")}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PhonePicker({ currentPhone, onConfirm, onCancel, isPending }: any) {
  const [phone, setPhone] = useState(currentPhone || "");
  const { t } = useTranslation();
  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle>{t("pd_phone_title")}</CardTitle>
        <CardDescription>{t("pd_phone_subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-xs space-y-6">
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+212 6XX XXX XXX"
            className="h-12 rounded-xl"
          />
          <div className="flex gap-3">
            <Button onClick={() => onConfirm(phone)} disabled={!phone || isPending} className="bg-secondary hover:bg-secondary/90">
              {isPending && <Loader2 className="animate-spin mr-2" />} {t("pd_save_phone")}
            </Button>
            <Button variant="outline" onClick={onCancel}>{t("cancel")}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UrlPicker({ currentUrl, onConfirm, onCancel, isPending }: any) {
  const [url, setUrl] = useState(currentUrl || "");
  const { t } = useTranslation();
  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle>{t("pd_url_title")}</CardTitle>
        <CardDescription>{t("pd_url_subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-xs space-y-6">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://instagram.com/yourprofile"
            className="h-12 rounded-xl"
          />
          <div className="flex gap-3">
            <Button onClick={() => onConfirm(url)} disabled={!url || isPending} className="bg-secondary hover:bg-secondary/90">
              {isPending && <Loader2 className="animate-spin mr-2" />} {t("pd_save_link")}
            </Button>
            <Button variant="outline" onClick={onCancel}>{t("cancel")}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}