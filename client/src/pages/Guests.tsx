import { Navigation } from "@/components/Navigation";
import { useGuests, useCreateGuest, useUpdateGuest, useDeleteGuest } from "@/hooks/use-guests";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGuestSchema, type InsertGuest, type Guest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Calculator, Users as UsersIcon, Edit2, X } from "lucide-react";
import { useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { GuestTable } from "@/components/GuestTable";
import { useState, useEffect } from "react";

export default function Guests() {
  const { data: user, isLoading: userLoading } = useUser();
  const [, setLocation] = useLocation();
  const { data: guests, isLoading: guestsLoading } = useGuests();
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();
  
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  if (!userLoading && !user) {
    setLocation("/login");
    return null;
  }

  const form = useForm<InsertGuest>({
    resolver: zodResolver(insertGuestSchema),
    defaultValues: {
      name: "",
      type: "local",
      pricePerGuest: 0,
      numberOfGuests: 1,
      gender: "male",
      userId: user?.id,
    },
  });

  // Load guest data into form when editing
  useEffect(() => {
    if (editingGuest) {
      form.reset({
        name: editingGuest.name,
        type: editingGuest.type as "local" | "foreign",
        pricePerGuest: editingGuest.pricePerGuest || 0,
        numberOfGuests: editingGuest.numberOfGuests,
        gender: editingGuest.gender as "male" | "female",
        userId: editingGuest.userId,
      });
    } else {
      form.reset({
        name: "",
        type: "local",
        pricePerGuest: 0,
        numberOfGuests: 1,
        gender: "male",
        userId: user?.id,
      });
    }
  }, [editingGuest, form, user]);

  const onSubmit = (data: InsertGuest) => {
    if (editingGuest) {
      updateGuest.mutate({ ...data, id: editingGuest.id }, {
        onSuccess: () => {
          setEditingGuest(null);
          form.reset();
        }
      });
    } else {
      createGuest.mutate({ ...data, userId: user!.id }, {
        onSuccess: () => form.reset()
      });
    }
  };

  const cancelEdit = () => {
    setEditingGuest(null);
    form.reset();
  };

  const totalExpectedGift = guests?.reduce((sum, g) => sum + ((g.pricePerGuest || 0) * (g.numberOfGuests || 1)), 0) || 0;
  const totalPeople = guests?.reduce((sum, g) => sum + (g.numberOfGuests || 1), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-secondary">Guest List</h1>
            <p className="text-muted-foreground">Manage invites and expected gifts (Gharamah)</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                <UsersIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Total People</p>
                <p className="text-xl font-bold text-secondary">{totalPeople}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Expected Gifts</p>
                <p className="text-xl font-bold text-secondary">{totalExpectedGift.toLocaleString()} MAD</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add/Edit Guest Form */}
          <div className="lg:col-span-1">
             <Card className="sticky top-24">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   {editingGuest ? <Edit2 className="w-5 h-5 text-primary" /> : <UserPlus className="w-5 h-5 text-primary" />} 
                   {editingGuest ? "Edit Guest" : "Add Guest"}
                 </CardTitle>
                 <CardDescription>
                   {editingGuest ? `Updating ${editingGuest.name}` : "Add a new guest or family to your list."}
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <Form {...form}>
                   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guest/Family Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Family El Mansouri" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="numberOfGuests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of People</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  value={field.value || ""}
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Origin</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                  <SelectItem value="local">Local</SelectItem>
                                  <SelectItem value="foreign">Foreign</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="pricePerGuest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gift per Person (MAD)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Gift (MAD)" 
                                  {...field} 
                                  value={field.value || ""}
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        {editingGuest && (
                          <Button type="button" variant="outline" className="flex-1" onClick={cancelEdit}>
                            <X className="w-4 h-4 mr-2" /> Cancel
                          </Button>
                        )}
                        <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90" disabled={createGuest.isPending || updateGuest.isPending}>
                          {editingGuest ? (updateGuest.isPending ? "Updating..." : "Update Guest") : (createGuest.isPending ? "Adding..." : "Add Guest")}
                        </Button>
                      </div>
                   </form>
                 </Form>
               </CardContent>
             </Card>
          </div>

          {/* Guest List Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <GuestTable 
                  guests={guests} 
                  isLoading={guestsLoading} 
                  onEdit={(guest) => setEditingGuest(guest)}
                  onDelete={(id) => deleteGuest.mutate(id)} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}