import { Navigation } from "@/components/Navigation";
import { usePlans, useCreatePlan } from "@/hooks/use-plans";
import { useUser } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Receipt, Calendar, Users as UsersIcon } from "lucide-react";
import { ProviderCard } from "@/components/ProviderCard";
import { type PlanResponse } from "@shared/routes";

const planSchema = z.object({
  guestCount: z.coerce.number().min(1, "At least 1 guest required"),
  totalBudget: z.coerce.number().min(5000, "Minimum budget 5000 MAD"),
  city: z.string().min(1, "City is required"),
  weddingStyle: z.string().min(1, "Style is required"),
});

type PlanFormValues = z.infer<typeof planSchema>;

export default function Plan() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: plans, isLoading: plansLoading } = usePlans();
  const createPlan = useCreatePlan();
  
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      guestCount: 100,
      totalBudget: 50000,
      city: "Casablanca",
      weddingStyle: "Traditional",
    },
  });

  const onSubmit = (data: PlanFormValues) => {
    createPlan.mutate(data);
  };

  if (userLoading || plansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // If user has a plan, show it. Otherwise show create form.
  const currentPlan = plans?.[0] as PlanResponse | undefined;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!currentPlan ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-display font-bold text-secondary mb-4">Plan Your Wedding</h1>
              <p className="text-muted-foreground">Let our AI curate the perfect package for your budget.</p>
            </div>

            <Card className="border-t-4 border-t-primary shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> AI Wedding Generator
                </CardTitle>
                <CardDescription>Enter your details below to get started.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="guestCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Guests</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="totalBudget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Budget (MAD)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Casablanca">Casablanca</SelectItem>
                                <SelectItem value="Rabat">Rabat</SelectItem>
                                <SelectItem value="Marrakech">Marrakech</SelectItem>
                                <SelectItem value="Fes">Fes</SelectItem>
                                <SelectItem value="Tangier">Tangier</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weddingStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Wedding Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Traditional">Traditional Moroccan</SelectItem>
                                <SelectItem value="Modern">Modern / Western</SelectItem>
                                <SelectItem value="Royal">Royal / Luxury</SelectItem>
                                <SelectItem value="Intimate">Intimate</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" disabled={createPlan.isPending}>
                      {createPlan.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating Plan...
                        </>
                      ) : (
                        "Generate My Plan"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* Plan Summary Dashboard */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-secondary text-secondary-foreground border-none">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Total Estimated Cost</p>
                    <p className="text-2xl font-bold font-display">{currentPlan.totalCost.toLocaleString()} MAD</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    <UsersIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guest Count</p>
                    <p className="text-2xl font-bold font-display">{currentPlan.guestCount}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Wedding Style</p>
                    <p className="text-2xl font-bold font-display">{currentPlan.weddingStyle}</p>
                  </div>
                </CardContent>
              </Card>
              
               <Card>
                <CardContent className="p-6 flex items-center gap-4">
                   <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining Budget</p>
                    <p className="text-2xl font-bold font-display text-emerald-600">{(currentPlan.totalBudget - currentPlan.totalCost).toLocaleString()} MAD</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Providers Grid */}
            <div>
              <h2 className="text-3xl font-display font-bold text-secondary mb-6 flex items-center gap-3">
                <span className="bg-primary/20 p-2 rounded-lg"><Sparkles className="w-6 h-6 text-primary" /></span>
                Your Curated Team
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPlan.breakdown.traiteur && <ProviderCard provider={currentPlan.breakdown.traiteur} />}
                {currentPlan.breakdown.hall && <ProviderCard provider={currentPlan.breakdown.hall} />}
                {currentPlan.breakdown.dj && <ProviderCard provider={currentPlan.breakdown.dj} />}
                {currentPlan.breakdown.cameraman && <ProviderCard provider={currentPlan.breakdown.cameraman} />}
              </div>
            </div>
            
            <div className="flex justify-center mt-12">
               <Button 
                variant="outline" 
                size="lg"
                className="text-muted-foreground hover:text-destructive hover:border-destructive"
                onClick={() => {
                  if(confirm("Are you sure? This will delete your current plan.")) {
                    // Logic to delete plan would go here if implemented in backend
                    window.location.reload(); 
                  }
                }}
               >
                 Reset Plan & Start Over
               </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
