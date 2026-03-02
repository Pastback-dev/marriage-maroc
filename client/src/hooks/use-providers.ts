import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProviderProfile = {
  id: string;
  displayName: string | null;
  serviceCategory: string | null;
  city: string | null;
  description: string | null;
  username: string;
  priceMin: number | null;
  priceMax: number | null;
};

export function useProviders(filters?: { category?: string; city?: string }) {
  return useQuery<ProviderProfile[]>({
    queryKey: ["providers", filters],
    queryFn: async () => {
      let query = supabase.from('profiles').select('*').eq('role', 'provider');
      
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('service_category', filters.category);
      }
      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return (data as any[]).map(profile => ({
        id: profile.id,
        displayName: profile.display_name,
        serviceCategory: profile.service_category,
        city: profile.city,
        description: profile.description,
        username: profile.username || '',
        priceMin: profile.price_min ? Number(profile.price_min) : null,
        priceMax: profile.price_max ? Number(profile.price_max) : null,
      }));
    },
  });
}

export function useProvider(id: string) {
  return useQuery<ProviderProfile | null>({
    queryKey: ["providers", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'provider')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      const profile = data as any;
      return {
        id: profile.id,
        displayName: profile.display_name,
        serviceCategory: profile.service_category,
        city: profile.city,
        description: profile.description,
        username: profile.username || '',
        priceMin: profile.price_min ? Number(profile.price_min) : null,
        priceMax: profile.price_max ? Number(profile.price_max) : null,
      };
    },
    enabled: !!id,
  });
}