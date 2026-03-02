import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Provider } from "@shared/schema";

export function useProviders(filters?: { category?: string; city?: string }) {
  return useQuery<Provider[]>({
    queryKey: ["providers", filters],
    queryFn: async () => {
      // 1. Fetch registered providers from profiles
      let profileQuery = supabase
        .from('profiles')
        .select('*, provider_photos(image_url)')
        .eq('role', 'provider');
      
      if (filters?.category && filters.category !== 'all') {
        profileQuery = profileQuery.eq('service_category', filters.category);
      }
      if (filters?.city) {
        profileQuery = profileQuery.ilike('city', `%${filters.city}%`);
      }

      const { data: profiles, error: profileError } = await profileQuery;
      
      // 2. Fetch seeded providers as fallback or additional data
      let providerQuery = supabase.from('providers').select('*');
      if (filters?.category && filters.category !== 'all') {
        providerQuery = providerQuery.eq('category', filters.category);
      }
      if (filters?.city) {
        providerQuery = providerQuery.ilike('city', `%${filters.city}%`);
      }
      
      const { data: seededProviders, error: providerError } = await providerQuery;

      if (profileError && providerError) throw profileError || providerError;

      // Map profiles to Provider interface
      const registeredProviders = (profiles || []).map(profile => ({
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
      }));

      // Combine both lists, prioritizing registered ones
      return [...registeredProviders, ...(seededProviders || [])] as Provider[];
    },
  });
}

export function useProvider(id: string | number) {
  return useQuery<Provider | null>({
    queryKey: ["providers", id],
    queryFn: async () => {
      // Try profiles first
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

      // Fallback to providers table
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