import { useUser } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import { User, Store } from "lucide-react";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { data: user } = useUser();
  const [role, setRole] = useState<"client" | "provider">("client");

  useEffect(() => {
    if (user) {
      setLocation(user.role === "provider" ? "/provider-dashboard" : "/plan");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-secondary/10 skew-y-6 transform origin-top-left -z-10" />
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-2">
          <Link href="/">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-primary/90 transition-colors">
              <span className="font-display font-bold text-white text-xl">A</span>
            </div>
          </Link>
          <CardTitle className="text-2xl font-display text-secondary" data-testid="text-auth-title">
            Welcome to Arsi
          </CardTitle>
          <CardDescription>
            {role === "provider" 
              ? "Join as a wedding professional" 
              : "Start planning your dream wedding"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={(v) => setRole(v as "client" | "provider")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client" className="flex items-center gap-2" data-testid="tab-client">
                <User className="w-4 h-4" />
                Client
              </TabsTrigger>
              <TabsTrigger value="provider" className="flex items-center gap-2" data-testid="tab-provider">
                <Store className="w-4 h-4" />
                Provider
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(43 74% 49%)',
                    brandAccent: 'hsl(43 74% 40%)',
                  }
                }
              }
            }}
            theme="light"
            providers={[]}
            additionalData={{
              role: role
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}