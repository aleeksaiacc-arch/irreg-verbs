import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Haptics from "expo-haptics";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
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

  const onPressIn = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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
        accessibilityState={{ selected: homeActive }}
        onPressIn={onPressIn}
        onPress={() => router.push("/")}
        style={styles.tab}
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
      {/* <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: donateActive }}
        onPressIn={onPressIn}
        onPress={() => router.push("/donate")}
        style={styles.tab}
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
      </Pressable> */}
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
