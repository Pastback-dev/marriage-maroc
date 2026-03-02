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
  Upload, ImagePlus, Trash2, ImageIcon, MapPin, Sparkles
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";

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
      if (!user?.id) throw new Error("User not found");
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          city: city,
          role: 'provider' // Ensure role is preserved
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
          role: 'provider' // Ensure role is preserved
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  
  if (!user || user.role !== "provider") { 
    setLocation("/login"); 
    return null; 
  }

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

        {!currentCategory && !selectedCategory && (
          <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex items-center gap-4 mb-8">
            <Sparkles className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-secondary">Complete Your Profile</h2>
              <p className="text-muted-foreground">Select your service category to help couples find you more easily.</p>
            </div>
          </div>
        )}

        <PhotoGallery userId={user.id} />
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
      
      const { error: uploadError } = await supabase.storage
        .from('portfolios')
        .upload(fileName, previewFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolios')
        .getPublicUrl(fileName);

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
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5 text-primary" /> My Portfolio</CardTitle>
        <CardDescription>Showcase your work to potential clients.</CardDescription>
      </CardHeader>
      <CardContent>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
        
        {previewUrl ? (
          <div className="mb-6 p-6 border-2 border-dashed rounded-2xl bg-primary/5 flex flex-col sm:flex-row gap-6">
            <img src={previewUrl} className="w-full sm:w-48 h-48 object-cover rounded-xl shadow-md" />
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Photo Description</label>
                <Textarea 
                  placeholder="Tell clients about this work (e.g., 'Traditional wedding in Marrakech')" 
                  value={uploadDescription} 
                  onChange={(e) => setUploadDescription(e.target.value)} 
                  className="bg-white"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => uploadMutation.mutate()} disabled={isUploading} className="bg-primary hover:bg-primary/90">
                  {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 w-4 h-4" />} Start Upload
                </Button>
                <Button variant="outline" onClick={() => { setPreviewUrl(null); setPreviewFile(null); }}>Cancel</Button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-full mb-8 p-12 border-2 border-dashed rounded-2xl hover:bg-primary/5 hover:border-primary/30 transition-all group"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
              <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-lg font-bold text-secondary">Add Portfolio Photos</p>
            <p className="text-sm text-muted-foreground">Click to browse your files (JPG, PNG, WebP)</p>
          </button>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
        ) : photos?.length === 0 ? (
          <div className="text-center py-12 border rounded-2xl bg-slate-50/50">
            <p className="text-muted-foreground">Your portfolio is empty. Upload your first photo above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos?.map((photo) => (
              <div key={photo.id} className="group relative rounded-2xl overflow-hidden border shadow-sm aspect-square">
                <img src={photo.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-white text-sm font-medium mb-4 line-clamp-3">{photo.description}</p>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-fit gap-2"
                    onClick={() => { if(confirm("Delete this photo?")) deleteMutation.mutate(photo); }}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
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

function ServiceCategoryPicker({ pendingSelection, onSelect, onConfirm, onCancel, isPending }: any) {
  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle>What service do you provide?</CardTitle>
        <CardDescription>This helps us show your profile to the right couples.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                pendingSelection === cat.id 
                  ? `ring-2 ${cat.selected} ${cat.border}` 
                  : "border-border hover:border-primary/30 hover:bg-slate-50"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center mb-4 shadow-sm`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-secondary text-lg">{cat.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={onConfirm} 
            disabled={!pendingSelection || isPending}
            className="bg-secondary hover:bg-secondary/90 px-8"
          >
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
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle>Where are you located?</CardTitle>
        <CardDescription>Couples often search for vendors in specific cities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-xs space-y-6">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Choose a city..." /></SelectTrigger>
            <SelectContent className="rounded-xl">
              {MOROCCO_CITIES.map(c => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-3">
            <Button onClick={() => onConfirm(city)} disabled={!city || isPending} className="bg-secondary hover:bg-secondary/90">
              {isPending && <Loader2 className="animate-spin mr-2" />} Save City
            </Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}