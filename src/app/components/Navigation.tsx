import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Home, Plane, Building2, Gift, Heart } from 'lucide-react';
import logoImage from "../../assets/logo_cursive.png";

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
    { to: '/',              label: 'Home',   icon: Home },
    { to: '/travel',        label: 'Travel', icon: Plane },
    { to: '/accommodation', label: 'Stay',   icon: Building2 },
    { to: '/gifts',         label: 'Gifts',  icon: Gift },
    { to: '/rsvp',          label: 'RSVP',   icon: Heart },
  ];

  return (
    <>
      {/* ── TOP BRANDING (LOGO ONLY) ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 flex justify-center py-4 px-6 ${
          isScrolled ? 'pt-2 md:pt-4' : 'pt-4 md:pt-6'
        }`}
      >
        <div
          className={`flex items-center justify-center transition-all duration-500 rounded-full px-6 py-1 ${
            isScrolled
              ? 'bg-background/40 backdrop-blur-md shadow-sm border border-border/30'
              : 'bg-transparent'
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="transition-transform duration-300 hover:scale-105 flex items-center"
          >
            <img
              src={logoImage}
              alt="Lama & Álvaro"
              className={`transition-all duration-700 object-contain mix-blend-multiply opacity-90 ${
                isScrolled ? 'h-16 md:h-24' : 'h-28 md:h-48'
              }`}
            />
          </Link>
        </div>
      </nav>

      {/* ── UNIFIED BOTTOM NAV (Always visible, centered on PC) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-4 md:pb-8 px-4 pointer-events-none">
        {/* Frosted glass pill */}
        <div
          className="w-full max-w-[400px] md:max-w-[500px] rounded-2xl md:rounded-3xl border border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl pointer-events-auto transition-all duration-500 hover:shadow-accent-terracotta/10"
          style={{ boxShadow: '0 -4px 30px rgba(92,50,16,0.1)' }}
        >
          <div className="flex items-center justify-around px-4 py-2 md:py-3">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-300 group relative"
                >
                  <span
                    className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl transition-all duration-500 ${
                      active
                        ? 'bg-accent-terracotta/15'
                        : 'group-hover:bg-accent-terracotta/5 group-active:bg-accent-terracotta/10'
                    }`}
                  >
                    <Icon
                      size={active ? 22 : 20}
                      className={`transition-all duration-500 ${
                        active ? 'text-accent-terracotta scale-110' : 'text-secondary-text group-hover:text-primary-text'
                      }`}
                    />
                  </span>
                  
                  <span
                    className={`text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-semibold transition-all duration-300 ${
                      active ? 'text-accent-terracotta' : 'text-secondary-text/70 group-hover:text-primary-text'
                    }`}
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {label}
                  </span>

                  {/* Active Indicator Dot */}
                  {active && (
                    <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-accent-terracotta animate-pulse" />
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