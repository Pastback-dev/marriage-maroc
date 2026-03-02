import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Provider } from "@shared/schema";

export function useProviders(filters?: { category?: string; city?: string }) {
  return useQuery<Provider[]>({
    queryKey: ["providers", filters],
    queryFn: async () => {
      // Fetch from profiles table for registered providers
      let query = supabase
        .from('profiles')
        .select('*, provider_photos(image_url)')
        .eq('role', 'provider');
      
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('service_category', filters.category);
      }
      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Map profiles to Provider interface shape for the UI
      return (data as any[]).map(profile => ({
        id: profile.id,
        category: profile.service_category || 'other',
        name: profile.display_name || profile.username.split('@')[0],
        description: profile.description || '',
        city: profile.city || '',
        priceMin: 0, 
        priceMax: 0,
        images: profile.provider_photos?.length > 0 
          ? profile.provider_photos.map((p: any) => p.image_url)
          : ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"], // Fallback
        packages: [],
        rating: 5,
        contactInfo: profile.phone || null
      })) as any[];
    },
  });
}

export function useProvider(id: string | number) {
  return useQuery<Provider | null>({
    queryKey: ["providers", id],
    queryFn: async () => {
      // Try fetching from profiles first (registered users)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, provider_photos(image_url)')
        .eq('id', id)
        .single();
      
      if (!profileError && profile) {
        return {
          id: profile.id,
          category: profile.service_category || 'other',
          name: profile.display_name || profile.username.split('@')[0],
          description: profile.description || '',
          city: profile.city || '',
          priceMin: 0,
          priceMax: 0,
          images: profile.provider_photos?.length > 0 
            ? profile.provider_photos.map((p: any) => p.image_url)
            : ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"],
          packages: [],
          rating: 5,
          contactInfo: profile.phone || null
        } as any;
      }

      // Fallback to seeded providers table if not found in profiles
      const { data: provider, error: providerError } = await supabase
        .from('providers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (providerError) throw providerError;
      return provider as Provider;
    },
    enabled: !!id,
  });
}