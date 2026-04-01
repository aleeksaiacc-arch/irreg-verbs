import { DonationCopyRow } from "@/components/donate/donation-copy-row";
import { ThemedText } from "@/components/themed-text";
import {
  formatCardNumberGroups,
  type KaspiDonationDetails,
} from "@/constants/donation-config";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  kaspi: KaspiDonationDetails;
  isDark: boolean;
  tint: string;
  mutedColor: string;
  detailsCardBg: string;
  detailsBorderColor: string;
};

const CARD_RED = "#b30f14";
const CARD_RED_DEEP = "#7a0a0e";
const CHIP_GOLD = "#c9a962";
const CARD_TEXT = "#ffffff";

const CARD_MAX_WIDTH = 340;

export function DonationKaspiCard({
  kaspi,
  isDark,
  tint,
  mutedColor,
  detailsCardBg,
  detailsBorderColor,
}: Props) {
  const displayNumber = formatCardNumberGroups(kaspi.cardNumber);
  const numberForShow =
    displayNumber ||
    "••••  ••••  ••••  ••••";
  const holderShow = (kaspi.cardHolder || "CARDHOLDER NAME").toUpperCase();
  const expiryShow = kaspi.expiry || "••/••";

  return (
    <View style={styles.wrap}>
      <View style={styles.cardOuter}>
        <View style={[styles.cardFace, { backgroundColor: CARD_RED }]}>
          <View style={[styles.cardShine, { backgroundColor: CARD_RED_DEEP }]} />
          <View style={styles.cardTop}>
            <View style={[styles.chip, { backgroundColor: CHIP_GOLD }]} />
            <View style={styles.brandBlock}>
              <Text style={styles.brandKaspi}>Kaspi</Text>
              <Text style={styles.brandGold}>Gold</Text>
            </View>
          </View>
          <View style={styles.cardMiddle} />
          <Text style={styles.pan} numberOfLines={1} adjustsFontSizeToFit>
            {numberForShow}
          </Text>
          <View style={styles.cardBottom}>
            <View style={styles.holderBlock}>
              <Text style={styles.metaLabel}>CARDHOLDER</Text>
              <Text style={styles.holderName} numberOfLines={1}>
                {holderShow}
              </Text>
            </View>
            <View style={styles.expiryBlock}>
              <Text style={styles.metaLabel}>VALID THRU</Text>
              <Text style={styles.expiryValue}>{expiryShow}</Text>
            </View>
          </View>
        </View>
      </View>

      <ThemedText style={[styles.hint, { color: mutedColor }]}>
        Transfer from the Kaspi app using this card number or Kaspi Gold phone. Copy the
        fields below if you need them in another app.
      </ThemedText>

      <View
        style={[
          styles.detailsCard,
          { backgroundColor: detailsCardBg, borderColor: detailsBorderColor },
        ]}
      >
        {kaspi.cardNumber ? (
          <DonationCopyRow
            label="Card number"
            value={kaspi.cardNumber.replace(/\s/g, "")}
            isDark={isDark}
            tint={tint}
            mutedColor={mutedColor}
            showBottomBorder={!!(kaspi.cardHolder || kaspi.expiry || kaspi.phone)}
          />
        ) : null}
        {kaspi.cardHolder ? (
          <DonationCopyRow
            label="Cardholder name"
            value={kaspi.cardHolder}
            isDark={isDark}
            tint={tint}
            mutedColor={mutedColor}
            showBottomBorder={!!(kaspi.expiry || kaspi.phone)}
          />
        ) : null}
        {kaspi.expiry ? (
          <DonationCopyRow
            label="Expiry (MM/YY)"
            value={kaspi.expiry}
            isDark={isDark}
            tint={tint}
            mutedColor={mutedColor}
            showBottomBorder={!!kaspi.phone}
          />
        ) : null}
        {kaspi.phone ? (
          <DonationCopyRow
            label="Kaspi Gold / phone"
            value={kaspi.phone}
            isDark={isDark}
            tint={tint}
            mutedColor={mutedColor}
            showBottomBorder={false}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 8,
  },
  cardOuter: {
    alignSelf: "center",
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
  },
  cardFace: {
    width: "100%",
    aspectRatio: 1.586,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    overflow: "hidden",
    flexDirection: "column",
  },
  cardShine: {
    position: "absolute",
    top: -40,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.35,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chip: {
    width: 36,
    height: 28,
    borderRadius: 5,
  },
  brandBlock: {
    alignItems: "flex-end",
  },
  brandKaspi: {
    color: CARD_TEXT,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  brandGold: {
    color: CHIP_GOLD,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    marginTop: -1,
  },
  cardMiddle: {
    flexGrow: 1,
    minHeight: 8,
  },
  pan: {
    color: CARD_TEXT,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1.25,
    fontVariant: ["tabular-nums"],
    marginBottom: 14,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 16,
  },
  holderBlock: {
    flex: 1,
    minWidth: 0,
  },
  expiryBlock: {
    alignItems: "flex-end",
  },
  metaLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  holderName: {
    color: CARD_TEXT,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  expiryValue: {
    color: CARD_TEXT,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontVariant: ["tabular-nums"],
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  detailsCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingBottom: 4,
    overflow: "hidden",
  },
});
