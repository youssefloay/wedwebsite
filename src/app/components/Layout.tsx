import { Outlet, Link, useLocation } from "react-router";
import { ScrollToTop } from "./ScrollToTop";
import logoImage from "@/assets/logo_cursive.png";

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <ScrollToTop />
      
      {/* Global Header Logo - Only shown on sub-pages */}
      {!isHome && (
        <header className="flex justify-center pt-8 pb-4 z-50 relative pointer-events-none">
          <Link to="/?entered=true" className="pointer-events-auto transition-transform duration-500 hover:scale-105">
            <img 
              src={logoImage} 
              alt="Lama & Álvaro" 
              className="w-20 md:w-28 h-auto object-contain mix-blend-multiply opacity-90"
            />
          </Link>
        </header>
      )}

      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
}
