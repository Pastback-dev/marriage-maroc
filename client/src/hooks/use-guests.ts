import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type Guest, type InsertGuest } from "@shared/schema";

// ─── LocalStorage helpers ────────────────────────────────────────────────────

const GUESTS_KEY = "app_guests";

function getStoredGuests(): Guest[] {
  try {
    const raw = localStorage.getItem(GUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuests(guests: Guest[]) {
  localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useGuests() {
  return useQuery<Guest[]>({
    queryKey: ["/api/guests"],
    queryFn: () => getStoredGuests(),
    staleTime: Infinity,
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertGuest): Promise<Guest> => {
      const guests = getStoredGuests();
      const newGuest: Guest = {
        id: Date.now(),
        userId: data.userId,
        planId: data.planId ?? null,
        name: data.name,
        type: data.type,
        pricePerGuest: data.pricePerGuest ?? 0,
      };
      saveGuests([...guests, newGuest]);
      return newGuest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      toast({ title: "Guest Added", description: "Your guest list has been updated." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const guests = getStoredGuests().filter((g) => g.id !== id);
      saveGuests(guests);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      toast({ title: "Guest Removed", description: "The guest has been removed from your list." });
    },
  });
}
