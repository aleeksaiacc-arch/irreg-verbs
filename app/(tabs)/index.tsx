import { IRREGULAR_VERBS, type IrregularVerb } from "@/data/irregular-verbs";
import { useAuth } from "@/hooks/use-auth";
import { useVerbProgress } from "@/hooks/use-verb-progress";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COL = { num: 36, inf: 90, past: 100, pp: 110, tr: 130, cb: 40 };
const TABLE_WIDTH = COL.num + COL.inf + COL.past + COL.pp + COL.tr + COL.cb * 2;
const COMPACT_BREAKPOINT = 560;

function Checkbox({
  checked,
  onPress,
}: {
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={[styles.checkbox, checked && styles.checkboxChecked]}
    >
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </Pressable>
  );
}

function CompactFormLine({
  label,
  value,
  accent,
  isDark,
  valueItalic,
  valueBold,
  valueColor,
}: {
  label: string;
  value: string;
  accent: string;
  isDark: boolean;
  valueItalic?: boolean;
  valueBold?: boolean;
  valueColor: string;
}) {
  const isMasked = valueColor === "transparent";
  return (
    <View style={styles.compactFormLine}>
      <View
        style={[
          styles.compactFormLabelPill,
          { backgroundColor: isDark ? `${accent}30` : `${accent}1a` },
        ]}
      >
        <View style={[styles.compactFormLabelBar, { backgroundColor: accent }]} />
        <Text style={[styles.compactFormLabelText, { color: accent }]}>{label}</Text>
      </View>
      <View
        style={[
          styles.compactFormValueBox,
          {
            borderColor: isDark ? "#2f3439" : "#e2e6ea",
            backgroundColor: isDark ? "#121416" : "#fafbfc",
          },
        ]}
      >
        <Text
          style={[
            styles.compactFormValueText,
            { color: valueColor },
            valueBold && styles.compactFormValueBold,
            valueItalic && styles.compactFormValueItalic,
          ]}
        >
          {isMasked ? " " : value}
        </Text>
      </View>
    </View>
  );
}

function CompactCheckOption({
  checked,
  onPress,
  title,
  subtitle,
  isDark,
}: {
  checked: boolean;
  onPress: () => void;
  title: string;
  subtitle: string;
  isDark: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.compactCheckOption,
        {
          borderColor: isDark ? "#3d4248" : "#d5dbe2",
          backgroundColor: isDark ? "#1a1d20" : "#f3f6f9",
        },
      ]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.compactCheckTexts}>
        <Text
          style={[
            styles.compactCheckTitle,
            { color: isDark ? "#e8eaed" : "#1a1a1a" },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.compactCheckSubtitle,
            { color: isDark ? "#8b939e" : "#5c6570" },
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

function UserAvatar({
  uri,
  initials,
  size = 32,
}: {
  uri?: string;
  initials: string;
  size?: number;
}) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatarFallback,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>
        {initials}
      </Text>
    </View>
  );
}

const ACCENT_INF = "#0a7ea4";
const ACCENT_PAST = "#5c6bc0";
const ACCENT_PP = "#00897b";
const ACCENT_TR = "#8d6e63";

