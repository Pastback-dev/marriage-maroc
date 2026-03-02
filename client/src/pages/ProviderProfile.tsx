import { useProvider } from "@/hooks/use-providers";
import { useParams, Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  ArrowLeft, 
  Loader2, 
  Phone, 
  Mail, 
  Banknote, 
  Sparkles,
  ImageIcon,
  Info
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
      <div className="min-h-screen flex items-center justify-center">
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

  const categoryLabel = provider.serviceCategory 
    ? t(`category_${provider.serviceCategory}`) 
    : t("all_categories");

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      {/* Header / Hero - Simplified without green background */}
      <div className="bg-white border-b border-border py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/providers">
            <button className="flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              Back to all vendors
            </button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 uppercase tracking-widest text-[10px] font-bold px-3 py-1">
                {categoryLabel}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-secondary">
                {provider.displayName || provider.username}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  {provider.city || "Location not set"}
                </div>
                {provider.priceMin && (
                  <div className="flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-primary" />
                    Starts from {provider.priceMin.toLocaleString()} MAD
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-8 rounded-full h-12">
                Contact Vendor
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-slate-50/50">
                <CardTitle className="flex items-center gap-2 text-secondary">
                  <Info className="w-5 h-5 text-primary" /> About this Professional
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {provider.description || "No description provided yet."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Gallery */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-secondary flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-primary" /> Portfolio Gallery
              </h2>
              
              {loadingPhotos ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {photos.map((photo, idx) => (
                    <motion.div 
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-border"
                    >
                      <img 
                        src={photo.image_url} 
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-border">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No portfolio photos uploaded yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden sticky top-24">
              <CardHeader className="bg-slate-50/50 border-b border-border/50">
                <CardTitle className="text-lg font-display text-secondary">Quick Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Location</p>
                      <p className="font-medium text-secondary">{provider.city || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Banknote className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Price Range</p>
                      <p className="font-medium text-secondary">
                        {provider.priceMin ? `${provider.priceMin.toLocaleString()} - ${provider.priceMax?.toLocaleString()} MAD` : "Contact for pricing"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Service</p>
                      <p className="font-medium text-secondary">{categoryLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50 space-y-4">
                  <h4 className="font-bold text-secondary">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" /> {provider.username}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" /> +212 6XX XXX XXX
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-12 rounded-xl mt-4">
                  Book Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}