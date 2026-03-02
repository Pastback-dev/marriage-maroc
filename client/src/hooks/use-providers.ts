import { useQuery } from "@tanstack/react-query";
import { type Provider } from "@shared/schema";
import { mockProviders } from "@/lib/mockData";

export function useProviders(filters?: { category?: string; city?: string }) {
  return useQuery<Provider[]>({
    queryKey: ["/api/providers", filters],
    queryFn: () => {
      let results = mockProviders;
      if (filters?.category) {
        results = results.filter((p) => p.category === filters.category);
      }
      if (filters?.city) {
        results = results.filter((p) => p.city === filters.city);
      }
      return results;
    },
    staleTime: Infinity,
  });
}

export function useProvider(id: number) {
  return useQuery<Provider | null>({
    queryKey: ["/api/providers", id],
    queryFn: () => mockProviders.find((p) => p.id === id) ?? null,
    enabled: !!id,
    staleTime: Infinity,
  });
}
