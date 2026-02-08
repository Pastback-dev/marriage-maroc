import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AuthPage from "@/pages/Auth";
import Plan from "@/pages/Plan";
import Guests from "@/pages/Guests";
import ProvidersList from "@/pages/ProvidersList";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login">
        {() => <AuthPage mode="login" />}
      </Route>
      <Route path="/register">
        {() => <AuthPage mode="register" />}
      </Route>
      <Route path="/plan" component={Plan} />
      <Route path="/guests" component={Guests} />
      <Route path="/providers" component={ProvidersList} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
