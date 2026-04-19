import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { Heart } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F4]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Heart className="text-accent-terracotta/20 animate-bounce" size={48} />
          <p className="label-uppercase text-[10px] tracking-widest text-accent-terracotta">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