const VerbRow = React.memo(function VerbRow({
  verb,
  index,
  isLearned,
  isHidden,
  onToggleLearned,
  onToggleHidden,
  isDark,
  compact,
  rowBorderColor,
}: {
  verb: IrregularVerb;
  index: number;
  isLearned: boolean;
  isHidden: boolean;
  onToggleLearned: () => void;
  onToggleHidden: () => void;
  isDark: boolean;
  compact: boolean;
  rowBorderColor: string;
}) {
  const evenBg = isDark ? "#1e2022" : "#f4f6f8";
  const oddBg = isDark ? "#151718" : "#ffffff";
  const grayedBg = isDark ? "#1a1a1c" : "#f0f0f2";
  const baseColor = isDark ? "#e0e0e0" : "#1a1a1a";
  const grayedColor = isDark ? "#555" : "#b0b0b0";
  const transparentColor = "transparent";

  const rowColor = isLearned || isHidden ? grayedColor : baseColor;
  const verbFormsColor = isHidden ? transparentColor : rowColor;

  if (compact) {
    const cardBg =
      isHidden || isLearned ? grayedBg : index % 2 === 0 ? evenBg : oddBg;
    return (
      <View
        style={[
          styles.compactCard,
          {
            backgroundColor: cardBg,
            borderColor: isDark ? "#2f3439" : "#e4e8ec",
          },
        ]}
      >
        <Text
          style={[
            styles.compactId,
            { color: isDark ? "#6b7280" : "#8a9299" },
          ]}
        >
          #{verb.id}
        </Text>
        <CompactFormLine
          label="Infinitive"
          value={verb.infinitive}
          accent={ACCENT_INF}
          isDark={isDark}
          valueBold
          valueColor={verbFormsColor}
        />
        <CompactFormLine
          label="Past"
          value={verb.past}
          accent={ACCENT_PAST}
          isDark={isDark}
          valueColor={verbFormsColor}
        />
        <CompactFormLine
          label="Past participle"
          value={verb.pastParticiple}
          accent={ACCENT_PP}
          isDark={isDark}
          valueColor={verbFormsColor}
        />
        <CompactFormLine
          label="Перевод"
          value={verb.translation}
          accent={ACCENT_TR}
          isDark={isDark}
          valueItalic
          valueColor={rowColor}
        />
        <View style={styles.compactChecksWrap}>
          <CompactCheckOption
            checked={isLearned}
            onPress={onToggleLearned}
            title="Learned"
            subtitle="You know this verb; it can be removed from the list via the switch."
            isDark={isDark}
          />
          <CompactCheckOption
            checked={isHidden}
            onPress={onToggleHidden}
            title="Hide forms"
            subtitle="Hides infinitive, past, and participle for self-check; translation stays."
            isDark={isDark}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor:
            isHidden || isLearned ? grayedBg : index % 2 === 0 ? evenBg : oddBg,
          borderBottomColor: rowBorderColor,
        },
      ]}
    >
      <Text
        style={[
          styles.cell,
          {
            width: COL.num,
            color: rowColor,
            textAlign: "center",
            opacity: 0.5,
          },
        ]}
      >
        {verb.id}
      </Text>
      <Text
        style={[
          styles.cell,
          { width: COL.inf, color: verbFormsColor, fontWeight: "600" },
        ]}
      >
        {verb.infinitive}
      </Text>
      <Text style={[styles.cell, { width: COL.past, color: verbFormsColor }]}>
        {verb.past}
      </Text>
      <Text style={[styles.cell, { width: COL.pp, color: verbFormsColor }]}>
        {verb.pastParticiple}
      </Text>
      <Text
        style={[
          styles.cell,
          { width: COL.tr, color: rowColor, fontStyle: "italic" },
        ]}
      >
        {verb.translation}
      </Text>
      <View style={[styles.cellCenter, { width: COL.cb }]}>
        <Checkbox checked={isLearned} onPress={onToggleLearned} />
      </View>
      <View style={[styles.cellCenter, { width: COL.cb }]}>
        <Checkbox checked={isHidden} onPress={onToggleHidden} />
      </View>
    </View>
  );
});

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const compact = width < COMPACT_BREAKPOINT;
  const { learned, hidden, toggleLearned, toggleHidden } = useVerbProgress();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showHidden, setShowHidden] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const fullName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "";
  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = fullName || user?.email || "";
  const initials = fullName
    ? fullName
        .split(" ")
        .filter(Boolean)
        .map((p: string) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "?";

  const handleToggleLearned = useCallback(
    (id: number) => toggleLearned(id),
    [toggleLearned],
  );
  const handleToggleHidden = useCallback(
    (id: number) => toggleHidden(id),
    [toggleHidden],
  );

  const visibleVerbs = showHidden
    ? IRREGULAR_VERBS
    : IRREGULAR_VERBS.filter((v) => !learned.has(v.id));

  const headerBg = isDark ? "#0d1117" : "#e8ecf0";
  const bgColor = isDark ? "#151718" : "#ffffff";
  const textColor = isDark ? "#e0e0e0" : "#1a1a1a";
  const borderColor = isDark ? "#2a2d30" : "#dde1e5";
  const rowBorderColor = isDark ? "#2a2d30" : "#d8dce0";
  const headerMuted = isDark ? "#9aa4ae" : "#5a6a7a";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bgColor }]}
      edges={["top", "left", "right"]}
    >
      <View
        style={[
          styles.toolbar,
          compact && styles.toolbarCompact,
          { borderBottomColor: borderColor },
        ]}
      >
        <Text
          style={[
            styles.title,
            compact && styles.titleCompact,
            { color: textColor },
          ]}
        >
          Irregular Verbs
        </Text>
        <View
          style={[styles.toolbarRight, compact && styles.toolbarRightCompact]}
        >
          {learned.size > 0 && (
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: textColor }]}>
                Learned: {learned.size}
              </Text>
              <Switch
                value={showHidden}
                onValueChange={setShowHidden}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={showHidden ? "#0a7ea4" : "#f4f3f4"}
              />
            </View>
          )}
          {user ? (
            <View
              style={[styles.userSection, compact && styles.userSectionCompact]}
            >
              <UserAvatar uri={avatarUrl} initials={initials} size={28} />
              <Text
                style={[
                  styles.userName,
                  !compact && styles.userNameClamp,
                  compact && styles.userNameFlex,
                  { color: textColor },
                ]}
                numberOfLines={1}
              >
                {displayName}
              </Text>
              <Pressable onPress={signOut} style={styles.signOutButton}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => router.push("/(auth)/login")}
              style={styles.signInButton}
            >
              <Text style={styles.signInText}>Save Progress</Text>
            </Pressable>
          )}
        </View>
      </View>
      <View style={[styles.statsRow, { borderBottomColor: borderColor }]}>
        <Text style={[styles.statsText, { color: isDark ? "#888" : "#666" }]}>
          Total: {IRREGULAR_VERBS.length} · Learned: {learned.size} · Visible:{" "}
          {visibleVerbs.length}
        </Text>
      </View>

      {compact ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.compactListContent}
          showsVerticalScrollIndicator
        >
          <View
            style={[
              styles.compactLegend,
              { backgroundColor: headerBg, borderBottomColor: borderColor },
            ]}
          >
            <Text style={[styles.compactLegendText, { color: headerMuted }]}>
              Verbs are stacked: colored tags show the form. ✓ Learned marks
              words you know; 👁 Hide forms hides English forms for practice
              (translation stays).
            </Text>
          </View>
          {visibleVerbs.map((verb, index) => (
            <VerbRow
              key={verb.id}
              verb={verb}
              index={index}
              isLearned={learned.has(verb.id)}
              isHidden={hidden.has(verb.id)}
              onToggleLearned={() => handleToggleLearned(verb.id)}
              onToggleHidden={() => handleToggleHidden(verb.id)}
              isDark={isDark}
              compact
              rowBorderColor={rowBorderColor}
            />
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={[
                styles.headerRow,
                { backgroundColor: headerBg, borderBottomColor: borderColor },
              ]}
            >
              <Text
                style={[
                  styles.headerCell,
                  { width: COL.num, textAlign: "center", color: headerMuted },
                ]}
              >
                #
              </Text>
              <Text
                style={[styles.headerCell, { width: COL.inf, color: headerMuted }]}
              >
                Infinitive
              </Text>
              <Text
                style={[styles.headerCell, { width: COL.past, color: headerMuted }]}
              >
                Past
              </Text>
              <Text
                style={[styles.headerCell, { width: COL.pp, color: headerMuted }]}
              >
                Past Part.
              </Text>
              <Text
                style={[styles.headerCell, { width: COL.tr, color: headerMuted }]}
              >
                Перевод
              </Text>
              <Text
                style={[
                  styles.headerCell,
                  { width: COL.cb, textAlign: "center", color: headerMuted },
                ]}
              >
                ✓
              </Text>
              <Text
                style={[
                  styles.headerCell,
                  { width: COL.cb, textAlign: "center", color: headerMuted },
                ]}
              >
                👁
              </Text>
            </View>
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
              {visibleVerbs.map((verb, index) => (
                <VerbRow
                  key={verb.id}
                  verb={verb}
                  index={index}
                  isLearned={learned.has(verb.id)}
                  isHidden={hidden.has(verb.id)}
                  onToggleLearned={() => handleToggleLearned(verb.id)}
                  onToggleHidden={() => handleToggleHidden(verb.id)}
                  isDark={isDark}
                  compact={false}
                  rowBorderColor={rowBorderColor}
                />
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  toolbarCompact: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
  },
  toolbarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toolbarRightCompact: {
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "flex-start",
    rowGap: 10,
    columnGap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  titleCompact: {
    fontSize: 20,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleLabel: {
    fontSize: 13,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userSectionCompact: {
    flex: 1,
    flexBasis: "100%",
    minWidth: 0,
    flexWrap: "wrap",
    alignItems: "center",
  },
  userName: {
    fontSize: 13,
    fontWeight: "500",
  },
  userNameClamp: {
    maxWidth: 140,
  },
  userNameFlex: {
    flex: 1,
    minWidth: 0,
  },
  avatarFallback: {
    backgroundColor: "#9e9e9e",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#e5393520",
  },
  signOutText: {
    color: "#e53935",
    fontSize: 13,
    fontWeight: "600",
  },
  signInButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#0a7ea420",
  },
  signInText: {
    color: "#0a7ea4",
    fontSize: 13,
    fontWeight: "600",
  },
  statsRow: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  statsText: {
    fontSize: 12,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    minWidth: TABLE_WIDTH,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5a6a7a",
    paddingHorizontal: 6,
    paddingVertical: 10,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: TABLE_WIDTH,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  compactListContent: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  compactLegend: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  compactLegendText: {
    fontSize: 12,
    lineHeight: 18,
  },
  compactCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  compactId: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  compactFormLine: {
    marginBottom: 12,
  },
  compactFormLabelPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 6,
  },
  compactFormLabelBar: {
    width: 3,
    alignSelf: "stretch",
  },
  compactFormLabelText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
    paddingVertical: 4,
    paddingLeft: 6,
    paddingRight: 10,
  },
  compactFormValueBox: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  compactFormValueText: {
    fontSize: 16,
    lineHeight: 22,
  },
  compactFormValueBold: {
    fontWeight: "700",
  },
  compactFormValueItalic: {
    fontStyle: "italic",
  },
  compactChecksWrap: {
    gap: 8,
    marginTop: 2,
  },
  compactCheckOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  compactCheckTexts: {
    flex: 1,
    minWidth: 0,
  },
  compactCheckTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  compactCheckSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  cell: {
    fontSize: 13,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  cellCenter: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: -1,
  },
});
