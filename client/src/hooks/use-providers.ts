import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Provider } from "@shared/schema";

export function useProviders(filters?: { category?: string; city?: string }) {
  return useQuery<Provider[]>({
    queryKey: ["providers", filters],
    queryFn: async () => {
      // Fetch from profiles table where role is 'provider'
      // We include the provider_photos relation to get the images
      let query = supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          role,
          service_category,
          city,
          description,
          phone,
          provider_photos (
            image_url
          )
        `)
        .eq('role', 'provider');
      
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('service_category', filters.category);
      }
      
      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      const { data: profiles, error } = await query;
      
      if (error) throw error;

      // Map the profiles to the Provider interface
      return (profiles || []).map(profile => ({
        id: profile.id,
        category: profile.service_category || 'other',
        name: profile.display_name || profile.username.split('@')[0],
        description: profile.description || '',
        city: profile.city || '',
        priceMin: 0, 
        priceMax: 0,
        images: profile.provider_photos && profile.provider_photos.length > 0 
          ? profile.provider_photos.map((p: any) => p.image_url)
          : ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"],
        packages: [],
        rating: 5,
        contactInfo: profile.phone || null
      })) as Provider[];
    },
  });
}

export function useProvider(id: string | number) {
  return useQuery<Provider | null>({
    queryKey: ["providers", id],
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          provider_photos (
            image_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error || !profile) return null;

      return {
        id: profile.id,
        category: profile.service_category || 'other',
        name: profile.display_name || profile.username.split('@')[0],
        description: profile.description || '',
        city: profile.city || '',
        priceMin: 0,
        priceMax: 0,
        images: profile.provider_photos && profile.provider_photos.length > 0 
          ? profile.provider_photos.map((p: any) => p.image_url)
          : ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"],
        packages: [],
        rating: 5,
        contactInfo: profile.phone || null
      } as any;
    },
    enabled: !!id,
  });
}