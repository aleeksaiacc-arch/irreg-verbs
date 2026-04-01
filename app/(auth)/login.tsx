import { signInWithEmail, signInWithGoogle } from "@/lib/supabase-auth";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const bg = isDark ? "#151718" : "#ffffff";
  const cardBg = isDark ? "#1e2022" : "#f8f9fa";
  const textColor = isDark ? "#e0e0e0" : "#1a1a1a";
  const mutedColor = isDark ? "#888" : "#666";
  const inputBg = isDark ? "#2a2d30" : "#ffffff";
  const inputBorder = isDark ? "#3a3d40" : "#dde1e5";
  const accent = "#0a7ea4";

  async function handleLogin() {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
    } catch (e: any) {
      setError(e.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e.message ?? "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bg }]}
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.title, { color: textColor }]}>Welcome!</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Sign in to save your progress (it's still free)
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                color: textColor,
              },
            ]}
            placeholder="Email"
            placeholderTextColor={mutedColor}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                color: textColor,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={mutedColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
          />

          <Pressable
            style={[
              styles.button,
              { backgroundColor: accent, opacity: loading ? 0.7 : 1 },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View
              style={[styles.dividerLine, { backgroundColor: inputBorder }]}
            />
            <Text style={[styles.dividerText, { color: mutedColor }]}>or</Text>
            <View
              style={[styles.dividerLine, { backgroundColor: inputBorder }]}
            />
          </View>

          <Pressable
            style={[styles.googleButton, { borderColor: inputBorder }]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text style={[styles.googleButtonText, { color: textColor }]}>
              Continue with Google
            </Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={{ color: mutedColor }}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <Text style={{ color: accent, fontWeight: "600" }}>
                  Sign Up
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
  },
  error: {
    color: "#e53935",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  button: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
  },
  googleButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
});
