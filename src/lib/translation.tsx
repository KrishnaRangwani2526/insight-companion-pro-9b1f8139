import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useApp } from "./store";
import { tr } from "./translate";
import type { LangCode } from "./types";

/**
 * Every English label on screen is shown in the chosen language.
 * Order of truth:
 *   1. the hand-written phrase dictionary (trusted craft/business wording)
 *   2. translations already learnt and cached on this device
 *   3. AI translation, fetched in batches and then cached forever
 */

const cacheKey = (lang: LangCode) => `kalaa-setu-i18n-${lang}-v1`;
const MAX_BATCH = 40;
const SKIP = /^[\s\d₹%.,:/+\-–—()]*$/;

interface Ctx {
  lang: LangCode;
  /** The chosen-language version of an English label, or null when unavailable. */
  local: (english: string) => string | null;
  /** Best available text: chosen language when known, English otherwise. */
  text: (english: string) => string;
}

const TranslationContext = createContext<Ctx | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { state } = useApp();
  const lang = state.business.language;
  const [cache, setCache] = useState<Record<string, string>>({});
  const requested = useRef<Set<string>>(new Set());
  const queue = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langRef = useRef<LangCode>(lang);
  langRef.current = lang;

  // Load what this device already learnt for the chosen language.
  useEffect(() => {
    requested.current = new Set();
    queue.current = new Set();
    if (lang === "en") {
      setCache({});
      return;
    }
    let stored: Record<string, string> = {};
    try {
      const raw = localStorage.getItem(cacheKey(lang));
      if (raw) stored = JSON.parse(raw) as Record<string, string>;
    } catch {
      stored = {};
    }
    for (const key of Object.keys(stored)) requested.current.add(key);
    setCache(stored);
  }, [lang]);

  const flush = useCallback(() => {
    timer.current = null;
    const activeLang = langRef.current;
    const batch = [...queue.current].slice(0, MAX_BATCH);
    if (!batch.length || activeLang === "en") return;
    for (const item of batch) queue.current.delete(item);

    void (async () => {
      try {
        const { translateBatch } = await import("./translate.functions");
        const result = await translateBatch({ data: { lang: activeLang, texts: batch } });
        if (langRef.current !== activeLang) return;
        const found = result.translations;
        if (Object.keys(found).length) {
          setCache((current) => {
            const next = { ...current, ...found };
            try {
              localStorage.setItem(cacheKey(activeLang), JSON.stringify(next));
            } catch {
              /* storage full */
            }
            return next;
          });
        }
      } catch {
        // Offline or AI unavailable — English stays on screen and we retry later.
        for (const item of batch) requested.current.delete(item);
      } finally {
        if (queue.current.size && !timer.current) timer.current = setTimeout(flush, 400);
      }
    })();
  }, []);

  const request = useCallback(
    (english: string) => {
      if (requested.current.has(english)) return;
      requested.current.add(english);
      queue.current.add(english);
      if (!timer.current) timer.current = setTimeout(flush, 250);
    },
    [flush],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const local = useCallback(
    (english: string): string | null => {
      if (lang === "en") return null;
      const source = english.trim();
      if (!source || SKIP.test(source)) return null;
      const fixed = tr(lang, source);
      if (fixed) return fixed;
      const learnt = cache[source];
      if (learnt) return learnt;
      request(source);
      return null;
    },
    [lang, cache, request],
  );

  const value = useMemo<Ctx>(
    () => ({ lang, local, text: (english) => local(english) ?? english }),
    [lang, local],
  );

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation(): Ctx {
  const ctx = useContext(TranslationContext);
  if (ctx) return ctx;
  // Safe fallback so a component outside the provider still renders English.
  return { lang: "en", local: () => null, text: (english) => english };
}
