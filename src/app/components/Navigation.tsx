import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Home, Plane, Building2, Gift, Heart } from 'lucide-react';

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
         {/* The Unified Navbar Container */}
        <div className="flex justify-center w-full max-w-[500px] md:max-w-[700px] pointer-events-auto">
          <div className="flex items-center justify-around w-full h-16 md:h-20 rounded-2xl md:rounded-full border border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl px-2 md:px-8">
            {navLinks.map(({ to, label, icon: Icon }) => {
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
                      active ? 'text-accent-terracotta scale-110' : 'text-secondary-text group-hover:text-primary-text'
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
                  {active && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-terracotta animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
