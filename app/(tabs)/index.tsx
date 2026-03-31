import { IRREGULAR_VERBS, type IrregularVerb } from "@/data/irregular-verbs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY_LEARNED = "irregular-verbs-learned";
const STORAGE_KEY_HIDDEN = "irregular-verbs-hidden";

function saveSet(key: string, set: Set<number>) {
  AsyncStorage.setItem(key, JSON.stringify([...set]));
}

function usePersistedSet(key: string): [Set<number>, boolean, React.Dispatch<React.SetStateAction<Set<number>>>] {
  const [set, setSet] = useState<Set<number>>(() => new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key).then((raw) => {
      if (raw) {
        try {
          setSet(new Set(JSON.parse(raw)));
        } catch {}
      }
      setLoaded(true);
    });
  }, [key]);

  return [set, loaded, setSet];
}

const COL = { num: 36, inf: 90, past: 100, pp: 110, tr: 130, cb: 40 };
const TABLE_WIDTH = COL.num + COL.inf + COL.past + COL.pp + COL.tr + COL.cb * 2;

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

const VerbRow = React.memo(function VerbRow({
  verb,
  index,
  isLearned,
  isHidden,
  onToggleLearned,
  onToggleHidden,
  isDark,
}: {
  verb: IrregularVerb;
  index: number;
  isLearned: boolean;
  isHidden: boolean;
  onToggleLearned: () => void;
  onToggleHidden: () => void;
  isDark: boolean;
}) {
  const evenBg = isDark ? "#1e2022" : "#f4f6f8";
  const oddBg = isDark ? "#151718" : "#ffffff";
  const grayedBg = isDark ? "#1a1a1c" : "#f0f0f2";
  const baseColor = isDark ? "#e0e0e0" : "#1a1a1a";
  const grayedColor = isDark ? "#555" : "#b0b0b0";
  const transparentColor = "transparent";

  const rowColor = isLearned || isHidden ? grayedColor : baseColor;
  const verbFormsColor = isHidden ? transparentColor : rowColor;

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: isHidden || isLearned
            ? grayedBg
            : index % 2 === 0
              ? evenBg
              : oddBg,
        },
      ]}
    >
      <Text
        style={[
          styles.cell,
          { width: COL.num, color: rowColor, textAlign: 'center', opacity: 0.5 },
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
  const [learned, learnedLoaded, setLearned] = usePersistedSet(STORAGE_KEY_LEARNED);
  const [hidden, hiddenLoaded, setHidden] = usePersistedSet(STORAGE_KEY_HIDDEN);
  const [showHidden, setShowHidden] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const toggleLearned = useCallback((id: number) => {
    setLearned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveSet(STORAGE_KEY_LEARNED, next);
      return next;
    });
  }, []);

  const toggleHidden = useCallback((id: number) => {
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveSet(STORAGE_KEY_HIDDEN, next);
      return next;
    });
  }, []);

  const visibleVerbs = showHidden
    ? IRREGULAR_VERBS
    : IRREGULAR_VERBS.filter((v) => !learned.has(v.id));

  const headerBg = isDark ? "#0d1117" : "#e8ecf0";
  const bgColor = isDark ? "#151718" : "#ffffff";
  const textColor = isDark ? "#e0e0e0" : "#1a1a1a";
  const borderColor = isDark ? "#2a2d30" : "#dde1e5";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.toolbar, { borderBottomColor: borderColor }]}>
        <Text style={[styles.title, { color: textColor }]}>
          Irregular Verbs
        </Text>
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
      </View>
      <View style={[styles.statsRow, { borderBottomColor: borderColor }]}>
        <Text style={[styles.statsText, { color: isDark ? "#888" : "#666" }]}>
          Total: {IRREGULAR_VERBS.length} · Learned: {learned.size} · Visible:{" "}
          {visibleVerbs.length}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, margin: "auto" }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={[
              styles.headerRow,
              { backgroundColor: headerBg, borderBottomColor: borderColor },
            ]}
          >
            <Text style={[styles.headerCell, { width: COL.num, textAlign: 'center' }]}>
              #
            </Text>
            <Text style={[styles.headerCell, { width: COL.inf }]}>
              Infinitive
            </Text>
            <Text style={[styles.headerCell, { width: COL.past }]}>Past</Text>
            <Text style={[styles.headerCell, { width: COL.pp }]}>
              Past Part.
            </Text>
            <Text style={[styles.headerCell, { width: COL.tr }]}>Перевод</Text>
            <Text
              style={[
                styles.headerCell,
                { width: COL.cb, textAlign: "center" },
              ]}
            >
              ✓
            </Text>
            <Text
              style={[
                styles.headerCell,
                { width: COL.cb, textAlign: "center" },
              ]}
            >
              👁
            </Text>
          </View>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
            {visibleVerbs.map((verb, index) => (
              <VerbRow
                key={verb.id}
                verb={verb}
                index={index}
                isLearned={learned.has(verb.id)}
                isHidden={hidden.has(verb.id)}
                onToggleLearned={() => toggleLearned(verb.id)}
                onToggleHidden={() => toggleHidden(verb.id)}
                isDark={isDark}
              />
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </ScrollView>
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
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleLabel: {
    fontSize: 13,
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
    borderBottomColor: "#e0e0e0",
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
