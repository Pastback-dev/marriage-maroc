import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type PlanResponse, type CreatePlanRequest } from "@shared/schema";

export function usePlans() {
  return useQuery<PlanResponse[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*, breakdown:selected_providers(*)') // This assumes a join or manual mapping
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // For the demo, we'll fetch providers separately if needed or use the stored JSON
      return data as any[];
    },
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreatePlanRequest) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Mock AI logic: Pick random providers for the demo
      const { data: providers } = await supabase.from('providers').select('*');
      const traiteur = providers?.find(p => p.category === 'traiteur');
      const hall = providers?.find(p => p.category === 'hall');
      
      const totalCost = (traiteur?.price_min || 0) * data.guestCount + (hall?.price_min || 0);

      const { data: plan, error } = await supabase
        .from('plans')
        .insert({
          user_id: user.id,
          guest_count: data.guestCount,
          total_budget: data.totalBudget,
          city: data.city,
          wedding_style: data.weddingStyle,
          total_cost: totalCost,
          selected_providers: {
            traiteur: traiteur?.id,
            hall: hall?.id
          }
        })
        .select()
        .single();

      if (error) throw error;
      return plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({ title: "Plan Created!", description: "We've generated your wedding package." });
    },
  });
}