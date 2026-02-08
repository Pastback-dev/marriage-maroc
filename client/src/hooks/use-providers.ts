import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useProviders(filters?: { category?: string; city?: string }) {
  // Construct query string manually or use URLSearchParams if needed
  // Here assuming simple query params for GET
  const queryParams = new URLSearchParams();
  if (filters?.category) queryParams.append("category", filters.category);
  if (filters?.city) queryParams.append("city", filters.city);
  
  const path = `${api.providers.list.path}?${queryParams.toString()}`;

  return useQuery({
    queryKey: [api.providers.list.path, filters],
    queryFn: async () => {
      const res = await fetch(path);
      if (!res.ok) throw new Error("Failed to fetch providers");
      return api.providers.list.responses[200].parse(await res.json());
    },
  });
}

export function useProvider(id: number) {
  return useQuery({
    queryKey: [api.providers.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.providers.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch provider");
      return api.providers.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
