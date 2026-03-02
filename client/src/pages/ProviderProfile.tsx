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
  Info,
  CheckCircle2,
  Calendar,
  MessageSquare
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

  const categoryLabel = provider.serviceCategory 
    ? t(`category_${provider.serviceCategory}`) 
    : t("all_categories");

  return (
    <div className="min-h-screen bg-background pb-20 font-body">
      <Navigation />
      
      {/* Header Section */}
      <div className="bg-white border-b border-border/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/providers">
            <button className="flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group text-sm font-medium">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              Back to all vendors
            </button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[10px] font-bold px-3 py-1 rounded-full">
                  {categoryLabel}
                </Badge>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Verified Professional
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary tracking-tight">
                {provider.displayName || provider.username}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-md">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{provider.city || "Location not set"}</span>
                </div>
                {provider.priceMin && (
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 rounded-md">
                      <Banknote className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Starts from {provider.priceMin.toLocaleString()} MAD</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-secondary hover:bg-secondary/90 text-white font-bold px-8 rounded-xl h-12 shadow-lg shadow-secondary/10">
                <MessageSquare className="mr-2 w-4 h-4" /> Send Message
              </Button>
              <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 font-bold px-8 rounded-xl h-12">
                <Calendar className="mr-2 w-4 h-4" /> Check Availability
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-secondary">About the Professional</h2>
              </div>
              
              <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {provider.description || "No description provided yet. This professional is dedicated to making your Moroccan wedding dreams come true with exceptional service and attention to detail."}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Portfolio Gallery */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-secondary">Portfolio Gallery</h2>
                </div>
                {photos.length > 0 && (
                  <span className="text-sm font-bold text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
                    {photos.length} Photos
                  </span>
                )}
              </div>
              
              {loadingPhotos ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {photos.map((photo, idx) => (
                    <motion.div 
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-md border border-border/40 bg-white"
                    >
                      <img 
                        src={photo.image_url} 
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-2">No photos yet</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">This professional hasn't uploaded any portfolio photos to their gallery yet.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden sticky top-24">
              <CardHeader className="bg-slate-50/80 border-b border-border/50 p-8">
                <CardTitle className="text-xl font-display font-bold text-secondary flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Service Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Location</p>
                      <p className="text-lg font-bold text-secondary">{provider.city || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Banknote className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Price Range</p>
                      <p className="text-lg font-bold text-secondary">
                        {provider.priceMin ? `${provider.priceMin.toLocaleString()} - ${provider.priceMax?.toLocaleString()} MAD` : "Contact for pricing"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Service Type</p>
                      <p className="text-lg font-bold text-secondary">{categoryLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border/50 space-y-6">
                  <h4 className="text-sm font-black text-secondary uppercase tracking-widest">Contact Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{provider.username}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">+212 6XX XXX XXX</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl mt-4 text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                  Book Consultation
                </Button>
                <p className="text-[10px] text-center text-muted-foreground font-medium">
                  No payment required to book a consultation
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}