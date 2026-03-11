import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { SiInstagram, SiTiktok, SiFacebook } from "react-icons/si";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary text-secondary-foreground py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <Link href="/">
              <span className="text-2xl font-display font-bold text-white cursor-pointer">ARSI</span>
            </Link>
            <p className="text-white/60 text-sm mt-2 max-w-xs mx-auto md:mx-0">
              {t("footer_tagline")}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-white/80">
            <Link href="/providers" className="hover:text-primary transition-colors">{t("nav_providers")}</Link>
            <Link href="/categories" className="hover:text-primary transition-colors">{t("nav_categories")}</Link>
            <Link href="/rules" className="hover:text-primary transition-colors">{t("nav_rules")}</Link>
            <Link href="/about" className="hover:text-primary transition-colors">{t("nav_about")}</Link>
            <Link href="/policies" className="hover:text-primary transition-colors">{t("nav_policies")}</Link>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end gap-5">
            <a 
              href="https://www.instagram.com/supportarsi01?igsh=MTg0Mjl1M3E0eTZwaw==" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Instagram"
            >
              <SiInstagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.tiktok.com/@arsisupport?_r=1&_t=ZS-94V2FvuZbxX" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="TikTok"
            >
              <SiTiktok className="w-5 h-5" />
            </a>
            <a 
              href="https://www.facebook.com/share/17vm7KTxDL/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Facebook"
            >
              <SiFacebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
             @ 2026 Arsi
          </p>
        </div>
      </div>
    </footer>
  );
}
