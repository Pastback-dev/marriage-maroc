import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Map as MapIcon, 
  Users, 
  LogOut, 
  Menu,
  X 
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location === path;
  
  const navItems = [
    { label: "My Plan", path: "/plan", icon: MapIcon },
    { label: "Guests", path: "/guests", icon: Users },
    { label: "Providers", path: "/providers", icon: Heart },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display font-bold text-gradient-gold">ARSI</span>
            <div className="h-2 w-2 rounded-full bg-primary group-hover:animate-pulse" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`
                      flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary
                      ${isActive(item.path) ? "text-primary font-bold" : "text-muted-foreground"}
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
                <div className="h-6 w-px bg-border mx-2" />
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">
                    {user.displayName || user.username}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => logout()}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost" className="font-semibold text-secondary">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6 text-secondary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l-primary/20">
                <div className="flex flex-col gap-8 mt-8">
                  <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-display font-bold text-center text-gradient-gold">
                    ARSI
                  </Link>
                  
                  {user ? (
                    <div className="flex flex-col gap-4">
                      {navItems.map((item) => (
                        <Link 
                          key={item.path} 
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`
                            flex items-center gap-4 p-3 rounded-lg transition-colors
                            ${isActive(item.path) 
                              ? "bg-primary/10 text-primary font-bold" 
                              : "text-muted-foreground hover:bg-muted"}
                          `}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      ))}
                      <Button 
                        variant="destructive" 
                        className="mt-4 w-full"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">Sign In</Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
