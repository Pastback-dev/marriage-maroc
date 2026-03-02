import { type ProviderProfile } from "@/hooks/use-providers";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ProviderCardProps {
  provider: ProviderProfile;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('provider_photos')
        .select('*')
        .eq('user_id', provider.id)
        .order('created_at', { ascending: false });
      
      setPhotos(data || []);
      setLoadingPhotos(false);
    };
    
    fetchPhotos();
  }, [provider.id]);

  const displayImages = photos.map(p => p.image_url);
  const categoryLabel = provider.serviceCategory 
    ? t(`category_${provider.serviceCategory}`) 
    : t("all_categories");

  return (
    <Card className="group overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
      <CardHeader className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {loadingPhotos ? (
              <CarouselItem>
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-muted flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              </CarouselItem>
            ) : displayImages && displayImages.length > 0 ? (
              displayImages.map((img, idx) => (
                <CarouselItem key={idx}>
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <img 
                      src={img} 
                      alt={`${provider.displayName || provider.username} - ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-muted flex items-center justify-center">
                  <div className="text-muted-foreground">No images yet</div>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          {displayImages && displayImages.length > 1 && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <CarouselPrevious className="left-2 bg-background border-0" />
              <CarouselNext className="right-2 bg-background border-0" />
            </div>
          )}
        </Carousel>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 uppercase tracking-wide text-xs font-bold">
            {categoryLabel}
          </Badge>
        </div>
        
        <h3 className="text-xl font-display font-bold text-secondary mb-2 line-clamp-1">
          {provider.displayName || provider.username}
        </h3>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          {provider.city || "Location not set"}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {provider.description || "No description provided yet."}
        </p>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Link href={`/providers/${provider.id}`} className="w-full">
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-white gap-2 group-hover:translate-x-1 transition-transform">
            View Profile <ExternalLink className="w-4 h-4 opacity-50" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}