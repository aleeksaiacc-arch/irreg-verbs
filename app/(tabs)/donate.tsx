import { DonationCryptoCard } from "@/components/donate/donation-crypto-card";
import { DonationKaspiCard } from "@/components/donate/donation-kaspi-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getDonationCrypto,
  getKaspiDonation,
} from "@/constants/donation-config";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DonateScreen() {
  const scheme = useColorScheme() ?? "light";
  const isDark = scheme === "dark";
  const tint = Colors[scheme].tint;
  const textMuted = useThemeColor(
    { light: "#5c6b76", dark: "#9aa5ad" },
    "text",
  );
  const cardBg = isDark ? "#1c2124" : "#f4f8fb";
  const accentGlow = isDark
    ? "rgba(10, 126, 164, 0.22)"
    : "rgba(10, 126, 164, 0.12)";
  const cardBorder = isDark ? "#2e3539" : "#d8e4ea";

  const crypto = getDonationCrypto();
  const kaspi = getKaspiDonation();

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={["top"]}>
        <View style={styles.clampOuter}>
          <View style={styles.clampInner}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.heroWrap, { backgroundColor: accentGlow }]}>
                <View
                  style={[
                    styles.iconRing,
                    {
                      borderColor: isDark
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(10,126,164,0.2)",
                    },
                  ]}
                >
                  <IconSymbol name="heart.fill" size={44} color={tint} />
                </View>
                <ThemedText type="title" style={styles.heroTitle}>
                  Support Irregular Verbs
                </ThemedText>
                <ThemedText style={[styles.heroLead, { color: textMuted }]}>
                  If this app helps you learn, you can chip in to keep it
                  improving—new features, polish, and reliable sync for
                  everyone.
                </ThemedText>
              </View>

              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Why donate
                </ThemedText>
                <ThemedText style={[styles.paragraph, { color: textMuted }]}>
                  Building and maintaining a focused learning tool takes time.
                  Your support helps cover infrastructure, design, and the slow
                  work of making drills feel effortless on every device.
                </ThemedText>
                <ThemedText style={[styles.paragraph, { color: textMuted }]}>
                  There is no obligation—use the app as long as you like. A
                  donation is simply a thank-you if you want to give back.
                </ThemedText>
              </View>

              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  How to donate
                </ThemedText>
                <ThemedText
                  style={[styles.subsectionLead, { color: textMuted }]}
                >
                  Pick a method, copy the details, or scan a crypto QR in your
                  wallet.
                </ThemedText>

                <ThemedText
                  type="defaultSemiBold"
                  style={styles.subsectionTitle}
                >
                  Cryptocurrency
                </ThemedText>
                {crypto.map((item) => (
                  <DonationCryptoCard
                    key={item.id}
                    item={item}
                    isDark={isDark}
                    tint={tint}
                    mutedColor={textMuted}
                    cardBg={cardBg}
                    borderColor={cardBorder}
                  />
                ))}

                <ThemedText
                  type="defaultSemiBold"
                  style={styles.subsectionTitle}
                >
                  Kazakhstan (Kaspi Gold)
                </ThemedText>
                {kaspi ? (
                  <DonationKaspiCard
                    kaspi={kaspi}
                    isDark={isDark}
                    tint={tint}
                    mutedColor={textMuted}
                    detailsCardBg={cardBg}
                    detailsBorderColor={cardBorder}
                  />
                ) : (
                  <ThemedText style={[styles.emptyHint, { color: textMuted }]}>
                    Add at least one of: EXPO_PUBLIC_DONATION_KASPI_CARD,
                    EXPO_PUBLIC_DONATION_KASPI_HOLDER,
                    EXPO_PUBLIC_DONATION_KASPI_PHONE,
                    EXPO_PUBLIC_DONATION_KASPI_EXPIRY.
                  </ThemedText>
                )}
              </View>

              <View style={{ height: 32 }} />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const PAGE_MAX_WIDTH = 1024;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  clampOuter: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  clampInner: {
    flex: 1,
    width: "100%",
    maxWidth: PAGE_MAX_WIDTH,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 24,
  },
  heroWrap: {
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 22,
    marginBottom: 28,
    alignItems: "center",
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  heroTitle: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
  },
  heroLead: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 340,
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "600",
  },
  subsectionLead: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  subsectionTitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  emptyHint: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: "italic",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 14,
  },
});
