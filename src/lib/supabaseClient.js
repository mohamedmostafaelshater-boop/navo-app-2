import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseConfig) {
  // eslint-disable-next-line no-console
  console.warn(
    "بيانات Supabase مش متظبطة. تأكد إنك عامل متغيرات البيئة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
