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
  Store, Star, Eye, MessageSquare, Utensils, Home as HomeIcon,
  Music, Camera, UserRound, Paintbrush, Check, Loader2,
  Upload, ImagePlus, Trash2, Pencil, X, Image as ImageIcon, MapPin
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

  const cityMutation = useMutation({
    mutationFn: async (city: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ city })
        .eq('id', user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "City saved" });
      setChangingCity(false);
    },
  });

  const categoryMutation = useMutation({
    mutationFn: async (serviceCategory: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ service_category: serviceCategory })
        .eq('id', user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Service selected" });
      setSelectedCategory(null);
    },
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user || user.role !== "provider") { setLocation("/login"); return null; }

  const currentCategory = user.serviceCategory;
  const currentCatInfo = SERVICE_CATEGORIES.find(c => c.id === currentCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary">Provider Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user.displayName || user.username}!</p>
        </div>

        {currentCategory && currentCatInfo ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="border-primary/20">
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${currentCatInfo.bg} flex items-center justify-center`}>
                    <currentCatInfo.icon className="w-7 h-7 opacity-80" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Your Service</p>
                    <p className="text-xl font-bold text-secondary">{currentCatInfo.name}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedCategory(currentCategory)}>Change</Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-emerald-600 opacity-80" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Your City</p>
                    <p className="text-xl font-bold text-secondary">{user.city || "Not set"}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setChangingCity(true)}>Change</Button>
                </CardContent>
              </Card>
            </div>

            {selectedCategory && (
              <ServiceCategoryPicker
                pendingSelection={selectedCategory}
                onSelect={setSelectedCategory}
                onConfirm={() => categoryMutation.mutate(selectedCategory)}
                onCancel={() => setSelectedCategory(null)}
                isPending={categoryMutation.isPending}
              />
            )}

            {changingCity && (
              <CityPicker
                currentCity={user.city}
                onConfirm={(city) => cityMutation.mutate(city)}
                onCancel={() => setChangingCity(false)}
                isPending={cityMutation.isPending}
              />
            )}

            <PhotoGallery userId={user.id} />
          </>
        ) : (
          <ServiceCategoryPicker
            pendingSelection={selectedCategory}
            onSelect={setSelectedCategory}
            onConfirm={() => selectedCategory && categoryMutation.mutate(selectedCategory)}
            isPending={categoryMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

function PhotoGallery({ userId }: { userId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

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
      if (!previewFile) return;
      setIsUploading(true);

      const fileExt = previewFile.name.split('.').pop();
      const fileName = `${userId}/${Math.random()}.${fileExt}`;
      
      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolios')
        .upload(fileName, previewFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolios')
        .getPublicUrl(fileName);

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from('provider_photos')
        .insert({
          user_id: userId,
          image_url: publicUrl,
          description: uploadDescription
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-photos", userId] });
      toast({ title: "Photo uploaded successfully" });
      setPreviewFile(null);
      setPreviewUrl(null);
      setUploadDescription("");
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
      setIsUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (photo: any) => {
      // Extract path from URL
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
    const file = e.target.files?.[0];
    if (file) {
      setPreviewFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" /> My Portfolio</CardTitle>
        <CardDescription>Showcase your work to potential clients.</CardDescription>
      </CardHeader>
      <CardContent>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
        
        {previewUrl ? (
          <div className="mb-6 p-4 border-2 border-dashed rounded-2xl bg-primary/5 flex gap-4">
            <img src={previewUrl} className="w-32 h-32 object-cover rounded-xl" />
            <div className="flex-1 space-y-3">
              <Textarea 
                placeholder="Describe this photo..." 
                value={uploadDescription} 
                onChange={(e) => setUploadDescription(e.target.value)} 
              />
              <div className="flex gap-2">
                <Button onClick={() => uploadMutation.mutate()} disabled={isUploading}>
                  {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />} Upload
                </Button>
                <Button variant="outline" onClick={() => setPreviewUrl(null)}>Cancel</Button>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} className="w-full mb-6 p-8 border-2 border-dashed rounded-2xl hover:bg-primary/5 transition-all">
            <ImagePlus className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Click to add photos of your work</p>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos?.map((photo) => (
            <div key={photo.id} className="group relative rounded-xl overflow-hidden border">
              <img src={photo.image_url} className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                <p className="text-white text-sm">{photo.description}</p>
                <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(photo)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceCategoryPicker({ pendingSelection, onSelect, onConfirm, onCancel, isPending }: any) {
  return (
    <Card className="mb-8">
      <CardHeader><CardTitle>Select Your Service</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${pendingSelection === cat.id ? `ring-2 ${cat.selected} ${cat.border}` : "border-border hover:border-primary/30"}`}
            >
              <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center mb-3`}><cat.icon className="w-6 h-6" /></div>
              <h3 className="font-bold text-secondary">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">{cat.desc}</p>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Button onClick={onConfirm} disabled={!pendingSelection || isPending}>
            {isPending && <Loader2 className="animate-spin mr-2" />} Confirm Selection
          </Button>
          {onCancel && <Button variant="outline" onClick={onCancel}>Cancel</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

function CityPicker({ currentCity, onConfirm, onCancel, isPending }: any) {
  const [city, setCity] = useState(currentCity || "");
  return (
    <Card className="mb-8">
      <CardHeader><CardTitle>Select Your City</CardTitle></CardHeader>
      <CardContent>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full max-w-xs mb-6"><SelectValue placeholder="Choose a city..." /></SelectTrigger>
          <SelectContent>{MOROCCO_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <div className="flex gap-3">
          <Button onClick={() => onConfirm(city)} disabled={!city || isPending}>
            {isPending && <Loader2 className="animate-spin mr-2" />} Confirm City
          </Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}