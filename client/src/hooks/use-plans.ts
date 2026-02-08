import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreatePlanRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function usePlans() {
  return useQuery({
    queryKey: [api.plans.list.path],
    queryFn: async () => {
      const res = await fetch(api.plans.list.path);
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch plans");
      return api.plans.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreatePlanRequest) => {
      const res = await fetch(api.plans.create.path, {
        method: api.plans.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 401) throw new Error("Please login to save your plan");
      if (!res.ok) throw new Error("Failed to create plan");
      
      return api.plans.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.plans.list.path] });
      toast({
        title: "Plan Created!",
        description: "We've generated the perfect wedding package for you.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Planning Failed",
        description: error.message,
      });
    },
  });
}
