import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Map as MapIcon, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Languages,
  Layout,
  Sparkles,
  Grid3X3,
  ShieldCheck,
  LogIn,
  LayoutDashboard,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const isActive = (path: string) => location === path;
  
  const publicNavItems = [
    { label: t("sign_in"), path: "/login", icon: LogIn },
    { label: t("nav_providers"), path: "/providers", icon: Heart },
    { label: t("nav_ai_recommendation"), path: "/plan", icon: Sparkles },
    { label: t("nav_categories"), path: "/categories", icon: Grid3X3 },
    { label: t("nav_rules"), path: "/rules", icon: ShieldCheck },
    { label: t("nav_about"), path: "/about", icon: Info },
  ];

  const userNavItems = [
    { label: t("nav_guests"), path: "/guests", icon: Users },
    { label: "Mood Board", path: "/moodboard", icon: Layout },
  ];

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'ar', label: 'العربية', short: 'AR' },
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-secondary font-semibold rounded-full px-4 transition-all" data-testid="button-language">
                  <Languages className="w-4 h-4 text-primary" />
                  {languages.find(l => l.code === i18n.language)?.short || 'EN'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px] rounded-xl border-border/40 shadow-xl p-1.5 bg-white">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`rounded-lg px-4 py-2.5 cursor-pointer transition-all font-medium ${
                      i18n.language === lang.code 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-secondary hover:bg-muted'
                    }`}
                    data-testid={`button-lang-${lang.code}`}
                  >
                    <span className="flex items-center justify-between w-full">
                      <span>{lang.label}</span>
                      <span className={`text-xs font-bold ${i18n.language === lang.code ? 'text-primary' : 'text-muted-foreground/50'}`}>{lang.short}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {publicNavItems
              .filter(item => !(user && item.path === "/login"))
              .map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`
                  flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary
                  ${isActive(item.path) ? "text-primary font-bold" : "text-muted-foreground"}
                `}
                data-testid={`link-nav-${item.path.slice(1)}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                {userNavItems.map((item) => (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`
                      flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary
                      ${isActive(item.path) ? "text-primary font-bold" : "text-muted-foreground"}
                    `}
                    data-testid={`link-nav-${item.path.slice(1)}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
                {user.isAdmin && (
                  <Link 
                    href="/admin"
                    className={`
                      flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary
                      ${isActive("/admin") ? "text-primary font-bold" : "text-muted-foreground"}
                    `}
                    data-testid="link-nav-admin"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                <div className="h-6 w-px bg-border mx-1" />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {user.displayName || user.username}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => logout()}
                    className="text-muted-foreground hover:text-destructive"
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20" data-testid="link-register">
                  {t("get_started")}
                </Button>
              </Link>
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

                  <div className="flex items-center justify-center gap-1 p-1 bg-muted/50 rounded-full">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                          i18n.language === lang.code
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-secondary'
                        }`}
                        data-testid={`button-mobile-lang-${lang.code}`}
                      >
                        {lang.short}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {publicNavItems
                      .filter(item => !(user && item.path === "/login"))
                      .map((item) => (
                      <Link 
                        key={item.path} 
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        data-testid={`link-mobile-nav-${item.path.slice(1)}`}
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
                  </div>

                  <div className="h-px bg-border my-2" />

                  {user ? (
                    <div className="flex flex-col gap-2">
                      {userNavItems.map((item) => (
                        <Link 
                          key={item.path} 
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          data-testid={`link-mobile-nav-${item.path.slice(1)}`}
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
                      {user.isAdmin && (
                        <Link 
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          data-testid="link-mobile-nav-admin"
                          className={`
                            flex items-center gap-4 p-3 rounded-lg transition-colors
                            ${isActive("/admin") 
                              ? "bg-primary/10 text-primary font-bold" 
                              : "text-muted-foreground hover:bg-muted"}
                          `}
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          Dashboard
                        </Link>
                      )}
                      <Button 
                        variant="destructive" 
                        className="mt-4 w-full"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                      >
                        {t("sign_out")}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-primary hover:bg-primary/90" data-testid="link-mobile-register">{t("get_started")}</Button>
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
