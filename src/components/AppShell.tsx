import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Package,
  Sparkles,
  ClipboardList,
  Menu,
  Bell,
  Boxes,
  Megaphone,
  Wallet,
  Compass,
  Store,
  Users,
  Truck,
  Building2,
  GraduationCap,
  BarChart3,
  User,
  Settings,
  Globe,
  LifeBuoy,
  WifiOff,
  RefreshCw,
  Mic,
  Send,
  X,
  ChevronLeft,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useApp, useOnline } from "@/lib/store";
import { LANGUAGES, t } from "@/lib/i18n";
import type { LangCode } from "@/lib/types";
import { aiService } from "@/services/aiService";
import { Sheet, ActionButton } from "./ui-kit";

const MORE_LINKS = [
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/marketing", label: "Marketing", icon: Megaphone },
  { to: "/finance", label: "Finance", icon: Wallet },
  { to: "/advisor", label: "Business Advisor", icon: Compass },
  { to: "/store", label: "My Store", icon: Store },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/logistics", label: "Logistics", icon: Truck },
  { to: "/b2b", label: "B2B Marketplace", icon: Building2 },
  { to: "/presence", label: "Get Found Online", icon: Globe },
  { to: "/learning", label: "Learning", icon: GraduationCap },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/business", label: "My Business", icon: Building2 },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: LifeBuoy },
];

const MAIN_LINKS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/products", label: "Products", icon: Package },
  { to: "/ai-studio", label: "AI Studio", icon: Sparkles },
  { to: "/orders", label: "Orders", icon: ClipboardList },
];

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { state, update } = useApp();
  const { online, syncing } = useOnline();
  const [moreOpen, setMoreOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = state.business.language;
  const langInfo = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]!;

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");
  const showBack = pathname !== "/dashboard";

  const goBack = () => {
    if (window.history.length > 1) {
      router.history.back();
      return;
    }
    router.navigate({ to: "/dashboard" });
  };

  return (
    <div
      className={cn(
        "page-glow relative min-h-screen w-full bg-background text-foreground",
        state.largeText && "text-[17px] [&_*]:leading-relaxed",
        state.highContrast && "contrast-125",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-1 overflow-y-auto border-r border-line px-4 py-6 lg:flex">
          <Link to="/dashboard" className="mb-5 flex items-center gap-3 px-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary font-mono text-[14px] font-bold text-primary-foreground">
              KS
            </span>
            <span>
              <span className="block text-[15px] font-bold leading-tight">Kalaa Setu</span>
              <span className="block text-[11px] text-muted-foreground">Artisan business partner</span>
            </span>
          </Link>
          {[...MAIN_LINKS, ...MORE_LINKS].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors",
                isActive(l.to) ? "bg-primary-soft font-semibold text-primary" : "text-muted-foreground hover:bg-surface-2",
              )}
            >
              <l.icon className="size-[18px]" />
              {l.label}
            </Link>
          ))}
        </aside>

        <div className="flex min-h-screen w-full flex-col lg:px-8">
          {/* Header */}
          <header className="app-safe-top sticky top-0 z-30 flex items-center justify-between gap-3 bg-background/80 px-5 pb-4 backdrop-blur-xl lg:px-0">
            <div className="flex min-w-0 items-center gap-2">
              {showBack ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 text-primary ring-1 ring-line transition-transform active:scale-95 lg:hidden"
                  aria-label="Go back"
                >
                  <ChevronLeft className="size-6" strokeWidth={2.5} />
                </button>
              ) : null}
              <Link to="/business" className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-2 font-mono text-[15px] font-bold text-primary ring-1 ring-line">
                {state.business.name.slice(0, 1)}
                {state.business.name.split(" ").at(-1)?.slice(0, 1) ?? ""}
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-medium text-muted-foreground">
                  {t(lang, "greeting")}
                </span>
                <span className="block truncate text-[18px] font-bold leading-tight tracking-tight">
                  {state.business.name}
                </span>
              </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLangOpen(true)}
                className="frost-tile flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold"
              >
                {langInfo.short}
              </button>
              <Link
                to="/notifications"
                className="relative grid size-9 place-items-center rounded-full bg-surface-2 ring-1 ring-line"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                {!state.notificationsRead ? (
                  <span className="absolute -top-px -right-px size-2.5 rounded-full bg-accent ring-2 ring-background" />
                ) : null}
              </Link>
            </div>
          </header>

          {(!online || syncing) && (
            <div
              className={cn(
                "mx-5 mb-3 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-semibold lg:mx-0",
                online ? "bg-good-soft text-good" : "bg-warn-soft text-warn",
              )}
            >
              {online ? <RefreshCw className="size-4 animate-spin" /> : <WifiOff className="size-4" />}
              {online ? "Syncing your changes…" : "You're offline — your work is saved on this phone"}
            </div>
          )}

          <main className="flex-1 space-y-5 px-5 pb-32 lg:px-0 lg:pb-16">{children}</main>

          {/* Mobile bottom nav */}
          <nav className="app-safe-bottom sticky bottom-0 z-30 px-4 lg:hidden">
            <div className="frost-card relative flex items-end justify-between px-2 py-2">
              <NavItem to="/dashboard" label={t(lang, "home")} icon={Home} active={isActive("/dashboard")} />
              <NavItem to="/products" label={t(lang, "products")} icon={Package} active={isActive("/products")} />
              <Link to="/ai-studio" className="flex w-[72px] -translate-y-6 flex-col items-center gap-1">
                <span
                  className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground ring-4 ring-background"
                  style={{ boxShadow: "0 12px 24px -10px oklch(0.606 0.196 265 / 0.7)" }}
                >
                  <Sparkles className="size-6" />
                </span>
                <span className="text-[11px] font-semibold text-primary">{t(lang, "aiStudio")}</span>
              </Link>
              <NavItem to="/orders" label={t(lang, "orders")} icon={ClipboardList} active={isActive("/orders")} />
              <button
                onClick={() => setMoreOpen(true)}
                className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-muted-foreground"
              >
                <Menu className="size-[18px]" />
                <span className="text-[11px] font-medium">{t(lang, "more")}</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Floating Ask AI */}
      <button
        onClick={() => setAiOpen(true)}
        className="fixed right-5 bottom-28 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-[14px] font-semibold text-primary-foreground shadow-lg lg:bottom-8"
      >
        <Sparkles className="size-4" /> Ask AI
      </button>

      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title="All features">
        <div className="grid grid-cols-2 gap-2.5">
          {MORE_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMoreOpen(false)}
              className="frost-tile flex items-center gap-2.5 p-3 text-[13px] font-semibold"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <l.icon className="size-4" />
              </span>
              {l.label}
            </Link>
          ))}
        </div>
      </Sheet>

      <Sheet open={langOpen} onClose={() => setLangOpen(false)} title="Choose your language">
        <div className="grid grid-cols-2 gap-2.5">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                update({ business: { ...state.business, language: l.code as LangCode } });
                setLangOpen(false);
              }}
              className={cn(
                "frost-tile p-3 text-left",
                l.code === lang && "ring-2 ring-primary",
              )}
            >
              <span className="block text-[15px] font-semibold">{l.native}</span>
              <span className="block text-[12px] text-muted-foreground">{l.label}</span>
            </button>
          ))}
        </div>
      </Sheet>

      <AssistantSheet open={aiOpen} onClose={() => setAiOpen(false)} lang={lang} />
    </div>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 rounded-2xl py-2",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-[18px]" />
      <span className={cn("text-[11px]", active ? "font-semibold" : "font-medium")}>{label}</span>
    </Link>
  );
}

