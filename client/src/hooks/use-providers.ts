import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Provider } from "@shared/schema";
import { mockProviders } from "@/lib/mockData";

export function useProviders(filters?: { category?: string; city?: string }) {
  return useQuery<Provider[]>({
    queryKey: ["providers", filters],
    queryFn: async () => {
      try {
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
        
        // 2. Fetch seeded providers from providers table
        let providerQuery = supabase.from('providers').select('*');
        if (filters?.category && filters.category !== 'all') {
          providerQuery = providerQuery.eq('category', filters.category);
        }
        if (filters?.city) {
          providerQuery = providerQuery.ilike('city', `%${filters.city}%`);
        }
        
        const { data: seededProviders, error: providerError } = await providerQuery;

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

        const combined = [...registeredProviders, ...(seededProviders || [])] as Provider[];

        // 3. Fallback to mock data if both DB sources are empty
        if (combined.length === 0) {
          return mockProviders.filter(p => {
            const matchesCategory = !filters?.category || filters.category === 'all' || p.category === filters.category;
            const matchesCity = !filters?.city || p.city.toLowerCase().includes(filters.city.toLowerCase());
            return matchesCategory && matchesCity;
          });
        }

        return combined;
      } catch (err) {
        console.error("Error fetching providers:", err);
        // Return mock data on error to keep the app functional
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
        
        if (!providerError && provider) return provider as Provider;

        // Final fallback to mock data
        return mockProviders.find(p => p.id === id || p.id.toString() === id.toString()) || null;
      } catch (err) {
        return mockProviders.find(p => p.id === id || p.id.toString() === id.toString()) || null;
      }
    },
    enabled: !!id,
  });
}