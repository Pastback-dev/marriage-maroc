import { useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Store, Star, Eye, MessageSquare, Utensils, Home as HomeIcon,
  Music, Camera, UserRound, Paintbrush, Check, Loader2
} from "lucide-react";
import { useState } from "react";

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

  const categoryMutation = useMutation({
    mutationFn: async (serviceCategory: string) => {
      const res = await apiRequest("PATCH", "/api/provider/service-category", { serviceCategory });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({ title: "Service selected", description: "Your service category has been saved." });
      setSelectedCategory(null);
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
            <Card className="mb-8 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${currentCatInfo.bg} flex items-center justify-center`}>
                    <currentCatInfo.icon className="w-7 h-7 opacity-80" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Your Service</p>
                    <p className="text-xl font-bold text-secondary" data-testid="text-current-service">{currentCatInfo.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{currentCatInfo.desc}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory(currentCategory)}
                    data-testid="button-change-service"
                  >
                    Change Service
                  </Button>
                </div>
              </CardContent>
            </Card>

            {selectedCategory && (
              <ServiceCategoryPicker
                pendingSelection={pendingSelection}
                onSelect={setSelectedCategory}
                onConfirm={() => categoryMutation.mutate(selectedCategory)}
                onCancel={() => setSelectedCategory(null)}
                isPending={categoryMutation.isPending}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
