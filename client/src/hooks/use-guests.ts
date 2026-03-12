import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type Guest, type InsertGuest } from "@shared/schema";

export function useGuests() {
  return useQuery<Guest[]>({
    queryKey: ["guests"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      let query = supabase.from('guests').select('*');

      if (userId) {
        // Show guests that are validated OR belong to the current user
        query = query.or(`validated.eq.true,user_id.eq.${userId}`);
      } else {
        // If not logged in, only show validated guests
        query = query.eq('validated', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data as any[]).map(g => ({
        ...g,
        userId: g.user_id,
        numberOfGuests: g.number_of_guests,
        pricePerGuest: g.price_per_guest,
        eventDate: g.event_date,
        eventTime: g.event_time,
        validated: !!g.validated,
        phoneNumber: g.phone_number,
      })) as Guest[];
    },
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertGuest) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: guest, error } = await supabase
        .from('guests')
        .insert({
          user_id: user.id,
          name: data.name,
          type: data.type,
          price_per_guest: data.pricePerGuest,
          number_of_guests: data.numberOfGuests,
          gender: data.gender,
          plan_id: data.planId,
          city: data.city,
          event_date: data.eventDate,
          event_time: data.eventTime,
          description: data.description,
          validated: data.validated ?? false,
          phone_number: data.phoneNumber,
        })
        .select()
        .single();

      if (error) throw error;
      return guest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast({ title: "Guest Added", description: "Your guest list has been updated." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: InsertGuest & { id: number }) => {
      const { error } = await supabase
        .from('guests')
        .update({
          name: data.name,
          type: data.type,
          price_per_guest: data.pricePerGuest,
          number_of_guests: data.numberOfGuests,
          gender: data.gender,
          plan_id: data.planId,
          city: data.city,
          event_date: data.eventDate,
          event_time: data.eventTime,
          description: data.description,
          validated: data.validated,
          phone_number: data.phoneNumber,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast({ title: "Guest Updated", description: "The guest details have been saved." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });
}

export function useToggleGuestValidation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, validated }: { id: number; validated: boolean }) => {
      const { error } = await supabase
        .from('guests')
        .update({ validated })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
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
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast({ title: "Guest Removed", description: "The guest has been removed from your list." });
    },
  });
}