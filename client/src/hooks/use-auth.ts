import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type LoginRequest, type RegisterRequest, type User } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useUser() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path);
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.me.responses[200].parse(await res.json());
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid email or password");
        throw new Error("Login failed");
      }
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.auth.me.path], user);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.displayName || user.username}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.auth.register.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Registration failed");
      }
      return api.auth.register.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Typically auto-login or redirect to login
      toast({
        title: "Account created",
        description: "You can now log in.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, {
        method: api.auth.logout.method,
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      queryClient.clear(); // Clear all cache on logout
      toast({
        title: "Logged out",
        description: "See you soon!",
      });
    },
  });
}
