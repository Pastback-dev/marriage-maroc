import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type Plan, type CreatePlanRequest, type PlanResponse } from "@shared/schema";
import { mockProviders } from "@/lib/mockData";

// ─── LocalStorage helpers ────────────────────────────────────────────────────

const PLANS_KEY = "app_plans";

function getStoredPlans(): PlanResponse[] {
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePlans(plans: PlanResponse[]) {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}

// ─── Mock plan generator ─────────────────────────────────────────────────────

function generateMockPlan(data: CreatePlanRequest, userId: number): PlanResponse {
  const { guestCount, totalBudget, city, weddingStyle } = data;

  // Pick best-matching providers per category in the requested city (fallback to any)
  const byCategory = (cat: string) => {
    const inCity = mockProviders.filter((p) => p.category === cat && p.city === city);
    const pool = inCity.length > 0 ? inCity : mockProviders.filter((p) => p.category === cat);
    return pool[Math.floor(Math.random() * pool.length)] ?? null;
  };

  const traiteur = byCategory("traiteur");
  const hall = byCategory("hall");
  const dj = byCategory("dj");
  const cameraman = byCategory("cameraman");

  // Estimate total cost
  const traiteurCost = traiteur ? traiteur.priceMin * guestCount : 0;
  const hallCost = hall ? hall.priceMin : 0;
  const djCost = dj ? dj.priceMin : 0;
  const cameraCost = cameraman ? cameraman.priceMin : 0;
  const totalCost = Math.min(traiteurCost + hallCost + djCost + cameraCost, totalBudget);

  const plan: PlanResponse = {
    id: Date.now(),
    userId,
    guestCount,
    totalBudget,
    city,
    weddingStyle,
    selectedProviders: {
      traiteur: traiteur?.id,
      hall: hall?.id,
      dj: dj?.id,
      cameraman: cameraman?.id,
    },
    totalCost,
    createdAt: new Date(),
    breakdown: { traiteur, hall, dj, cameraman },
  };

  return plan;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function usePlans() {
  return useQuery<PlanResponse[]>({
    queryKey: ["/api/plans"],
    queryFn: () => getStoredPlans(),
    staleTime: Infinity,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreatePlanRequest): Promise<PlanResponse> => {
      const existingPlans = getStoredPlans();
      const userId = 1; // default local user id
      const plan = generateMockPlan(data, userId);
      savePlans([plan, ...existingPlans]);
      return plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({ title: "Plan Created!", description: "We've generated the perfect wedding package for you." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Planning Failed", description: error.message });
    },
  });
}
