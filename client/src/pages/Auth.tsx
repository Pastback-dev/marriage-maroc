import { useLogin, useRegister, useUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, Link } from "wouter";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Mail, Lock, User, Store } from "lucide-react";

const loginSchema = z.object({
  username: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  displayName: z.string().min(2, "Full name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

function LoginPage() {
  const [, setLocation] = useLocation();
  const { data: user } = useUser();
  const loginMutation = useLogin();
  const [loginRole, setLoginRole] = useState<"client" | "provider">("client");

  if (user) {
    setLocation(user.role === "provider" ? "/provider-dashboard" : "/plan");
    return null;
  }

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    loginMutation.mutate({ ...data, role: loginRole }, {
      onSuccess: (user: any) => {
        setLocation(user.role === "provider" ? "/provider-dashboard" : "/plan");
      },
    });
  };

  const descriptions: Record<string, string> = {
    client: "Sign in to access your wedding plan",
    provider: "Sign in to manage your services and bookings",
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description={descriptions[loginRole]}
    >
      <Tabs value={loginRole} onValueChange={(v) => setLoginRole(v as "client" | "provider")} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client" className="flex items-center gap-2" data-testid="tab-client-login">
            <User className="w-4 h-4" />
            Client
          </TabsTrigger>
          <TabsTrigger value="provider" className="flex items-center gap-2" data-testid="tab-provider-login">
            <Store className="w-4 h-4" />
            Provider
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={loginRole === "provider" ? "provider@business.com" : "your@email.com"}
                      className="pl-10"
                      autoComplete="email"
                      data-testid="input-email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      autoComplete="current-password"
                      data-testid="input-password"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-secondary hover:bg-secondary/90 mt-4"
            disabled={loginMutation.isPending}
            data-testid="button-submit"
          >
            {loginMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {loginRole === "provider" ? "Sign In as Provider" : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm space-y-2">
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href={loginRole === "provider" ? "/register?role=provider" : "/register"}
            className="text-primary hover:underline font-semibold"
            data-testid="link-register"
          >
            {loginRole === "provider" ? "Register as Provider" : "Sign up"}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

function RegisterPage() {
  const [, setLocation] = useLocation();
  const { data: user } = useUser();
  const registerMutation = useRegister();

  const searchParams = new URLSearchParams(window.location.search);
  const initialRole = searchParams.get("role") === "provider" ? "provider" : "client";
  const [registerRole, setRegisterRole] = useState<"client" | "provider">(initialRole);

  if (user) {
    setLocation(user.role === "provider" ? "/provider-dashboard" : "/plan");
    return null;
  }

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate({ ...registerData, role: registerRole }, {
      onSuccess: () => setLocation("/login"),
    });
  };

  const descriptions: Record<string, string> = {
    client: "Start planning your dream Moroccan wedding today",
    provider: "Join our platform and reach more clients",
  };

  return (
    <AuthLayout
      title={registerRole === "provider" ? "Provider Registration" : "Create Account"}
      description={descriptions[registerRole]}
    >
      <Tabs value={registerRole} onValueChange={(v) => setRegisterRole(v as "client" | "provider")} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client" className="flex items-center gap-2" data-testid="tab-client-register">
            <User className="w-4 h-4" />
            Client
          </TabsTrigger>
          <TabsTrigger value="provider" className="flex items-center gap-2" data-testid="tab-provider-register">
            <Store className="w-4 h-4" />
            Provider
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{registerRole === "provider" ? "Business Name" : "Full Name"}</FormLabel>
                <FormControl>
                  <div className="relative">
                    {registerRole === "provider" ? (
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    ) : (
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    )}
                    <Input
                      placeholder={registerRole === "provider" ? "Your business name" : "Your full name"}
                      className="pl-10"
                      autoComplete="name"
                      data-testid="input-displayname"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={registerRole === "provider" ? "provider@business.com" : "your@email.com"}
                      className="pl-10"
                      autoComplete="email"
                      data-testid="input-email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="At least 6 characters"
                      className="pl-10"
                      autoComplete="new-password"
                      data-testid="input-password"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Re-enter your password"
                      className="pl-10"
                      autoComplete="new-password"
                      data-testid="input-confirm-password"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-secondary hover:bg-secondary/90 mt-4"
            disabled={registerMutation.isPending}
            data-testid="button-submit"
          >
            {registerMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {registerRole === "provider" ? "Register as Provider" : "Create Account"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-semibold" data-testid="link-login">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

function AuthLayout({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-secondary/10 skew-y-6 transform origin-top-left -z-10" />
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-2">
          <Link href="/">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-primary/90 transition-colors">
              <span className="font-display font-bold text-white text-xl">A</span>
            </div>
          </Link>
          <CardTitle className="text-2xl font-display text-secondary" data-testid="text-auth-title">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

export default function AuthPage({ mode = "login" }: { mode?: "login" | "register" }) {
  if (mode === "register") return <RegisterPage />;
  return <LoginPage />;
}
