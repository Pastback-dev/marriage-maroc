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
  Calendar,
  MessageSquare,
  Share2
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-secondary mb-4">Provider Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">The professional you're looking for might have moved or the link is incorrect.</p>
          <Link href="/providers">
            <Button variant="outline" className="rounded-full px-8">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to Vendors
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = provider.serviceCategory 
    ? t(`category_${provider.serviceCategory}`) 
    : t("all_categories");

  return (
    <div className="min-h-screen bg-background pb-24 font-body">
      <Navigation />
      
      {/* Header / Hero Section */}
      <div className="relative bg-secondary text-white pt-16 pb-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] -ml-32 -mb-32" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/providers">
              <button className="flex items-center text-white/60 hover:text-white mb-10 transition-all group text-sm font-medium">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                Back to all vendors
              </button>
            </Link>
          </motion.div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest text-[10px] font-bold px-3 py-1 backdrop-blur-sm">
                  {categoryLabel}
                </Badge>
                <div className="flex items-center gap-1 text-amber-400">
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Verified Professional</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                {provider.displayName || provider.username}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{provider.city || "Location not set"}</span>
                </div>
                {provider.priceMin && (
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                    <Banknote className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Starts from {provider.priceMin.toLocaleString()} MAD</span>
                  </div>
                )}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-3"
            >
              <Button variant="outline" size="icon" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-10 rounded-full h-14 shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95">
                Contact Vendor
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Left Column: About & Gallery */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-none shadow-2xl shadow-secondary/5 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-xl">
                <CardHeader className="border-b border-border/40 bg-slate-50/50 px-8 py-6">
                  <CardTitle className="flex items-center gap-3 text-secondary font-display text-xl">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    About this Professional
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap italic font-light">
                      {provider.description || "No description provided yet. This professional is dedicated to making your Moroccan wedding dreams come true with excellence and authenticity."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 pt-10 border-t border-border/40">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Experience</p>
                      <p className="text-secondary font-bold">5+ Years</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Response Time</p>
                      <p className="text-secondary font-bold">< 2 Hours</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Languages</p>
                      <p className="text-secondary font-bold">Arabic, French, English</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Portfolio Gallery */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold text-secondary flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <ImageIcon className="w-6 h-6 text-primary" />
                  </div>
                  Portfolio Gallery
                </h2>
                {photos.length > 0 && (
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {photos.length} Photos
                  </span>
                )}
              </div>
              
              {loadingPhotos ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-dashed border-border/60">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground font-medium">Loading portfolio...</p>
                </div>
              ) : photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {photos.map((photo, idx) => (
                    <motion.div 
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg cursor-zoom-in"
                    >
                      <img 
                        src={photo.image_url} 
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                        <p className="text-white text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          {photo.description || `Work Showcase #${idx + 1}`}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] p-20 text-center border border-dashed border-border/60 shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ImageIcon className="w-10 h-10 text-muted-foreground/20" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-secondary mb-2">No Photos Yet</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">This professional hasn't uploaded any portfolio photos to their gallery yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="sticky top-28"
            >
              <Card className="border-none shadow-2xl shadow-secondary/10 rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="bg-gradient-to-br from-primary/10 to-amber-50/50 border-b border-primary/10 px-8 py-8">
                  <CardTitle className="text-xl font-display text-secondary flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Quick Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 group">
                      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Location</p>
                        <p className="font-bold text-secondary text-lg">{provider.city || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                        <Banknote className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Price Range</p>
                        <p className="font-bold text-secondary text-lg">
                          {provider.priceMin ? `${provider.priceMin.toLocaleString()} - ${provider.priceMax?.toLocaleString()} MAD` : "Contact for pricing"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Service Type</p>
                        <p className="font-bold text-secondary text-lg">{categoryLabel}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-border/40 space-y-6">
                    <h4 className="font-display font-bold text-secondary text-lg">Contact Information</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium truncate">{provider.username}</span>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">+212 6XX XXX XXX</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-14 rounded-2xl shadow-lg shadow-secondary/10 transition-all hover:-translate-y-1">
                      Book Consultation
                    </Button>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-border/60 font-bold text-secondary hover:bg-slate-50">
                      <MessageSquare className="w-4 h-4 mr-2" /> Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Trust Badge */}
              <div className="mt-6 p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-tighter">Arsi Guarantee</p>
                  <p className="text-[11px] text-emerald-700/80 leading-tight">Verified quality and secure booking through our platform.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer Tagline */}
      <footer className="mt-32 border-t border-border/40 py-12 text-center">
        <p className="text-muted-foreground text-sm font-medium">Developed by m3akcoder.com @ 2026 Arsi</p>
      </footer>
    </div>
  );
}