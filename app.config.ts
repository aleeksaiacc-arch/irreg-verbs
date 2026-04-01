import type { ExpoConfig } from "expo/config";

function iosUrlSchemeFromEnv(): string | undefined {
  const raw = (process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "").trim();
  if (!raw) return undefined;
  if (raw.startsWith("com.googleusercontent.apps.")) return raw;
  const marker = ".apps.googleusercontent.com";
  if (raw.includes(marker)) {
    return `com.googleusercontent.apps.${raw.split(marker)[0]}`;
  }
  return undefined;
}

const iosUrlScheme = iosUrlSchemeFromEnv();

const config: ExpoConfig = {
  name: "Irregular verbs",
  slug: "my-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    ...(iosUrlScheme
      ? ([
          [
            "@react-native-google-signin/google-signin",
            { iosUrlScheme },
          ] as const,
        ] as const)
      : []),
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default { expo: config };
