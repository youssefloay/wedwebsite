import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Home, Plane, Building2, Gift, Heart } from 'lucide-react';
import logoImage from "@/assets/logo_cursive.png";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/?entered=true', label: 'Home',   icon: Home },
    { to: '/travel',        label: 'Travel', icon: Plane },
    { to: '/accommodation', label: 'Stay',   icon: Building2 },
    { to: '/gifts',         label: 'Gifts',  icon: Gift },
    { to: '/rsvp',          label: 'RSVP',   icon: Heart },
  ];

  return (
    <>
      {/* ── UNIFIED BOTTOM NAV (Always visible) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-4 md:pb-8 px-4 pointer-events-none">
        
        {/* The "Molded" Navbar Container */}
        <div className="flex items-end justify-center w-full max-w-[500px] md:max-w-[800px] pointer-events-auto h-24 md:h-36">
          
          <div className="relative flex items-center justify-center w-full h-16 md:h-20">
            
            {/* LEFT PIECE */}
            <div className="flex items-center justify-around flex-1 h-full rounded-l-2xl md:rounded-l-full border-t border-b border-l border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl pl-3 md:pl-10 pr-4 md:pr-12">
              {navLinks.slice(0, 2).map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to.split('?')[0];
                return (
                  <Link
                    key={to}
                    to={to}
                    className="flex flex-col items-center gap-1 px-2 md:px-4 py-1 rounded-2xl transition-all duration-300 group relative"
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.25}
                      className={`transition-all duration-500 ${
                        active ? 'text-accent-terracotta' : 'text-secondary-text group-hover:text-primary-text'
                      }`}
                    />
                    <span
                      className={`text-[8px] md:text-[10px] uppercase tracking-[0.12em] font-semibold transition-all duration-300 ${
                        active ? 'text-accent-terracotta' : 'text-secondary-text/70 group-hover:text-primary-text'
                      }`}
                      style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                      {label}
                    </span>
                    {active && <span className="absolute -top-1 w-1 h-1 rounded-full bg-accent-terracotta animate-pulse" />}
                  </Link>
                );
              })}
            </div>

            {/* THE CENTRAL BUMP (The Bridge) */}
            <div className="relative flex-shrink-0 w-20 md:w-32 h-full">
              <Link
                to="/"
                className="absolute left-1/2 bottom-0 -translate-x-1/2 w-20 h-24 md:w-32 md:h-36 rounded-t-full border-t border-l border-r border-border/40 bg-background/80 backdrop-blur-xl flex items-center justify-center transition-all duration-500 hover:scale-105 group"
                style={{ 
                  boxShadow: '0 -15px 30px rgba(92,50,16,0.08)',
                }}
              >
                {/* Internal bottom border mask to complete the bar line if needed */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border/40" />
                
                <img
                  src={logoImage}
                  alt="Lama & Álvaro"
                  className="w-12 md:w-20 h-auto object-contain mix-blend-multiply opacity-90 transition-transform duration-500 group-hover:rotate-2 pb-8 md:pb-16"
                />
              </Link>
            </div>

            {/* RIGHT PIECE */}
            <div className="flex items-center justify-around flex-1 h-full rounded-r-2xl md:rounded-r-full border-t border-b border-r border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl pr-3 md:pr-10 pl-4 md:pl-12">
              {navLinks.slice(2).map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to.split('?')[0];
                return (
                  <Link
                    key={to}
                    to={to}
                    className="flex flex-col items-center gap-1 px-2 md:px-4 py-1 rounded-2xl transition-all duration-300 group relative"
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.25}
                      className={`transition-all duration-500 ${
                        active ? 'text-accent-terracotta' : 'text-secondary-text group-hover:text-primary-text'
                      }`}
                    />
                    <span
                      className={`text-[8px] md:text-[10px] uppercase tracking-[0.12em] font-semibold transition-all duration-300 ${
                        active ? 'text-accent-terracotta' : 'text-secondary-text/70 group-hover:text-primary-text'
                      }`}
                      style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                      {label}
                    </span>
                    {active && <span className="absolute -top-1 w-1 h-1 rounded-full bg-accent-terracotta animate-pulse" />}
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}
