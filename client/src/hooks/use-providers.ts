import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Provider } from "@shared/schema";
import { mockProviders } from "@/lib/mockData";

export function useProviders(filters?: { category?: string; city?: string }) {
  return useQuery<Provider[]>({
    queryKey: ["providers", filters],
    queryFn: async () => {
      try {
        // 1. Fetch from profiles table where role is 'provider'
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

        // 2. Map the profiles to the Provider interface
        const registeredProviders = (profiles || []).map(profile => ({
          id: profile.id,
          category: profile.service_category || 'other',
          name: profile.display_name || profile.username.split('@')[0],
          description: profile.description || '',
          city: profile.city || '',
          priceMin: 0, // Default for profiles
          priceMax: 0,
          // Extract image URLs from the joined provider_photos table
          images: profile.provider_photos && profile.provider_photos.length > 0 
            ? profile.provider_photos.map((p: any) => p.image_url)
            : ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"],
          packages: [],
          rating: 5,
          contactInfo: profile.phone || null
        }));

        // 3. Fallback to mock data ONLY if no registered profiles are found
        if (registeredProviders.length === 0) {
          return mockProviders.filter(p => {
            const matchesCategory = !filters?.category || filters.category === 'all' || p.category === filters.category;
            const matchesCity = !filters?.city || p.city.toLowerCase().includes(filters.city.toLowerCase());
            return matchesCategory && matchesCity;
          });
        }

        return registeredProviders as Provider[];
      } catch (err) {
        console.error("Error fetching providers from profiles:", err);
        return mockProviders;
      }
    },
  });
}

export function useProvider(id: string | number) {
  return useQuery<Provider | null>({
    queryKey: ["providers", id],
    queryFn: async () => {
      try {
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
        
        if (error || !profile) {
          // Fallback to mock data if not found in profiles
          return mockProviders.find(p => p.id === id || p.id.toString() === id.toString()) || null;
        }

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
      } catch (err) {
        return mockProviders.find(p => p.id === id || p.id.toString() === id.toString()) || null;
      }
    },
    enabled: !!id,
  });
}