import { Navigation } from "@/components/Navigation";
import { useGuests, useCreateGuest, useDeleteGuest } from "@/hooks/use-guests";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGuestSchema, type InsertGuest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, UserPlus, Calculator, Plane, Home as HomeIcon } from "lucide-react";
import { useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function Guests() {
  const { data: user, isLoading: userLoading } = useUser();
  const [, setLocation] = useLocation();
  const { data: guests, isLoading: guestsLoading } = useGuests();
  const createGuest = useCreateGuest();
  const deleteGuest = useDeleteGuest();

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
      userId: user?.id,
    },
  });

  const onSubmit = (data: InsertGuest) => {
    createGuest.mutate({ ...data, userId: user!.id }, {
      onSuccess: () => form.reset({ name: "", type: "local", pricePerGuest: 0, userId: user!.id })
    });
  };

  const totalExpectedGift = guests?.reduce((sum, g) => sum + (g.pricePerGuest || 0), 0) || 0;
  const localCount = guests?.filter(g => g.type === 'local').length || 0;
  const foreignCount = guests?.filter(g => g.type === 'foreign').length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-secondary">Guest List</h1>
            <p className="text-muted-foreground">Manage invites and expected gifts (Gharamah)</p>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Guest Form */}
          <div className="lg:col-span-1">
             <Card className="sticky top-24">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary" /> Add Guest</CardTitle>
                 <CardDescription>Add a new guest to your list.</CardDescription>
               </CardHeader>
               <CardContent>
                 <Form {...form}>
                   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Guest Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
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
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Gift (MAD)" 
                                  {...field} 
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" disabled={createGuest.isPending}>
                        {createGuest.isPending ? "Adding..." : "Add Guest"}
                      </Button>
                   </form>
                 </Form>
               </CardContent>
             </Card>
          </div>

          {/* Guest List Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Est. Gift</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guestsLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
                      </TableRow>
                    ) : guests?.length === 0 ? (
                      <TableRow>
                         <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                           No guests added yet. Start adding people on the left!
                         </TableCell>
                      </TableRow>
                    ) : (
                      guests?.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell className="font-medium">{guest.name}</TableCell>
                          <TableCell>
                            {guest.type === 'local' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                                <HomeIcon className="w-3 h-3" /> Local
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                                <Plane className="w-3 h-3" /> Foreign
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{guest.pricePerGuest} MAD</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => deleteGuest.mutate(guest.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
