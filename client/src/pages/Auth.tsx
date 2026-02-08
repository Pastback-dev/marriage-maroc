import { useLogin, useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useLocation, Link } from "wouter";
import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";

export default function AuthPage({ mode = "login" }: { mode?: "login" | "register" }) {
  const [, setLocation] = useLocation();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      displayName: "",
    },
  });

  const onSubmit = async (data: InsertUser) => {
    if (mode === "login") {
      loginMutation.mutate(data, {
        onSuccess: () => setLocation("/plan"),
      });
    } else {
      registerMutation.mutate(data, {
        onSuccess: () => setLocation("/login"),
      });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-secondary/10 skew-y-6 transform origin-top-left -z-10" />
      
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-2">
          <Link href="/">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-primary/90 transition-colors">
              <span className="font-display font-bold text-white text-xl">A</span>
            </div>
          </Link>
          <CardTitle className="text-2xl font-display text-secondary">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {mode === "login" 
              ? "Enter your credentials to access your wedding plan" 
              : "Start planning your dream Moroccan wedding today"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {mode === "register" && (
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-secondary hover:bg-secondary/90 mt-4" 
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {mode === "login" ? "Sign In" : "Register"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            {mode === "login" ? (
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-semibold">
                  Sign up
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold">
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
