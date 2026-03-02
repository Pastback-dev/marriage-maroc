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
      };
    },
    // Refetch more often during development to catch profile updates
    refetchOnWindowFocus: true,
    staleTime: 1000 * 5, // 5 seconds
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
          }
        }
      });

      if (error) throw error;
      return authData.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Account created", description: "Please check your email for verification." });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Registration failed", description: error.message });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      await supabase.auth.signOut();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      queryClient.clear();
      toast({ title: "Logged out", description: "See you soon!" });
    },
  });
}