"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
  loginWithProvider: (provider: "github" | "google") => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const register = async (email: string, password: string) => {
    const auth_callback_url =
      `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL}/auth/callback` ||
      `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: auth_callback_url,
      },
    });

    return { error };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) redirect("/auth");
    return { error };
  };

  const loginWithProvider = async (provider: "github" | "google") => {
    const auth_callback_url =
      `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL}/auth/callback` ||
      `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: auth_callback_url,
      },
    });

    return { error };
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, loginWithProvider }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
