import { Outlet, Link, useLocation } from "react-router";
import { ScrollToTop } from "./ScrollToTop";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navigation } from "./Navigation";

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
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

      <main className="min-h-screen relative pb-48">
        <ScrollToTop />
        <Outlet />
      </main>
    </>
  );
}
