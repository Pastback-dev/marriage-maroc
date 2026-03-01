import { useLogin, useRegister, useUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, Link } from "wouter";
import { z } from "zod";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { useEffect } from "react";

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

export default function AuthPage({ mode = "login" }: { mode?: "login" | "register" }) {
  const [, setLocation] = useLocation();
  const { data: user } = useUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  useEffect(() => {
    if (user) {
      setLocation("/plan");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
  });

  const onLogin = async (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: () => setLocation("/plan"),
    });
  };

  const onRegister = async (data: RegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData, {
      onSuccess: () => setLocation("/login"),
    });
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

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
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Sign in with your email to access your wedding plan"
              : "Start planning your dream Moroccan wedding today"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "login" ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10"
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
                  control={loginForm.control}
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
                  disabled={isPending}
                  data-testid="button-submit"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Sign In
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Your full name"
                            className="pl-10"
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
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10"
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
                  control={registerForm.control}
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
                  control={registerForm.control}
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
                  disabled={isPending}
                  data-testid="button-submit"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Create Account
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6 text-center text-sm">
            {mode === "login" ? (
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-semibold" data-testid="link-register">
                  Sign up
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold" data-testid="link-login">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
