import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const isWebSSR =
  Platform.OS === "web" && typeof window === "undefined";

const ssrSafeStorage = {
  getItem: (key: string) => (isWebSSR ? null : AsyncStorage.getItem(key)),
  setItem: (key: string, value: string) =>
    isWebSSR ? undefined : AsyncStorage.setItem(key, value),
  removeItem: (key: string) =>
    isWebSSR ? undefined : AsyncStorage.removeItem(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ssrSafeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
  },
});
