import { Link } from "@tanstack/react-router";
import { type LucideIcon, ChevronRight, Mic, Square, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useVoiceRecorder } from "@/lib/use-voice-recorder";
import type { BusinessFields } from "@/lib/voice.functions";

import shawl from "@/assets/shawl.jpg";
import vase from "@/assets/vase.jpg";
import bag from "@/assets/bag.jpg";
import basket from "@/assets/basket.jpg";
import dupatta from "@/assets/dupatta.jpg";

export const PRODUCT_IMAGES: Record<string, string> = { shawl, vase, bag, basket, dupatta };

export function productImage(key: string) {
  if (key.startsWith("data:image/") || key.startsWith("blob:")) return key;
  return PRODUCT_IMAGES[key] ?? shawl;
}

export function SectionLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2.5 flex items-end justify-between">
      <p className="font-mono text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        {children}
      </p>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Icon className="size-5" />
          </span>
        ) : null}
        <div>
          <h1 className="text-[22px] font-bold leading-tight tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <section
      className={cn("frost-card rise p-5", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "muted",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "muted" | "good" | "warn" | "accent" | "primary";
}) {
  const toneClass = {
    muted: "text-muted-foreground",
    good: "text-good",
    warn: "text-warn",
    accent: "text-accent",
    primary: "text-primary",
  }[tone];
  return (
    <div className="frost-tile p-3.5">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-[20px] font-bold leading-none">{value}</p>
      {hint ? <p className={cn("mt-1 text-[10px] font-semibold", toneClass)}>{hint}</p> : null}
    </div>
  );
}

