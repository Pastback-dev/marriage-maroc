import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertGuest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useGuests() {
  return useQuery({
    queryKey: [api.guests.list.path],
    queryFn: async () => {
      const res = await fetch(api.guests.list.path);
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch guests");
      return api.guests.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertGuest) => {
      const res = await fetch(api.guests.create.path, {
        method: api.guests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add guest");
      return api.guests.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.guests.list.path] });
      toast({
        title: "Guest Added",
        description: "Your guest list has been updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.guests.delete.path, { id });
      const res = await fetch(url, { method: api.guests.delete.method });
      if (!res.ok) throw new Error("Failed to delete guest");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.guests.list.path] });
      toast({
        title: "Guest Removed",
        description: "The guest has been removed from your list.",
      });
    },
  });
}
