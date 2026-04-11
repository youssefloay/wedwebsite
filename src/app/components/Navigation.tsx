import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Home, Plane, Building2, Gift, Heart, Compass } from 'lucide-react';

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
    { to: '/?entered=true', label: 'Home',    icon: Home },
    { to: '/travel',        label: 'Travel',  icon: Plane },
    { to: '/accommodation', label: 'Stay',    icon: Building2 },
    { to: '/discovery',     label: 'Journal', icon: Compass },
    { to: '/gifts',         label: 'Gifts',   icon: Gift },
    { to: '/rsvp',          label: 'RSVP',    icon: Heart },
  ];

  return (
    <>
      {/* ── UNIFIED BOTTOM NAV (Always visible) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-4 md:pb-8 px-4 pointer-events-none">
         {/* The Unified Navbar Container */}
        <div className="flex justify-center w-full max-w-[480px] md:max-w-[640px] pointer-events-auto">
          <div className="flex items-center justify-around w-full h-16 md:h-18 rounded-2xl md:rounded-full border border-primary-text/5 bg-background/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(92,50,16,0.08)] px-2 md:px-6 transition-all duration-500">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to.split('?')[0];
              return (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-center gap-1.5 px-3 md:px-5 py-2 rounded-2xl transition-all duration-500 group relative"
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    className={`transition-all duration-700 ${
                      active ? 'text-accent-terracotta scale-110' : 'text-accent-beige group-hover:text-primary-text group-hover:scale-110'
                    }`}
                  />
                  <span
                    className={`text-[7px] md:text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${
                      active ? 'text-accent-terracotta opacity-100' : 'text-accent-beige/60 group-hover:text-primary-text group-hover:opacity-100'
                    }`}
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    {label}
                  </span>
                  {active && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-terracotta shadow-[0_0_8px_rgba(181,117,72,0.6)] animate-pulse" />
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
