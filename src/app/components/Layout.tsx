import { Outlet, Link, useLocation } from "react-router";
import { ScrollToTop } from "./ScrollToTop";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navigation } from "./Navigation";

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    // 1. Setup the observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    // 2. Function to scan and observe elements
    const scanAndObserve = () => {
      const elements = document.querySelectorAll('.reveal, .reveal-scale');
      elements.forEach(el => observer.observe(el));
      
      // If we are on mobile or some elements are already in view, trigger them immediately
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('active');
        }
      });
    };

    // 3. Initial scan + delayed scan to catch dynamic mounting
    scanAndObserve();
    const timer = setTimeout(scanAndObserve, 300);
    const fallbackTimer = setTimeout(() => {
       // Fallback: Just reveal everything if it's still hidden after 1.5s
       document.querySelectorAll('.reveal, .reveal-scale').forEach(el => el.classList.add('active'));
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [location.pathname]);

  return (
    <>
      <Navigation />
      
      {/* Global Header Logo - Only shown on sub-pages */}
      {!isHome && (
        <header className="flex justify-center pt-10 pb-6 z-50 relative pointer-events-none">
          <Link to="/?entered=true" className="reveal-scale active pointer-events-auto transition-all duration-700 hover:scale-105">
            <img 
              src="/logo_cursive.png" 
              alt="Lama & Álvaro" 
              className="w-24 md:w-32 h-auto object-contain mix-blend-multiply opacity-90 transition-opacity duration-700 hover:opacity-100"
            />
          </Link>
        </header>
      )}

      <main className="min-h-screen relative">
        <ScrollToTop />
        <Outlet />
      </main>
    </>
  );
}
