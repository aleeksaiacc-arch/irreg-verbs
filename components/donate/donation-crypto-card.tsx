import { DonationCopyRow } from "@/components/donate/donation-copy-row";
import { ThemedText } from "@/components/themed-text";
import type { DonationCrypto } from "@/constants/donation-config";
import { StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

type Props = {
  item: DonationCrypto;
  isDark: boolean;
  tint: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
};

const QR_SIZE = 168;

export function DonationCryptoCard({
  item,
  isDark,
  tint,
  mutedColor,
  cardBg,
  borderColor,
}: Props) {
  const hasAddress = item.address.length > 0;

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.cardHeader}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          {item.label}
        </ThemedText>
        <View style={[styles.badge, { backgroundColor: isDark ? "#2a3238" : "#e8f4f8" }]}>
          <ThemedText style={[styles.badgeText, { color: tint }]} numberOfLines={1}>
            {item.network}
          </ThemedText>
        </View>
      </View>
      <ThemedText style={[styles.warning, { color: mutedColor }]}>{item.warning}</ThemedText>
      {hasAddress ? (
        <>
          <View style={styles.qrWrap}>
            <View style={styles.qrInner}>
              <QRCode
                value={item.address}
                size={QR_SIZE}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            </View>
          </View>
          <DonationCopyRow
            label="Address"
            value={item.address}
            isDark={isDark}
            tint={tint}
            mutedColor={mutedColor}
            showBottomBorder={false}
          />
        </>
      ) : (
        <ThemedText style={[styles.placeholder, { color: mutedColor }]}>
          Set EXPO_PUBLIC_DONATION_{item.id === "btc" ? "BTC" : "ETH"}_ADDRESS in your environment
          to show a QR code and enable copy.
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 17,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: "48%",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  warning: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  qrWrap: {
    alignItems: "center",
    marginBottom: 16,
  },
  qrInner: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  placeholder: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
    fontStyle: "italic",
  },
});
