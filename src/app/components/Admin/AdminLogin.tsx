import React, { useState } from "react";
import { useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { Heart, Lock, Mail } from "lucide-react";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center px-6 font-serif">
      <div className="max-w-md w-full space-y-12 bg-white p-12 md:p-16 border border-accent-terracotta/10 shadow-[0_20px_50px_rgba(92,50,16,0.06)] rounded-[40px]">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-accent-terracotta/10 rounded-full flex items-center justify-center mx-auto">
            <Heart className="text-accent-terracotta" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-serif italic text-primary-text">Admin Access</h1>
            <p className="text-[10px] label-uppercase tracking-widest text-accent-terracotta mt-3 font-bold">Lama & Álvaro Wedding</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-terracotta/30" size={18} />
                <input
                  type="email"
                  required
                  placeholder="admin@email.com"
                  className="w-full bg-black/5 border-none p-4 pl-12 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 transition-all text-primary-text font-serif italic"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-terracotta/30" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/5 border-none p-4 pl-12 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 transition-all text-primary-text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-center text-red-500 text-sm italic font-serif bg-red-50 py-2 rounded-xl border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary shadow-lg flex items-center justify-center p-4 h-auto group active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="label-uppercase text-[10px] tracking-[0.3em]">Authenticating...</span>
            ) : (
              <span className="text-sm uppercase tracking-[0.2em] font-serif">Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center">
            <button 
                onClick={() => navigate("/")}
                className="text-[10px] uppercase tracking-[0.3em] text-secondary-text hover:text-accent-terracotta transition-colors"
            >
                Back to Website
            </button>
        </div>
      </div>
    </div>
  );
};
