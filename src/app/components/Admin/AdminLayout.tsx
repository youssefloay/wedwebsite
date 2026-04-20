import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronRight,
  MessageSquare,
  Utensils,
  Bed,
  Car,
  Music,
  ClipboardList
} from "lucide-react";
import { auth } from "../../../lib/firebase";
import { signOut } from "firebase/auth";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: <BarChart3 size={20} /> },
    { label: "Guest List", path: "/admin/guests", icon: <Users size={20} /> },
    { label: "Dietaries", path: "/admin/dietaries", icon: <Utensils size={20} /> },
    { label: "Accommodation", path: "/admin/accommodation", icon: <Bed size={20} /> },
    { label: "Travel & Visas", path: "/admin/travel", icon: <ClipboardList size={20} /> },
    { label: "Music", path: "/admin/music", icon: <Music size={20} /> },
    { label: "Notes", path: "/admin/notes", icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#FBF9F4] text-primary-text font-serif">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-accent-terracotta/10 flex flex-col shadow-sm">
        <div className="p-8 border-b border-accent-terracotta/10">
          <h1 className="text-3xl font-serif italic text-accent-terracotta">Admin Portal</h1>
          <p className="text-xs label-uppercase tracking-[0.2em] opacity-70 mt-3">Lama & Álvaro</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-accent-terracotta/5 text-accent-terracotta shadow-sm" 
                    : "text-secondary-text hover:bg-black/5 hover:text-primary-text"
                }`}
              >
                {item.icon}
                <span className="text-base font-medium">{item.label}</span>
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-accent-terracotta/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-secondary-text hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="text-base font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#FBF9F4]/50">
        <header className="h-16 bg-white border-b border-accent-terracotta/10 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base text-secondary-text">Pages</span>
            <ChevronRight size={16} className="text-secondary-text/40" />
            <span className="text-base font-medium text-primary-text">
              {navItems.find(i => i.path === location.pathname)?.label || "Page"}
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-accent-terracotta/10 flex items-center justify-center">
                <Settings size={16} className="text-accent-terracotta" />
             </div>
          </div>
        </header>
        
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
