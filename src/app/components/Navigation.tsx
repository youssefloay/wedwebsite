import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Home, Plane, Building2, Gift, Heart, Compass, Info } from 'lucide-react';

export function Navigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let lastY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array is much more stable

  const navLinks = [
    { to: '/?skip=true',   label: 'Home',    icon: Home },
    { to: 'travel',        label: 'Travel',  icon: Plane },
    { to: 'accommodation', label: 'Stay',    icon: Building2 },
    { to: 'discovery',     label: 'Tips',    icon: Compass },
    { to: 'gifts',         label: 'Gifts',   icon: Gift },
    { to: 'rsvp',          label: 'RSVP',    icon: Heart },
    { to: 'faq',           label: 'FAQ',     icon: Info },
  ];

  return (
    <>
      {/* ── UNIFIED BOTTOM NAV ── */}
      <nav 
        className={`fixed bottom-4 md:bottom-8 inset-x-0 z-[100] flex justify-center px-4 pointer-events-none transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
      >
         {/* The Unified Navbar Container (Pill) */}
         <div className="flex-shrink-0 w-fit pointer-events-auto mx-auto">
            <div className="relative flex items-center justify-center gap-1 md:gap-4 h-16 md:h-18 rounded-2xl md:rounded-full border border-primary-text/10 bg-background/70 backdrop-blur-2xl shadow-[0_12px_40px_rgba(44,24,16,0.12)] px-4 md:px-8 transition-all duration-500 overflow-x-auto no-scrollbar isolate">
            
            {/* ANDALUSIAN TILE WATERMARK (Subtle) */}
            <div 
              className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-multiply" 
              style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '180px' }} 
            />

            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to.split('?')[0];
              return (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-center gap-1.5 px-2.5 md:px-4 py-2 rounded-2xl transition-all duration-500 group relative flex-shrink-0 z-10"
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    className={`transition-all duration-700 ${
                      active ? 'text-accent-terracotta scale-110 translate-y-[-2px]' : 'text-accent-beige group-hover:text-primary-text group-hover:scale-110'
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
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
