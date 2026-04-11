import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Home, Plane, Building2, Gift, Heart, Compass, Info } from 'lucide-react';

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
    { to: '/faq',           label: 'FAQ',    icon: Info },
    { to: '/rsvp',          label: 'RSVP',    icon: Heart },
  ];

  return (
    <>
      {/* ── UNIFIED BOTTOM NAV (Always visible) ── */}
      <nav className="fixed bottom-4 md:bottom-8 inset-x-0 z-[100] flex justify-center px-4 pointer-events-none">
         {/* The Unified Navbar Container (Pill) */}
        <div className="flex-shrink-0 w-full max-w-[640px] md:max-w-[920px] pointer-events-auto">
          <div className="relative flex items-center justify-center gap-1 md:gap-4 h-16 md:h-18 rounded-2xl md:rounded-full border border-primary-text/10 bg-background/70 backdrop-blur-2xl shadow-[0_12px_44px_rgba(44,24,16,0.12)] px-2 md:px-6 transition-all duration-500 overflow-hidden">
            {/* ANDALUSIAN WATERMARK STAMP */}
            <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '240px' }} />
            
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to.split('?')[0];
              return (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-center gap-1.5 px-2.5 md:px-4 py-2 rounded-2xl transition-all duration-500 group relative flex-shrink-0 z-10"
                >
                  {/* HORSESHOE ARCH INDICATOR */}
                  {active && (
                    <div className="absolute inset-x-1 -top-1 bottom-1 bg-accent-terracotta/5 rounded-t-full border-t border-x border-accent-terracotta/20 animate-in fade-in slide-in-from-bottom-2 duration-700">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-terracotta" />
                    </div>
                  )}

                  <Icon
                    size={active ? 18 : 16}
                    className={`transition-all duration-500 ${active ? 'text-accent-terracotta scale-110' : 'text-accent-beige group-hover:text-primary-text'}`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className={`text-[10px] md:text-[11px] font-bold tracking-[0.25em] transition-all duration-500 ${active ? 'text-primary-text scale-105' : 'text-accent-beige opacity-60 group-hover:opacity-100'}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
