import { DonationCopyRow } from "@/components/donate/donation-copy-row";
import { ThemedText } from "@/components/themed-text";
import type { DonationBank } from "@/constants/donation-config";
import { StyleSheet, View } from "react-native";

type Props = {
  bank: DonationBank;
  isDark: boolean;
  tint: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
};

export function DonationBankCard({
  bank,
  isDark,
  tint,
  mutedColor,
  cardBg,
  borderColor,
}: Props) {
  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <ThemedText type="defaultSemiBold" style={styles.bankTitle}>
        {bank.bankName}
      </ThemedText>
      {bank.lines.map((row, index) => (
        <DonationCopyRow
          key={row.label}
          label={row.label}
          value={row.value}
          isDark={isDark}
          tint={tint}
          mutedColor={mutedColor}
          showBottomBorder={index < bank.lines.length - 1}
        />
      ))}
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
  bankTitle: {
    fontSize: 17,
    marginBottom: 4,
  },
});
