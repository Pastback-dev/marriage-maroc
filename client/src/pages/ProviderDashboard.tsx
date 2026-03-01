import { useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Star, Eye, MessageSquare } from "lucide-react";

export default function ProviderDashboard() {
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();

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
      </div>
    </div>
  );
}
