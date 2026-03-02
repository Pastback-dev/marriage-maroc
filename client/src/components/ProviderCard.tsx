import { type Provider } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Card className="group overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
      <CardHeader className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {provider.images.map((img, idx) => (
              <CarouselItem key={idx}>
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  {/* Unsplash image with fallback */}
                  <img 
                    src={img} 
                    alt={`${provider.name} - ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border-0" />
            <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border-0" />
          </div>
        </Carousel>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 uppercase tracking-wide text-xs font-bold">
            {provider.category}
          </Badge>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold text-foreground">{provider.rating}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-display font-bold text-secondary mb-2 line-clamp-1">{provider.name}</h3>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          {provider.city}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {provider.description}
        </p>
        
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-muted-foreground">From</span>
          <span className="text-lg font-bold text-secondary">{provider.priceMin} MAD</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Link href={`/providers/${provider.id}`} className="w-full">
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-white gap-2 group-hover:translate-x-1 transition-transform">
            View Details <ExternalLink className="w-4 h-4 opacity-50" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
