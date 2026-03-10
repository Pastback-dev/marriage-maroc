import { Navigation } from "@/components/Navigation";
import { usePlans, useCreatePlan } from "@/hooks/use-plans";
import { useUser } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Receipt, Calendar, Users as UsersIcon, MapPin } from "lucide-react";
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
  const { t } = useTranslation();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: plans, isLoading: plansLoading } = usePlans();
  const createPlan = useCreatePlan();

  const cities = [
    { id: "Casablanca", name: t("city_casablanca") },
    { id: "Rabat", name: t("city_rabat") },
    { id: "Marrakech", name: t("city_marrakech") },
    { id: "Fes", name: t("city_fes") },
    { id: "Tangier", name: t("city_tangier") },
    { id: "Agadir", name: t("city_agadir") },
    { id: "Meknes", name: t("city_meknes") },
    { id: "Oujda", name: t("city_oujda") },
    { id: "Kenitra", name: t("city_kenitra") },
    { id: "Tetouan", name: t("city_tetouan") },
  ];

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      guestCount: parseInt(new URLSearchParams(window.location.search).get("guests") || "100"),
      totalBudget: parseInt(new URLSearchParams(window.location.search).get("budget") || "50000"),
      city: new URLSearchParams(window.location.search).get("city") || "Casablanca",
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

  const currentPlan = plans?.[0] as PlanResponse | undefined;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!currentPlan ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-display font-bold text-secondary mb-3" data-testid="text-plan-title">{t("ai_box_title")}</h1>
              <p className="text-muted-foreground/80 text-sm">{t("hero_subtitle")}</p>
            </div>

            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-amber-50/50 pb-4 pt-7 px-8">
                <CardTitle className="flex items-center gap-3 text-lg font-display text-secondary" data-testid="text-generator-title">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-amber-200/30 rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  {t("ai_box_title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="guestCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                              <UsersIcon className="w-3 h-3 text-primary/70" /> {t("guest_count")}
                            </FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="bg-white border border-border/50 h-11 text-base rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all" data-testid="input-plan-guests" />
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
                            <FormLabel className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                              <Receipt className="w-3 h-3 text-primary/70" /> {t("budget")}
                            </FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="bg-white border border-border/50 h-11 text-base rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all" data-testid="input-plan-budget" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-primary/70" /> {t("city")}
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white border border-border/50 h-11 text-base rounded-xl focus:ring-primary/20 focus:border-primary/30 transition-all" data-testid="select-plan-city">
                                  <SelectValue placeholder={t("select_city")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-border/30 shadow-xl p-1.5 bg-white">
                                {cities.map(c => (
                                  <SelectItem key={c.id} value={c.id} className="rounded-lg py-2.5 focus:bg-primary/8 focus:text-primary transition-colors cursor-pointer">{c.name}</SelectItem>
                                ))}
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
                            <FormLabel className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-primary/70" /> {t("style_label")}
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white border border-border/50 h-11 text-base rounded-xl focus:ring-primary/20 focus:border-primary/30 transition-all" data-testid="select-plan-style">
                                  <SelectValue placeholder={t("select_style")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-border/30 shadow-xl p-1.5 bg-white">
                                <SelectItem value="Traditional" className="rounded-lg py-2.5">{t("style_traditional")}</SelectItem>
                                <SelectItem value="Modern" className="rounded-lg py-2.5">{t("style_modern")}</SelectItem>
                                <SelectItem value="Royal" className="rounded-lg py-2.5">{t("style_royal")}</SelectItem>
                                <SelectItem value="Intimate" className="rounded-lg py-2.5">{t("style_intimate")}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full h-12 text-base font-bold bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white shadow-lg shadow-secondary/15 rounded-xl transition-all active:scale-[0.98]" disabled={createPlan.isPending} data-testid="button-generate-plan">
                      {createPlan.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("generating")}
                        </>
                      ) : (
                        t("get_recommendation")
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-secondary text-secondary-foreground border-none rounded-2xl">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider opacity-60 font-semibold">{t("total_estimated")}</p>
                    <p className="text-xl font-bold font-display" data-testid="text-total-cost">{currentPlan.totalCost.toLocaleString()} MAD</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <UsersIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{t("guest_count")}</p>
                    <p className="text-xl font-bold font-display" data-testid="text-guest-count">{currentPlan.guestCount}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{t("style_label")}</p>
                    <p className="text-xl font-bold font-display" data-testid="text-style">{currentPlan.weddingStyle}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{t("remaining_budget")}</p>
                    <p className="text-xl font-bold font-display text-emerald-600" data-testid="text-remaining">{(currentPlan.totalBudget - currentPlan.totalCost).toLocaleString()} MAD</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-3xl font-display font-bold text-secondary mb-6 flex items-center gap-3">
                <span className="bg-primary/20 p-2 rounded-lg"><Sparkles className="w-6 h-6 text-primary" /></span>
                {t("curated_team")}
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
                className="text-muted-foreground hover:text-destructive hover:border-destructive rounded-xl"
                onClick={() => {
                  if (confirm(t("reset_confirm"))) {
                    window.location.reload();
                  }
                }}
                data-testid="button-reset-plan"
              >
                {t("reset_plan")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}