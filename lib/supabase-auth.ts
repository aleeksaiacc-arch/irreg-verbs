import { Platform } from "react-native";
import { supabase } from "./supabase";
import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";
import { makeRedirectUri } from "expo-auth-session";

if (Platform.OS !== "web") {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  if (Platform.OS === "web") {
    const redirectTo = makeRedirectUri();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw error;
    return data;
  }

  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();

  if (!response.data?.idToken) {
    throw new Error("Google Sign-In failed: no ID token returned");
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.data.idToken,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
