import { ThemedText } from "@/components/themed-text";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  value: string;
  isDark: boolean;
  tint: string;
  mutedColor: string;
  showBottomBorder?: boolean;
};

async function hapticSuccess() {
  try {
    if (process.env.EXPO_OS === "ios") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {
    /* ignore */
  }
}

export function DonationCopyRow({
  label,
  value,
  isDark,
  tint,
  mutedColor,
  showBottomBorder = true,
}: Props) {
  const [copied, setCopied] = useState(false);
  const canCopy = value.length > 0;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const onCopy = useCallback(async () => {
    if (!canCopy) return;
    await Clipboard.setStringAsync(value);
    await hapticSuccess();
    setCopied(true);
  }, [canCopy, value]);

  const borderColor = isDark ? "#2e3539" : "#e0e8ec";
  const valueColor = isDark ? "#ECEDEE" : "#11181C";

  return (
    <View
      style={[
        styles.row,
        showBottomBorder && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor },
      ]}
    >
      <View style={styles.rowText}>
        <ThemedText style={[styles.label, { color: mutedColor }]}>{label}</ThemedText>
        <Text
          selectable
          style={[styles.value, { color: valueColor }]}
          numberOfLines={4}
        >
          {canCopy ? value : "—"}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Copy ${label}`}
        accessibilityState={{ disabled: !canCopy }}
        onPress={onCopy}
        disabled={!canCopy}
        style={[styles.copyBtn, { opacity: canCopy ? 1 : 0.4 }]}
      >
        <ThemedText style={[styles.copyLabel, { color: tint }]}>
          {copied ? "Copied" : "Copy"}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    gap: 12,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "monospace",
  },
  copyBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    minWidth: 56,
    alignItems: "flex-end",
  },
  copyLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
