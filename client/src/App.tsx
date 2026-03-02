import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AuthPage from "@/pages/Auth";
import Plan from "@/pages/Plan";
import Guests from "@/pages/Guests";
import ProvidersList from "@/pages/ProvidersList";
import ProviderProfile from "@/pages/ProviderProfile";
import MoodBoard from "@/pages/MoodBoard";
import Categories from "@/pages/Categories";
import Rules from "@/pages/Rules";
import AboutUs from "@/pages/AboutUs";
import AdminDashboard from "@/pages/AdminDashboard";
import ProviderDashboard from "@/pages/ProviderDashboard";

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
      <Route path="/providers/:id" component={ProviderProfile} />
      <Route path="/moodboard" component={MoodBoard} />
      <Route path="/categories" component={Categories} />
      <Route path="/rules" component={Rules} />
      <Route path="/about" component={AboutUs} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/provider-dashboard" component={ProviderDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;