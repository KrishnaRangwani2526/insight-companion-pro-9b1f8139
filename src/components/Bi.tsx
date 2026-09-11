import type { ReactNode } from "react";
import { useTranslation } from "@/lib/translation";
import { cn } from "@/lib/utils";

/**
 * Bilingual label: the chosen language is the main line, with small English
 * underneath so the screen stays usable for anyone reading English.
 * Falls back to English only when no translation is available yet.
 */
export function Bi({ children, className }: { children: ReactNode; className?: string }) {
  const { local } = useTranslation();
  if (typeof children !== "string") return <>{children}</>;
  const translated = local(children);
  if (!translated) return <>{children}</>;
  return (
    <>
      {translated}
      <span className={cn("block text-[0.76em] leading-tight font-medium opacity-65", className)}>
        {children}
      </span>
    </>
  );
}

/** Inline variant for tight spots (chips, nav labels): "लोकल · English" */
export function BiInline({ children }: { children: ReactNode }) {
  const { local } = useTranslation();
  if (typeof children !== "string") return <>{children}</>;
  const translated = local(children);
  if (!translated) return <>{children}</>;
  return (
    <>
      {translated} <span className="font-medium opacity-60">· {children}</span>
    </>
  );
}

/** Chosen language only — for places that need a plain string, use useLabel(). */
export function useLabel() {
  const { text } = useTranslation();
  return text;
}
