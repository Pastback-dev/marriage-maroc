"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Calculator, Users as UsersIcon, Edit2, X, MapPin, Calendar, Clock, FileText, Phone } from "lucide-react";
import { useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { GuestTable } from "@/components/GuestTable";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Meknes", "Oujda", "Kenitra", "Tetouan"
].sort();

export default function Guests() {
  const { data: user, isLoading: userLoading } = useUser();
  const [, setLocation] = useLocation();
  const { data: guests, isLoading: guestsLoading } = useGuests();
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();

  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const { t } = useTranslation();

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
      city: "",
      eventDate: "",
      eventTime: "",
      description: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (editingGuest) {
      form.reset({
        name: editingGuest.name,
        type: editingGuest.type as "local" | "foreign",
        pricePerGuest: editingGuest.pricePerGuest || 0,
        numberOfGuests: editingGuest.numberOfGuests,
        gender: editingGuest.gender as "male" | "female" | "both",
        userId: editingGuest.userId,
        city: editingGuest.city || "",
        eventDate: editingGuest.eventDate || "",
        eventTime: editingGuest.eventTime || "",
        description: editingGuest.description || "",
        phoneNumber: editingGuest.phoneNumber || "",
      });
    } else {
      form.reset({
        name: "",
        type: "local",
        pricePerGuest: 0,
        numberOfGuests: 1,
        gender: "male",
        userId: user?.id,
        city: "",
        eventDate: "",
        eventTime: "",
        description: "",
        phoneNumber: "",
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

  // Only calculate stats for the current user's guests
  const myGuests = useMemo(() => {
    return guests?.filter(g => g.userId === user?.id) || [];
  }, [guests, user?.id]);

  const totalExpectedGift = myGuests.reduce((sum, g) => sum + ((g.pricePerGuest || 0) * (g.numberOfGuests || 1)), 0);
  const totalPeople = myGuests.reduce((sum, g) => sum + (g.numberOfGuests || 1), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-secondary">{t("guest_list_title")}</h1>
            <p className="text-sm text-muted-foreground">{t("guest_list_desc")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-xl border border-border shadow-sm">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-full shrink-0">
                <UsersIcon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">{t("stat_people")}</p>
                <p className="text-lg md:text-xl font-bold text-secondary">{totalPeople}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-xl border border-border shadow-sm">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full shrink-0">
                <Calculator className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">{t("stat_gifts")}</p>
                <p className="text-lg md:text-xl font-bold text-secondary">{totalExpectedGift.toLocaleString()} <span className="text-[10px]">MAD</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="lg:sticky lg:top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {editingGuest ? <Edit2 className="w-5 h-5 text-primary" /> : <UserPlus className="w-5 h-5 text-primary" />}
                  {editingGuest ? t("edit_guest") : t("add_guest")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {editingGuest ? t("updating_name", { name: editingGuest.name }) : t("add_new_guest_desc")}
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
                          <FormLabel className="text-xs">{t("guest_family_name")}</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Family El Mansouri" {...field} className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-xs"><Phone className="w-3 h-3" /> {t("phone_number")}</FormLabel>
                          <FormControl>
                            <Input placeholder="+212 6XX XXX XXX" {...field} className="h-10" />
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
                            <FormLabel className="text-xs">{t("gender")}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder={t("gender")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                <SelectItem value="male">{t("gender_male")}</SelectItem>
                                <SelectItem value="female">{t("gender_female")}</SelectItem>
                                <SelectItem value="both">{t("gender_both")}</SelectItem>
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
                            <FormLabel className="text-xs">{t("people_label")}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ""}
                                onChange={e => field.onChange(Number(e.target.value))}
                                className="h-10"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="pricePerGuest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">{t("gift_per_person")}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={t("gift_per_person")}
                                {...field}
                                value={field.value || ""}
                                onChange={e => field.onChange(Number(e.target.value))}
                                className="h-10"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="h-px bg-border my-2" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("event_details")}</p>

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-xs"><MapPin className="w-3 h-3" /> {t("moroccan_city")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder={t("select_city")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white max-h-[250px]">
                              {MOROCCAN_CITIES.map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-xs"><Calendar className="w-3 h-3" /> {t("date_label")}</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} className="h-10 text-xs" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eventTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-xs"><Clock className="w-3 h-3" /> {t("time_label")}</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} className="h-10 text-xs" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-xs"><FileText className="w-3 h-3" /> {t("description_label")}</FormLabel>
                          <FormControl>
                            <Textarea placeholder={t("additional_notes")} {...field} className="resize-none text-xs min-h-[80px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 pt-2">
                      {editingGuest && (
                        <Button type="button" variant="outline" className="flex-1 h-11" onClick={cancelEdit}>
                          <X className="w-4 h-4 mr-2" /> {t("cancel")}
                        </Button>
                      )}
                      <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90 h-11 font-bold" disabled={createGuest.isPending || updateGuest.isPending}>
                        {editingGuest ? (updateGuest.isPending ? t("updating_guest") : t("update_guest")) : (createGuest.isPending ? t("adding_guest") : t("add_guest"))}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card className="border-none lg:border lg:border-border shadow-none lg:shadow-sm">
              <CardContent className="p-0">
                <GuestTable
                  guests={guests}
                  isLoading={guestsLoading}
                  onEdit={(guest) => {
                    setEditingGuest(guest);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onDelete={(id) => {
                    if (confirm(t("remove_guest_confirm"))) deleteGuest.mutate(id);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}