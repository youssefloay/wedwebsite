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
      {/* ── DESKTOP TOP NAV (hidden on mobile) ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 hidden md:flex justify-center py-4 px-6 ${
          isScrolled ? 'pt-4' : 'pt-6'
        }`}
      >
        <div
          className={`flex items-center justify-between w-full max-w-5xl transition-all duration-500 rounded-full px-8 py-2 ${
            isScrolled
              ? 'bg-background/80 backdrop-blur-md shadow-lg border border-border/50'
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
              className="h-20 w-auto object-contain mix-blend-multiply opacity-90"
            />
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`label-uppercase mb-0 transition-all duration-300 hover:text-accent-terracotta relative py-1 ${
                  location.pathname === link.to
                    ? 'text-primary-text font-semibold'
                    : 'text-secondary-text'
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <span className="absolute bottom-0 left-0 w-full h-px bg-accent-terracotta animate-in fade-in zoom-in-50 duration-500" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAV (visible only on mobile) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
        {/* Frosted glass pill */}
        <div
          className="mx-3 mb-3 rounded-2xl border border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl"
          style={{ boxShadow: '0 -4px 24px rgba(92,50,16,0.08)' }}
        >
          <div className="flex items-center justify-around px-2 py-2">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 group"
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${
                      active
                        ? 'bg-accent-terracotta/15'
                        : 'group-active:bg-accent-terracotta/10'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={`transition-colors duration-300 ${
                        active ? 'text-accent-terracotta' : 'text-secondary-text group-hover:text-primary-text'
                      }`}
                    />
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-[0.12em] font-medium transition-colors duration-300 ${
                      active ? 'text-accent-terracotta' : 'text-secondary-text/70'
                    }`}
                    style={{ fontFamily: 'var(--font-serif)' }}
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