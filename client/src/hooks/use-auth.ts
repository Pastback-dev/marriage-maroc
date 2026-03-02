import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type User, type LoginRequest, type RegisterRequest } from "@shared/schema";

// ─── LocalStorage helpers ────────────────────────────────────────────────────

const USER_KEY = "app_user";

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: User | null) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useUser() {
  return useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: () => getStoredUser(),
    staleTime: Infinity,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<User> => {
      // Accept any email+password — simulate local auth
      const user: User = {
        id: 1,
        username: credentials.username,
        password: "",
        displayName: credentials.username.split("@")[0],
        role: credentials.role ?? "client",
        serviceCategory: null,
        city: null,
        isAdmin: false,
        createdAt: new Date(),
      };
      setStoredUser(user);
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.displayName || user.username}`,
      });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Login failed", description: error.message });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<User> => {
      const user: User = {
        id: Date.now(),
        username: data.username,
        password: "",
        displayName: data.displayName ?? data.username.split("@")[0],
        role: data.role ?? "client",
        serviceCategory: data.serviceCategory ?? null,
        city: data.city ?? null,
        isAdmin: false,
        createdAt: new Date(),
      };
      setStoredUser(user);
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({ title: "Account created", description: "You are now logged in." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Registration failed", description: error.message });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      setStoredUser(null);
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      queryClient.clear();
      toast({ title: "Logged out", description: "See you soon!" });
    },
  });
}
