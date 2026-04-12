import { Outlet, Link, useLocation } from "react-router";
import { ScrollToTop } from "./ScrollToTop";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navigation } from "./Navigation";

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="overflow-clip min-h-screen flex flex-col relative bg-background">
      <Navigation />

      {/* Global Header Logo - Only shown on sub-pages */}
      {!isHome && (
        <header className="flex justify-center pt-10 pb-6 z-50 relative pointer-events-none">
          <Link to="/?force=true" className="active pointer-events-auto transition-all duration-700 hover:scale-105">
            <img 
              src="/logo_cursive.png" 
              alt="Lama & Álvaro" 
              className="w-24 md:w-32 h-auto object-contain mix-blend-multiply opacity-90 transition-opacity duration-700 hover:opacity-100"
            />
          </Link>
        </header>
      )}

      <main className="flex-grow min-h-screen relative pb-12">
        <ScrollToTop />
        <Outlet />
      </main>

      {/* ── UNIFIED GLOBAL FOOTER ── */}
      <footer className="w-full pt-10 pb-32 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
        <div className="w-16 h-[1px] bg-accent-terracotta mb-10" />
        
        <div className="mb-6">
          <img 
            src="/logo_cursive.png" 
            alt="L&A Logo" 
            className="w-24 md:w-32 h-auto mx-auto grayscale opacity-80"
          />
        </div>

        <div className="space-y-4">
          <p className="font-cinzel text-[9px] md:text-[11px] tracking-[0.4em] text-primary-text uppercase">
            Granada • Spain • 2027
          </p>
          <p className="font-serif italic text-xs md:text-sm text-secondary-text">
            Con todo nuestro amor
          </p>
        </div>

        {/* Subtle Decorative Arch */}
        <div className="mt-12 opacity-10">
          <svg width="40" height="60" viewBox="0 0 100 120" className="fill-accent-terracotta">
            <path d="M50 0 C22.38 0 0 22.38 0 50 C0 65 5 78 15 88 L15 120 L85 120 L85 88 C95 78 100 65 100 50 C100 22.38 77.62 0 50 0 Z" />
          </svg>
        </div>
      </footer>
    </div>
  );
}
