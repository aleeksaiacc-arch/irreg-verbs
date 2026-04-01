import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

const CACHE_KEY_LEARNED = (uid: string) => `verb-progress-learned-${uid}`;
const CACHE_KEY_HIDDEN = (uid: string) => `verb-progress-hidden-${uid}`;
const GUEST_KEY_LEARNED = "verb-progress-learned-guest";
const GUEST_KEY_HIDDEN = "verb-progress-hidden-guest";

function serializeSet(set: Set<number>): string {
  return JSON.stringify([...set]);
}

function deserializeSet(raw: string | null): Set<number> {
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

async function loadCached(key: string): Promise<Set<number>> {
  const raw = await AsyncStorage.getItem(key);
  return deserializeSet(raw);
}

async function saveCache(key: string, set: Set<number>) {
  await AsyncStorage.setItem(key, serializeSet(set));
}

async function fetchRemoteProgress(userId: string) {
  const { data, error } = await supabase
    .from("verb_progress")
    .select("verb_id, is_learned, is_hidden, updated_at")
    .eq("user_id", userId);

  if (error) throw error;
  return data ?? [];
}

async function upsertProgress(
  userId: string,
  verbId: number,
  isLearned: boolean,
  isHidden: boolean
) {
  const { error } = await supabase.from("verb_progress").upsert(
    {
      user_id: userId,
      verb_id: verbId,
      is_learned: isLearned,
      is_hidden: isHidden,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,verb_id" }
  );
  if (error) throw error;
}

export function useVerbProgress() {
  const { user } = useAuth();
  const userId = user?.id;

  const [learned, setLearned] = useState<Set<number>>(new Set());
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const pendingOps = useRef<
    Array<{
      verbId: number;
      isLearned: boolean;
      isHidden: boolean;
    }>
  >([]);
  const syncingRef = useRef(false);

  const learnedKey = userId ? CACHE_KEY_LEARNED(userId) : GUEST_KEY_LEARNED;
  const hiddenKey = userId ? CACHE_KEY_HIDDEN(userId) : GUEST_KEY_HIDDEN;

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const [cachedLearned, cachedHidden] = await Promise.all([
        loadCached(learnedKey),
        loadCached(hiddenKey),
      ]);
      if (cancelled) return;
      setLearned(cachedLearned);
      setHidden(cachedHidden);
      setLoaded(true);

      if (!userId) return;

      try {
        const remote = await fetchRemoteProgress(userId);
        if (cancelled) return;

        const remoteLearned = new Set<number>();
        const remoteHidden = new Set<number>();
        for (const row of remote) {
          if (row.is_learned) remoteLearned.add(row.verb_id);
          if (row.is_hidden) remoteHidden.add(row.verb_id);
        }

        const mergedLearned = new Set([...cachedLearned, ...remoteLearned]);
        const mergedHidden = new Set([...cachedHidden, ...remoteHidden]);

        setLearned(mergedLearned);
        setHidden(mergedHidden);
        await Promise.all([
          saveCache(learnedKey, mergedLearned),
          saveCache(hiddenKey, mergedHidden),
        ]);
      } catch {
        // offline — use cached data
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [userId, learnedKey, hiddenKey]);

  const flushPending = useCallback(async () => {
    if (!userId || syncingRef.current) return;
    syncingRef.current = true;

    while (pendingOps.current.length > 0) {
      const op = pendingOps.current[0];
      try {
        await upsertProgress(userId, op.verbId, op.isLearned, op.isHidden);
        pendingOps.current.shift();
      } catch {
        break;
      }
    }

    syncingRef.current = false;

    if (pendingOps.current.length > 0) {
      flushPending();
    }
  }, [userId]);

  const toggleLearned = useCallback(
    (verbId: number) => {
      setLearned((prev) => {
        const next = new Set(prev);
        const nowLearned = !next.has(verbId);
        nowLearned ? next.add(verbId) : next.delete(verbId);

        saveCache(learnedKey, next);

        if (userId) {
          setHidden((currentHidden) => {
            pendingOps.current.push({
              verbId,
              isLearned: nowLearned,
              isHidden: currentHidden.has(verbId),
            });
            return currentHidden;
          });
        }
        return next;
      });
      if (userId) flushPending();
    },
    [userId, learnedKey, flushPending]
  );

  const toggleHidden = useCallback(
    (verbId: number) => {
      setHidden((prev) => {
        const next = new Set(prev);
        const nowHidden = !next.has(verbId);
        nowHidden ? next.add(verbId) : next.delete(verbId);

        saveCache(hiddenKey, next);

        if (userId) {
          setLearned((currentLearned) => {
            pendingOps.current.push({
              verbId,
              isLearned: currentLearned.has(verbId),
              isHidden: nowHidden,
            });
            return currentLearned;
          });
        }
        return next;
      });
      if (userId) flushPending();
    },
    [userId, hiddenKey, flushPending]
  );

  return { learned, hidden, loaded, toggleLearned, toggleHidden };
}
