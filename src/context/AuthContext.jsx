import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, hasSupabaseConfig } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(currentUser) {
    if (!currentUser || !hasSupabaseConfig) {
      setProfile(null);
      return;
    }
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();
      setProfile(data || { id: currentUser.id, country: "EG", plan: null });
    } catch {
      // جدول profiles ممكن يكون لسه متعمل: منكسرش التطبيق، نستخدم قيم افتراضية.
      setProfile({ id: currentUser.id, country: "EG", plan: null });
    }
  }

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const current = data.session?.user || null;
      setUser(current);
      loadProfile(current).finally(() => setLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const current = session?.user || null;
        setUser(current);
        loadProfile(current);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth لازم يتستخدم جوه AuthProvider");
  return ctx;
}
