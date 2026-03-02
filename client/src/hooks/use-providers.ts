import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Provider } from "@shared/schema";

export function useProviders(filters?: { category?: string; city?: string }) {
  return useQuery<Provider[]>({
    queryKey: ["providers", filters],
    queryFn: async () => {
      // 1. Fetch all provider profiles
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
          phone
        `)
        .eq('role', 'provider');
      
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('service_category', filters.category);
      }
      
      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      const { data: profiles, error: profileError } = await query;
      
      if (profileError) throw profileError;
      if (!profiles || profiles.length === 0) return [];

      // 2. Fetch all photos for these providers
      const providerIds = profiles.map(p => p.id);
      const { data: photos, error: photoError } = await supabase
        .from('provider_photos')
        .select('*')
        .in('user_id', providerIds);
      
      if (photoError) throw photoError;

      // 3. Map photos to providers
      const photosByUserId = (photos || []).reduce((acc, photo) => {
        if (!acc[photo.user_id]) acc[photo.user_id] = [];
        acc[photo.user_id].push(photo.image_url);
        return acc;
      }, {} as Record<string, string[]>);

      // 4. Map profiles to Provider interface
      return profiles.map(profile => ({
        id: profile.id,
        category: profile.service_category || 'other',
        name: profile.display_name || profile.username?.split('@')[0] || 'Unnamed Provider',
        description: profile.description || '',
        city: profile.city || '',
        priceMin: 0, 
        priceMax: 0,
        images: photosByUserId[profile.id] && photosByUserId[profile.id].length > 0 
          ? photosByUserId[profile.id]
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
      // 1. Fetch the provider profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          role,
          service_category,
          city,
          description,
          phone
        `)
        .eq('id', id)
        .single();
      
      if (profileError || !profile) return null;

      // 2. Fetch photos for this provider
      const { data: photos, error: photoError } = await supabase
        .from('provider_photos')
        .select('image_url')
        .eq('user_id', id);
      
      if (photoError) throw photoError;

      // 3. Map to Provider interface
      return {
        id: profile.id,
        category: profile.service_category || 'other',
        name: profile.display_name || profile.username?.split('@')[0] || 'Unnamed Provider',
        description: profile.description || '',
        city: profile.city || '',
        priceMin: 0,
        priceMax: 0,
        images: photos && photos.length > 0 
          ? photos.map(p => p.image_url)
          : ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"],
        packages: [],
        rating: 5,
        contactInfo: profile.phone || null
      } as any;
    },
    enabled: !!id,
  });
}