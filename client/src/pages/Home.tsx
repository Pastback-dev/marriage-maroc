import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Star, Sparkles, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        {/* Moroccan Pattern Overlay */}
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-multiply pointer-events-none" />
        
        {/* Dark wash gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Your Dream <span className="text-primary">Moroccan Wedding</span> Awaits
              </h1>
              <p className="text-xl text-gray-200 mb-8 font-light">
                Plan your perfect "Arsi" with our AI-powered planner. From Neggafas to Traiteurs, discover the best providers in Morocco.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                    Start Planning Free <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/providers">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold backdrop-blur-sm">
                    Browse Providers
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Image - Right Side */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 z-0 hidden lg:block">
          {/* Traditional Moroccan Wedding Details */}
          <img 
            src="https://pixabay.com/get/gebcac335e42574a15f30055926cd3ae82ddb12a74962a67605350ae79336b8f9b5613bbbc0fca64fbdca4db85fa12fdc0f47b81ca5ed668b24ed7984111c67ba_1280.jpg" 
            alt="Moroccan Wedding Decor" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4">Why Choose Arsi?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We combine traditional Moroccan elegance with modern planning tools to make your special day effortless.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Planning",
                desc: "Tell us your budget and style, and we'll generate the perfect vendor package instantly."
              },
              {
                icon: Star,
                title: "Curated Providers",
                desc: "Every Neggafa, Traiteur, and Hall is vetted for quality and authenticity."
              },
              {
                icon: HeartHandshake,
                title: "Budget Management",
                desc: "Track every Dirham. Manage guest lists and payments in one dashboard."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-8 rounded-2xl border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-2xl font-display font-bold">ARSI</span>
            <p className="text-white/60 text-sm mt-2">Making Moroccan weddings unforgettable.</p>
          </div>
          <div className="flex gap-8 text-sm text-white/80">
            <Link href="/providers" className="hover:text-primary transition-colors">Providers</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link href="/register" className="hover:text-primary transition-colors">Register</Link>
          </div>
          <p className="text-white/40 text-xs">© 2024 Arsi Wedding Planner</p>
        </div>
      </footer>
    </div>
  );
}
