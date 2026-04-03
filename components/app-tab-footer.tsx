import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Haptics from "expo-haptics";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BAR_HEIGHT = 49;

export function AppTabFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const scheme = colorScheme ?? "light";
  const theme = Colors[scheme];

  const homeActive =
    pathname === "/" || pathname === "" || pathname === "/index";
  const donateActive = pathname.startsWith("/donate");

  const borderTop = scheme === "dark" ? "#2a2d30" : "#e8e8e8";
  const barBg = scheme === "dark" ? "#151718" : "#ffffff";
  const tabHoverBg =
    scheme === "dark" ? "rgba(255, 255, 255, 0.10)" : "#f0f0f0";

  const [hoveredTab, setHoveredTab] = useState<
    "home" | "donate" | "message" | null
  >(null);

  const onPressIn = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const openDeveloperMail = () => {
    void Linking.openURL("mailto:aleexpost@gmail.com");
  };

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: barBg,
          borderTopColor: borderTop,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Message the developers"
        onHoverIn={() => setHoveredTab("message")}
        onHoverOut={() => setHoveredTab(null)}
        onPressIn={onPressIn}
        onPress={openDeveloperMail}
        style={[
          styles.tab,
          hoveredTab === "message" && { backgroundColor: tabHoverBg },
        ]}
      >
        <IconSymbol
          size={28}
          name="envelope.fill"
          color={theme.tabIconDefault}
        />
        <Text
          style={[styles.label, { color: theme.tabIconDefault }]}
          numberOfLines={2}
        >
          Message the developers
        </Text>
      </Pressable>{" "}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: homeActive }}
        onHoverIn={() => setHoveredTab("home")}
        onHoverOut={() => setHoveredTab(null)}
        onPressIn={onPressIn}
        onPress={() => router.push("/")}
        style={[
          styles.tab,
          hoveredTab === "home" && { backgroundColor: tabHoverBg },
        ]}
      >
        <IconSymbol
          size={28}
          name="house.fill"
          color={homeActive ? theme.tabIconSelected : theme.tabIconDefault}
        />
        <Text
          style={[
            styles.label,
            {
              color: homeActive ? theme.tabIconSelected : theme.tabIconDefault,
            },
          ]}
        >
          Home
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: donateActive }}
        onHoverIn={() => setHoveredTab("donate")}
        onHoverOut={() => setHoveredTab(null)}
        onPressIn={onPressIn}
        onPress={() => router.push("/donate")}
        style={[
          styles.tab,
          hoveredTab === "donate" && { backgroundColor: tabHoverBg },
        ]}
      >
        <IconSymbol
          size={28}
          name="heart.fill"
          color={donateActive ? theme.tabIconSelected : theme.tabIconDefault}
        />
        <Text
          style={[
            styles.label,
            {
              color: donateActive
                ? theme.tabIconSelected
                : theme.tabIconDefault,
            },
          ]}
        >
          Donate
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    minHeight: BAR_HEIGHT,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 4,
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
  },
});
