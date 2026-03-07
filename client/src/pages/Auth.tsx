import { useUser, useLogin, useRegister } from "@/hooks/use-auth";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import { User, Store, Mail, Lock, Phone, UserCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, loginSchema, type InsertUser, type LoginSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTranslation } from "react-i18next";

export default function AuthPage({ mode: initialMode }: { mode?: "login" | "register" } = {}) {
  const [, setLocation] = useLocation();
  const { data: user } = useUser();
  const { loading: authLoading } = useAuth();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const [role, setRole] = useState<"client" | "provider">("client");
  const [mode, setMode] = useState<"login" | "register">(initialMode || "login");
  const { t } = useTranslation();

  useEffect(() => {
    // Only redirect if auth is fully resolved (not loading) AND user is confirmed logged in
    if (!authLoading && user) {
      setLocation(user.role === "provider" ? "/provider-dashboard" : "/plan");
    }
  }, [user, authLoading, setLocation]);

  // Login form — uses simple schema (email + password only)
  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // Register form — uses full schema
  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      displayName: "",
      phone: "",
      role: role,
    },
  });

  // Update role in register form when tab changes
  useEffect(() => {
    registerForm.setValue("role", role);
  }, [role, registerForm]);

  const onLoginSubmit = (data: LoginSchema) => {
    loginMutation.mutate({ username: data.username, password: data.password });
  };

  const onRegisterSubmit = (data: InsertUser) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-12">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-secondary/10 skew-y-6 transform origin-top-left -z-10" />
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-2">
          <Link href="/">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-primary/90 transition-colors">
              <span className="font-display font-bold text-white text-xl">A</span>
            </div>
          </Link>
          <CardTitle className="text-2xl font-display text-secondary" data-testid="text-auth-title">
            {mode === "login" ? t("auth_welcome_back") : t("auth_join")}
          </CardTitle>
          <CardDescription>
            {role === "provider"
              ? (mode === "login" ? t("auth_provider_login_desc") : t("auth_provider_register_desc"))
              : (mode === "login" ? t("auth_client_login_desc") : t("auth_client_register_desc"))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={(v) => setRole(v as "client" | "provider")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client" className="flex items-center gap-2" data-testid="tab-client">
                <User className="w-4 h-4" />
                Client
              </TabsTrigger>
              <TabsTrigger value="provider" className="flex items-center gap-2" data-testid="tab-provider">
                <Store className="w-4 h-4" />
                Provider
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* ── LOGIN FORM ── */}
          {mode === "login" && (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" /> {t("email_address")}
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" /> {t("password")}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-11"
                  disabled={loginMutation.isPending}
                  data-testid="button-auth-submit"
                >
                  {loginMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {t("sign_in_btn")}
                </Button>
              </form>
            </Form>
          )}

          {/* ── REGISTER FORM ── */}
          {mode === "register" && (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserCircle className="w-4 h-4 text-primary" /> {t("full_name")}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={t("enter_name")} {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" /> {t("email_address")}
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {role === "provider" && (
                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" /> {t("phone_number")}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+212 6XX XXX XXX" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" /> {t("password")}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-11"
                  disabled={registerMutation.isPending}
                  data-testid="button-auth-submit"
                >
                  {registerMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {t("create_account")}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm text-primary hover:underline font-medium"
              data-testid="button-toggle-mode"
            >
              {mode === "login" ? t("no_account") : t("have_account")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}