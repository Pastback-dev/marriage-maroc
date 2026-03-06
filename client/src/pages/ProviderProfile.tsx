import { useProvider } from "@/hooks/use-providers";
import { useParams, Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  MapPin, 
  ArrowLeft, 
  Loader2, 
  Phone, 
  Banknote, 
  ImageIcon,
  FileText,
  Utensils,
  Home as HomeIcon,
  Music,
  Camera,
  UserRound,
  Paintbrush,
  Store,
  Sparkles,
  ExternalLink,
  Globe,
  MessageCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const SERVICE_CATEGORIES = [
  { id: "traiteur", name: "Catering", icon: Utensils, bg: "bg-orange-50", text: "text-orange-600" },
  { id: "hall", name: "Wedding Venues", icon: HomeIcon, bg: "bg-blue-50", text: "text-blue-600" },
  { id: "dj", name: "DJ & Live Orchestra", icon: Music, bg: "bg-purple-50", text: "text-purple-600" },
  { id: "cameraman", name: "Photography", icon: Camera, bg: "bg-rose-50", text: "text-rose-600" },
  { id: "neggafa", name: "Bridal Makeup", icon: UserRound, bg: "bg-amber-50", text: "text-amber-600" },
  { id: "decoration", name: "Decor", icon: Paintbrush, bg: "bg-emerald-50", text: "text-emerald-600" },
  { id: "other", name: "Other Services", icon: Sparkles, bg: "bg-slate-50", text: "text-slate-600" },
];

export default function ProviderProfile() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: provider, isLoading } = useProvider(id || "");
  const [photos, setPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('provider_photos')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
      
      setPhotos(data || []);
      setLoadingPhotos(false);
    };
    
    fetchPhotos();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">Provider not found</h1>
          <Link href="/providers">
            <Button variant="outline"><ArrowLeft className="mr-2 w-4 h-4" /> Back to Vendors</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentCatInfo = SERVICE_CATEGORIES.find(c => c.id === provider.serviceCategory);
  const whatsappNumber = provider.phone?.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/providers">
            <button className="flex items-center text-muted-foreground hover:text-primary mb-4 transition-colors group text-sm font-medium">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              Back to all vendors
            </button>
          </Link>
          <h1 className="text-3xl font-display font-bold text-secondary">
            {provider.displayName || provider.username}
          </h1>
          <p className="text-muted-foreground mt-2">Professional Wedding Service Provider</p>
        </div>

        {/* Portfolio Gallery - NOW FIRST */}
        <Card className="border-primary/10 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Portfolio Gallery
            </CardTitle>
            <CardDescription>A showcase of recent work and celebrations.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPhotos ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
            ) : photos?.length === 0 ? (
              <div className="text-center py-12 border rounded-2xl bg-slate-50/50">
                <p className="text-muted-foreground">No photos available in the gallery yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos?.map((photo) => (
                  <div key={photo.id} className="group relative rounded-2xl overflow-hidden border shadow-sm aspect-square bg-white">
                    <img src={photo.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/20 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${currentCatInfo?.bg || 'bg-slate-100'} flex items-center justify-center`}>
                {currentCatInfo ? <currentCatInfo.icon className={`w-7 h-7 ${currentCatInfo.text}`} /> : <Store className="w-7 h-7 opacity-40" />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Service</p>
                <p className="text-xl font-bold text-secondary">{currentCatInfo?.name || "Not specified"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-emerald-600 opacity-80" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</p>
                <p className="text-xl font-bold text-secondary">{provider.city || "Not set"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Banknote className="w-7 h-7 text-amber-600 opacity-80" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pricing Range</p>
                <p className="text-xl font-bold text-secondary">
                  {provider.priceMin ? `${provider.priceMin.toLocaleString()} - ${provider.priceMax?.toLocaleString()} MAD` : "Contact for price"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Business Description */}
            <Card className="border-primary/20 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Business Description
                </CardTitle>
                <CardDescription>Learn more about the services and experience offered.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {provider.description || "No description provided yet. This professional is dedicated to making your Moroccan wedding dreams come true with exceptional service and attention to detail."}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg font-display text-secondary">Contact & Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{provider.phone || "+212 6XX XXX XXX"}</span>
                  </div>

                  {provider.url && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                      </div>
                      <a 
                        href={provider.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1 truncate"
                      >
                        {provider.url.replace(/^https?:\/\/(www\.)?/, '')} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border/50 space-y-3">
                  {whatsappNumber && (
                    <Button 
                      className="w-full h-11 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 rounded-xl transition-all active:scale-95"
                      onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                    </Button>
                  )}
                  
                  {provider.url && (
                    <Button 
                      variant="outline"
                      className="w-full h-11 font-bold border-primary/20 hover:bg-primary/5 text-secondary rounded-xl"
                      onClick={() => window.open(provider.url!, '_blank')}
                    >
                      <Globe className="w-5 h-5 mr-2" /> Visit Website
                    </Button>
                  )}
                </div>
                
                <p className="text-[10px] text-center text-muted-foreground font-medium pt-2">
                  Direct contact with the professional
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}