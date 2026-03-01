import { useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fes",
  "Tangier",
  "Agadir",
  "Meknes",
  "Oujda",
  "Kenitra",
  "Tetouan",
  "El Jadida",
  "Safi",
  "Mohammedia",
  "Khouribga",
  "Beni Mellal",
  "Nador",
  "Taza",
  "Settat",
  "Berrechid",
  "Khémisset",
  "Errachidia",
  "Ouarzazate",
  "Guelmim",
  "Dakhla",
  "Laayoune",
  "Tiznit",
  "Ifrane",
  "Chefchaouen",
  "Essaouira",
  "Taroudant",
];

const SERVICE_CATEGORIES = [
  {
    id: "traiteur",
    name: "Catering",
    desc: "Exquisite Moroccan cuisine and bespoke dining experiences for your celebration.",
    icon: Utensils,
    color: "from-orange-400 to-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-300",
    selected: "ring-orange-500 bg-orange-50",
  },
  {
    id: "hall",
    name: "Wedding Venues",
    desc: "Magnificent reception halls and exclusive venues across Morocco.",
    icon: HomeIcon,
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-300",
    selected: "ring-blue-500 bg-blue-50",
  },
  {
    id: "dj",
    name: "DJ & Live Orchestra",
    desc: "Premium DJ sets and live orchestral performances for the perfect atmosphere.",
    icon: Music,
    color: "from-purple-400 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-300",
    selected: "ring-purple-500 bg-purple-50",
  },
  {
    id: "cameraman",
    name: "Photography",
    desc: "Cinematic storytelling to immortalize every precious moment.",
    icon: Camera,
    color: "from-rose-400 to-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-300",
    selected: "ring-rose-500 bg-rose-50",
  },
  {
    id: "neggafa",
    name: "Bridal Makeup",
    desc: "The art of bridal beauty, from henna to full wedding makeup for your special day.",
    icon: UserRound,
    color: "from-amber-400 to-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-300",
    selected: "ring-amber-500 bg-amber-50",
  },
  {
    id: "decoration",
    name: "Decor",
    desc: "Transform any space into a magical Moroccan wedding paradise.",
    icon: Paintbrush,
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    selected: "ring-emerald-500 bg-emerald-50",
  },
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
      const res = await apiRequest("PATCH", "/api/provider/city", { city });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({ title: "City saved", description: "Your city has been updated." });
      setChangingCity(false);
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to update city." });
    },
  });

  const categoryMutation = useMutation({
    mutationFn: async (serviceCategory: string) => {
      const res = await apiRequest("PATCH", "/api/provider/service-category", { serviceCategory });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({ title: "Service selected", description: "Your service category has been saved." });
      setSelectedCategory(null);
      if (!data.city) {
        setChangingCity(true);
      }
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to update service category." });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || user.role !== "provider") {
    setLocation("/login");
    return null;
  }

  const currentCategory = user.serviceCategory;
  const currentCatInfo = SERVICE_CATEGORIES.find(c => c.id === currentCategory);
  const pendingSelection = selectedCategory || currentCategory;

  const stats = [
    { label: "Profile Views", value: "0", icon: Eye, color: "text-blue-600" },
    { label: "Rating", value: "N/A", icon: Star, color: "text-yellow-500" },
    { label: "Inquiries", value: "0", icon: MessageSquare, color: "text-green-600" },
    { label: "Bookings", value: "0", icon: Store, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary" data-testid="text-provider-dashboard-title">
            Provider Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user.displayName || user.username}! Manage your services and track your performance.
          </p>
        </div>

        {currentCategory && currentCatInfo ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${currentCatInfo.bg} flex items-center justify-center`}>
                      <currentCatInfo.icon className="w-7 h-7 opacity-80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Your Service</p>
                      <p className="text-xl font-bold text-secondary" data-testid="text-current-service">{currentCatInfo.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">{currentCatInfo.desc}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCategory(currentCategory)}
                      data-testid="button-change-service"
                    >
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <MapPin className="w-7 h-7 text-emerald-600 opacity-80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Your City</p>
                      {user.city ? (
                        <p className="text-xl font-bold text-secondary" data-testid="text-current-city">{user.city}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No city selected</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChangingCity(true)}
                      data-testid="button-change-city"
                    >
                      {user.city ? "Change" : "Set City"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {selectedCategory && (
              <ServiceCategoryPicker
                pendingSelection={pendingSelection}
                onSelect={setSelectedCategory}
                onConfirm={() => categoryMutation.mutate(selectedCategory)}
                onCancel={() => setSelectedCategory(null)}
                isPending={categoryMutation.isPending}
              />
            )}

            {changingCity && (
              <CityPicker
                currentCity={user.city ?? null}
                onConfirm={(city) => cityMutation.mutate(city)}
                onCancel={() => setChangingCity(false)}
                isPending={cityMutation.isPending}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <Card key={stat.label} data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <PhotoGallery />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Your Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Store className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No services listed yet</p>
                    <p className="text-sm mt-1">Your service listings will appear here once set up by an admin.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Recent Inquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No inquiries yet</p>
                    <p className="text-sm mt-1">Client inquiries will appear here.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <ServiceCategoryPicker
            pendingSelection={pendingSelection}
            onSelect={setSelectedCategory}
            onConfirm={() => {
              if (selectedCategory) categoryMutation.mutate(selectedCategory);
            }}
            isPending={categoryMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

function PhotoGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["/api/provider/photos"],
    queryFn: async () => {
      const res = await fetch("/api/provider/photos");
      if (!res.ok) throw new Error("Failed to load photos");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (photoId: number) => {
      await apiRequest("DELETE", `/api/provider/photos/${photoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider/photos"] });
      toast({ title: "Photo deleted" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, description }: { id: number; description: string }) => {
      const res = await apiRequest("PATCH", `/api/provider/photos/${id}`, { description });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider/photos"] });
      setEditingId(null);
      toast({ title: "Description updated" });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast({ variant: "destructive", title: "Invalid file", description: "Only image files are allowed (JPG, PNG, GIF, WEBP)." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File too large", description: "Maximum file size is 5MB." });
      return;
    }

    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadDescription("");
  };

  const handleUpload = async () => {
    if (!previewFile) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", previewFile);
      if (uploadDescription.trim()) formData.append("description", uploadDescription.trim());

      const res = await fetch("/api/provider/photos", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(err.message);
      }

      queryClient.invalidateQueries({ queryKey: ["/api/provider/photos"] });
      toast({ title: "Photo uploaded", description: "Your photo has been added to your portfolio." });
      setPreviewFile(null);
      setPreviewUrl(null);
      setUploadDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      toast({ variant: "destructive", title: "Upload failed", description: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const cancelPreview = () => {
    setPreviewFile(null);
    setPreviewUrl(null);
    setUploadDescription("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" data-testid="text-portfolio-title">
          <ImageIcon className="w-5 h-5" />
          My Portfolio
        </CardTitle>
        <CardDescription>
          Upload photos of your work to showcase your services to potential clients. Only image files (JPG, PNG, GIF, WEBP) up to 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handleFileSelect}
          data-testid="input-photo-file"
        />

        {previewUrl && previewFile ? (
          <div className="mb-6 p-4 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5">
            <div className="flex gap-4">
              <div className="w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" data-testid="img-photo-preview" />
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <p className="text-sm font-medium text-secondary">{previewFile.name}</p>
                <p className="text-xs text-muted-foreground">{(previewFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <Textarea
                  placeholder="Add a description for this photo (optional)"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="flex-1 min-h-[60px] resize-none"
                  data-testid="input-photo-description"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    size="sm"
                    className="bg-secondary hover:bg-secondary/90"
                    data-testid="button-upload-photo"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                    Upload Photo
                  </Button>
                  <Button variant="outline" size="sm" onClick={cancelPreview} data-testid="button-cancel-upload">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full mb-6 p-8 border-2 border-dashed border-border rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group cursor-pointer"
            data-testid="button-add-photo"
          >
            <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
              <ImagePlus className="w-10 h-10" />
              <div className="text-center">
                <p className="font-medium text-sm">Click to upload photos</p>
                <p className="text-xs mt-1">JPG, PNG, GIF, WEBP up to 5MB</p>
              </div>
            </div>
          </button>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No photos yet</p>
            <p className="text-sm mt-1">Upload photos to build your portfolio and attract clients.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo: any) => (
              <div
                key={photo.id}
                className="group relative rounded-xl overflow-hidden border border-border bg-muted"
                data-testid={`card-photo-${photo.id}`}
              >
                <div className="aspect-square">
                  <img
                    src={photo.imageUrl}
                    alt={photo.description || "Portfolio photo"}
                    className="w-full h-full object-cover"
                    data-testid={`img-photo-${photo.id}`}
                  />
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-8 h-8 bg-white/90 hover:bg-white shadow-sm"
                    onClick={() => {
                      setEditingId(photo.id);
                      setEditDescription(photo.description || "");
                    }}
                    data-testid={`button-edit-photo-${photo.id}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-8 h-8 bg-white/90 hover:bg-destructive hover:text-white shadow-sm"
                    onClick={() => deleteMutation.mutate(photo.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-photo-${photo.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {editingId === photo.id ? (
                  <div className="p-3 bg-background border-t">
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Add a description..."
                      className="min-h-[60px] resize-none text-sm mb-2"
                      data-testid={`input-edit-description-${photo.id}`}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-secondary hover:bg-secondary/90"
                        onClick={() => updateMutation.mutate({ id: photo.id, description: editDescription })}
                        disabled={updateMutation.isPending}
                        data-testid={`button-save-description-${photo.id}`}
                      >
                        {updateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        data-testid={`button-cancel-edit-${photo.id}`}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : photo.description ? (
                  <div className="p-3 bg-background border-t">
                    <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-photo-description-${photo.id}`}>
                      {photo.description}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ServiceCategoryPicker({
  pendingSelection,
  onSelect,
  onConfirm,
  onCancel,
  isPending,
}: {
  pendingSelection: string | null | undefined;
  onSelect: (id: string) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  isPending: boolean;
}) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-display" data-testid="text-select-service-title">
          Select Your Service
        </CardTitle>
        <CardDescription>
          Choose the service category that best describes what you offer to wedding clients.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = pendingSelection === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? `ring-2 ${cat.selected} ${cat.border} shadow-md`
                    : "border-border hover:border-primary/30 hover:shadow-sm"
                }`}
                data-testid={`button-service-${cat.id}`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center`}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center mb-3`}>
                  <cat.icon className="w-6 h-6 opacity-80" />
                </div>
                <h3 className="font-bold text-secondary mb-1">{cat.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onConfirm}
            disabled={!pendingSelection || isPending}
            className="bg-secondary hover:bg-secondary/90"
            data-testid="button-confirm-service"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Confirm Selection
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} data-testid="button-cancel-service">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CityPicker({
  currentCity,
  onConfirm,
  onCancel,
  isPending,
}: {
  currentCity: string | null;
  onConfirm: (city: string) => void;
  onCancel?: () => void;
  isPending: boolean;
}) {
  const [selectedCity, setSelectedCity] = useState<string>(currentCity ?? "");

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-display flex items-center gap-2" data-testid="text-select-city-title">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Select Your City
        </CardTitle>
        <CardDescription>
          Choose the Moroccan city where you primarily offer your services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-xs mb-6">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger data-testid="select-city-trigger">
              <SelectValue placeholder="Choose a city..." />
            </SelectTrigger>
            <SelectContent>
              {MOROCCO_CITIES.map((city) => (
                <SelectItem key={city} value={city} data-testid={`option-city-${city.toLowerCase().replace(/\s/g, '-')}`}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => selectedCity && onConfirm(selectedCity)}
            disabled={!selectedCity || isPending}
            className="bg-secondary hover:bg-secondary/90"
            data-testid="button-confirm-city"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Confirm City
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} data-testid="button-cancel-city">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