export function ActionButton({
  children,
  onClick,
  variant = "primary",
  className,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "soft" | "ghost" | "accent";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    soft: "bg-surface-2 text-foreground ring-1 ring-line",
    ghost: "text-primary hover:bg-primary-soft",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-12 rounded-2xl px-4 text-[15px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50",
        styles,
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TileButton({
  label,
  sub,
  icon: Icon,
  to,
  onClick,
  tone = "primary",
}: {
  label: string;
  sub?: string;
  icon: LucideIcon;
  to?: string;
  onClick?: () => void;
  tone?: "primary" | "accent";
}) {
  const inner = (
    <>
      <span
        className={cn(
          "grid size-11 place-items-center rounded-xl",
          tone === "primary" ? "bg-primary-soft text-primary" : "bg-accent-soft text-accent",
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="text-[15px] font-semibold leading-tight">
        {label}
        {sub ? (
          <>
            <br />
            <span className="text-[12px] font-medium text-muted-foreground">{sub}</span>
          </>
        ) : null}
      </span>
    </>
  );
  const cls =
    "frost-tile flex flex-col items-start gap-3 p-4 text-left transition-colors active:bg-primary-soft";
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function RowLink({
  label,
  sub,
  icon: Icon,
  to,
  onClick,
  right,
}: {
  label: string;
  sub?: string;
  icon?: LucideIcon;
  to?: string;
  onClick?: () => void;
  right?: ReactNode;
}) {
  const body = (
    <>
      {Icon ? (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-primary">
          <Icon className="size-[18px]" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold">{label}</span>
        {sub ? <span className="block truncate text-[12px] text-muted-foreground">{sub}</span> : null}
      </span>
      {right ?? <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
    </>
  );
  const cls = "frost-tile flex w-full items-center gap-3 p-3 text-left transition-colors active:bg-surface-2";
  if (to)
    return (
      <Link to={to} className={cls}>
        {body}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {body}
    </button>
  );
}

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "good" | "warn" | "accent" | "primary" | "danger";
}) {
  const styles = {
    muted: "bg-surface-2 text-muted-foreground",
    good: "bg-good-soft text-good",
    warn: "bg-warn-soft text-warn",
    accent: "bg-accent-soft text-accent",
    primary: "bg-primary-soft text-primary",
    danger: "bg-destructive/12 text-destructive",
  }[tone];
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", styles)}>{children}</span>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full min-h-12 rounded-2xl bg-surface-2 px-4 text-[15px] outline-none ring-1 ring-line focus:ring-2 focus:ring-ring";

export function VoiceButton({
  label = "Speak",
  onResult,
  lang = "hi",
  extract = false,
}: {
  label?: string;
  onResult: (text: string, fields?: BusinessFields) => void;
  lang?: string;
  /** Also pull out business details (village, district, state, PIN…) from what was said. */
  extract?: boolean;
}) {
  const { recording, seconds, level, start, stop } = useVoiceRecorder();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    if (!recording) {
      const ok = await start();
      if (!ok) setError("Microphone permission is needed. Allow it and tap again.");
      return;
    }
    const clip = await stop();
    if (!clip) {
      setError("That was too short. Tap and speak for a few seconds.");
      return;
    }
    setBusy(true);
    try {
      const { blobToBase64 } = await import("@/lib/use-voice-recorder");
      const { transcribeBusinessVoice } = await import("@/lib/voice.functions");
      const result = await transcribeBusinessVoice({
        data: { audioBase64: await blobToBase64(clip), lang, extract },
      });
      if (!result.text) {
        setError("We could not hear any words. Please try again.");
      } else {
        onResult(result.text, result.fields);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Voice failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={busy ? undefined : handleClick}
        aria-live="polite"
        className={cn(
          "flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-[15px] font-semibold transition-all active:scale-[0.98]",
          recording
            ? "bg-accent text-accent-foreground"
            : "bg-surface-2 text-foreground ring-1 ring-line",
          busy && "opacity-70",
        )}
      >
        {busy ? (
          <>
            <Sparkles className="size-4 animate-pulse" /> Writing your words…
          </>
        ) : recording ? (
          <>
            <Square className="size-4" />
            Listening… {seconds}s — tap to stop
          </>
        ) : (
          <>
            <Mic className="size-[18px]" /> {label}
          </>
        )}
      </button>
      {recording ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-100"
            style={{ width: `${Math.min(100, Math.round(level * 260))}%` }}
          />
        </div>
      ) : null}
      {error ? <p className="text-[12px] font-semibold text-destructive">{error}</p> : null}
    </div>
  );
}


export function AiInsight({
  title,
  score,
  body,
  reasons,
  cta,
}: {
  title: string;
  score?: number;
  body: string;
  reasons?: string[];
  cta?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="frost-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <p className="text-[15px] font-semibold tracking-tight">{title}</p>
        </div>
        {score !== undefined ? (
          <span className="font-mono text-[26px] font-bold leading-none text-primary">
            {score}
            <span className="text-[13px] text-muted-foreground">/100</span>
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-foreground/85">{body}</p>
      {reasons?.length ? (
        <>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="mt-3 text-[13px] font-semibold text-primary"
          >
            {open ? "Hide reasons" : "Why?"}
          </button>
          {open ? (
            <ul className="mt-2 space-y-1.5">
              {reasons.map((r) => (
                <li key={r} className="flex gap-2 text-[13px] text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  {r}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
      {cta ? <div className="mt-4">{cta}</div> : null}
    </div>
  );
}

export function ComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <div className="frost-tile flex items-start gap-3 p-4">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-warn-soft text-warn text-[15px]">
        ⏳
      </span>
      <div>
        <p className="text-[14px] font-semibold">
          {title} <Badge tone="warn">Coming soon</Badge>
        </p>
        <p className="mt-1 text-[12px] text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, note, action }: { title: string; note: string; action?: ReactNode }) {
  return (
    <div className="frost-card flex flex-col items-center p-8 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-surface-2 text-2xl">🧺</span>
      <p className="mt-3 text-[16px] font-semibold">{title}</p>
      <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">{note}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Progress({ value, tone = "primary" }: { value: number; tone?: "primary" | "accent" | "warn" | "good" }) {
  const bg = { primary: "bg-primary", accent: "bg-accent", warn: "bg-warn", good: "bg-good" }[tone];
  return (
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
      <div className={cn("h-full rounded-full transition-all", bg)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-label={title}>
      <button className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]" onClick={onClose} aria-label="Close" />
      <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-surface p-5 pb-8 shadow-2xl ring-1 ring-line sm:rounded-3xl">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-surface-2 sm:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[17px] font-bold">{title}</p>
          <button onClick={onClose} className="rounded-full bg-surface-2 px-3 py-1 text-[13px] font-semibold">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ProcessingBar({ label }: { label: string }) {
  return (
    <div className="frost-tile p-4">
      <p className="text-[13px] font-semibold">{label}</p>
      <div className="shimmer mt-3 h-2 rounded-full bg-surface-2" />
    </div>
  );
}
