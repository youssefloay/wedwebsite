import { Outlet, Link, useLocation } from "react-router";
import { ScrollToTop } from "./ScrollToTop";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@/assets/logo_cursive.png";

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal, .reveal-scale');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <>
      
      {/* Global Header Logo - Only shown on sub-pages */}
      {!isHome && (
        <header className="flex justify-center pt-10 pb-6 z-50 relative pointer-events-none">
          <Link to="/?entered=true" className="reveal-scale active pointer-events-auto transition-all duration-700 hover:scale-105">
            <img 
              src={logoImage} 
              alt="Lama & Álvaro" 
              className="w-24 md:w-32 h-auto object-contain mix-blend-multiply opacity-90 transition-opacity duration-700 hover:opacity-100"
            />
          </Link>
        </header>
      )}

      <main className="min-h-screen relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="w-full"
          >
            <ScrollToTop />
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
