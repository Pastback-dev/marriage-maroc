import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type LoginRequest, type RegisterRequest } from "@shared/schema";

export function useUser() {
  return useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) return null;

      // Fetch profile data from public.profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.warn("Profile fetch error:", profileError.message);
        // Fallback to session metadata if profile table isn't fully set up yet
        return {
          id: session.user.id,
          username: session.user.email,
          role: session.user.user_metadata?.role || 'client',
          isAdmin: false,
          displayName: session.user.user_metadata?.display_name || null,
          serviceCategory: null,
          city: null,
          description: null,
          priceMin: null,
          priceMax: null,
        };
      }

      // Map snake_case from DB to camelCase for the frontend
      return {
        ...profile,
        id: profile.id,
        username: session.user.email,
        role: profile.role || session.user.user_metadata?.role || 'client',
        displayName: profile.display_name || session.user.user_metadata?.display_name,
        isAdmin: !!profile.is_admin,
        serviceCategory: profile.service_category,
        city: profile.city,
        description: profile.description,
        priceMin: profile.price_min ? Number(profile.price_min) : null,
        priceMax: profile.price_max ? Number(profile.price_max) : null,
      };
    },
    refetchOnWindowFocus: true,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.username,
        password: credentials.password,
      });

      if (error) throw error;
      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Login failed", description: error.message });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.username,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
            role: data.role || 'client',
            phone: data.phone || null,
          }
        }
      });

      if (error) throw error;
      return authData.user;
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      const message = user?.identities?.length === 0
        ? "Account already exists or needs verification."
        : "Account created! You can now log in.";

      toast({
        title: "Registration Successful",
        description: message
      });
    },
    onError: (error: any) => {
      let description = error.message;
      if (error.message.includes("rate limit")) {
        description = "Too many attempts. Please wait a few minutes or disable 'Confirm Email' in your Supabase dashboard settings.";
      }
      toast({ variant: "destructive", title: "Registration failed", description });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      queryClient.clear();
      queryClient.setQueryData(["/api/user"], null);
      await supabase.auth.signOut();
    },
    onSuccess: () => {
      window.location.href = "/login";
    },
  });
}