import { useState } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProvider } from "@/hooks/use-providers";
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  ChefHat,
  Home,
  Music,
  Camera,
  Palette,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "wouter";

const categoryIcons = {
  traiteur: ChefHat,
  hall: Home,
  dj: Music,
  cameraman: Camera,
  decoration: Palette,
  neggafa: Sparkles,
};

const categoryLabels = {
  traiteur: "Catering",
  hall: "Venue",
  dj: "Entertainment",
  cameraman: "Photography",
  decoration: "Decoration",
  neggafa: "Beauty"
};

export default function ProviderDetail() {
  const { id } = useParams();
  const { data: provider, isLoading } = useProvider(id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary">Provider not found</h2>
          <Link href="/providers">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Providers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[provider.category as keyof typeof categoryIcons] || Sparkles;
  const categoryLabel = categoryLabels[provider.category as keyof typeof categoryLabels] || provider.category;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/providers">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Providers
          </Button>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden bg-muted aspect-video relative">
              {provider.images && provider.images.length > 0 ? (
                <img 
                  src={provider.images[selectedImageIndex]} 
                  alt={provider.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span>No images available</span>
                </div>
              )}
            </div>
            
            {provider.images && provider.images.length > 1 && (
              <div className="mt-4">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2">
                    {provider.images.map((img, index) => (
                      <CarouselItem key={index} className="pl-2 basis-1/4 md:basis-1/6 cursor-pointer" 
                        onClick={() => setSelectedImageIndex(index)}>
                        <div className={`rounded-lg overflow-hidden aspect-square border-2 ${
                          selectedImageIndex === index ? "border-primary" : "border-transparent"
                        }`}>
                          <img 
                            src={img} 
                            alt={`${provider.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </Carousel>
              </div>
            )}
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CategoryIcon className="w-5 h-5 text-primary" />
                  About {provider.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {provider.description || "No description provided."}
                </p>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-secondary mb-3">Service Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{provider.city || "Morocco"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{provider.rating || 5}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-secondary mb-3">Pricing Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <span className="text-primary font-bold">MAD</span>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Price Range</p>
                          <p className="font-medium">
                            {provider.priceMin > 0 ? (
                              `${provider.priceMin.toLocaleString()} - ${provider.priceMax.toLocaleString()} MAD`
                            ) : (
                              "Contact for pricing"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Booking */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{provider.name}</span>
                  <Badge variant="secondary" className="uppercase">
                    {categoryLabel}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Starting at</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{provider.rating || 5}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-secondary">
                    {provider.priceMin > 0 ? (
                      `${provider.priceMin.toLocaleString()} MAD`
                    ) : (
                      "Contact for pricing"
                    )}
                  </div>
                  {provider.priceMin > 0 && provider.priceMax > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Price range: {provider.priceMin.toLocaleString()} - {provider.priceMax.toLocaleString()} MAD
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full bg-secondary hover:bg-secondary/90">
                    Request Booking
                  </Button>
                  <Button variant="outline" className="w-full">
                    Contact Provider
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-secondary">What's Included</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>Professional service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>Customizable packages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>Free consultation</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}