const SUGGESTIONS = [
  "Find a fair price for my shawl",
  "Create an advertisement",
  "Why are my sales falling?",
  "Can I afford this loan?",
];

export function AssistantSheet({
  open,
  onClose,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  lang: LangCode;
}) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Namaste 🙏 Ask me anything about your business — price, ads, stock, loans or sales." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);
    const reply = await aiService.askAssistant(text);
    setMessages((m) => [...m, { role: "ai", text: reply }]);
    setBusy(false);
  };

  return (
    <Sheet open={open} onClose={onClose} title="Ask your AI helper">
      <div className="max-h-[45vh] space-y-3 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed",
              m.role === "ai"
                ? "bg-surface-2 text-foreground"
                : "ml-auto bg-primary text-primary-foreground",
            )}
          >
            {m.text}
          </div>
        ))}
        {busy ? <div className="shimmer h-9 w-40 rounded-2xl bg-surface-2" /> : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-full bg-surface-2 px-3 py-1.5 text-[12px] font-medium ring-1 ring-line"
          >
            {s}
          </button>
        ))}
      </div>
      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === "hi" ? "बोलिए या लिखिए…" : "Type your question…"}
          className="min-h-12 flex-1 rounded-2xl bg-surface-2 px-4 text-[14px] outline-none ring-1 ring-line focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          onClick={() => void send("Which product should I promote?")}
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground"
          aria-label="Speak"
        >
          <Mic className="size-5" />
        </button>
        <ActionButton type="submit" className="grid size-12 shrink-0 place-items-center px-0">
          <Send className="size-5" />
        </ActionButton>
      </form>
      <button onClick={onClose} className="sr-only">
        <X className="size-4" /> Close
      </button>
    </Sheet>
  );
}
