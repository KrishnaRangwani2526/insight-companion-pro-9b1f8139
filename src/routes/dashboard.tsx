import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Megaphone, IndianRupee, CheckCircle2, Sparkles, Mic } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, AssistantSheet } from "@/components/AppShell";
import {
  Card,
  SectionLabel,
  StatCard,
  TileButton,
  ActionButton,
  Progress,
  Badge,
  productImage,
} from "@/components/ui-kit";
import { useApp, inr } from "@/lib/store";
import { t, localLine } from "@/lib/i18n";
import { inventoryService } from "@/services/inventoryService";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Kalaa Setu" },
      {
        name: "description",
        content: "Business health score, today's sales, stock alerts and quick actions for your craft business.",
      },
      { property: "og:title", content: "Your business dashboard — Kalaa Setu" },
      { property: "og:description", content: "Health score, sales, orders and AI help in one screen." },
    ],
  }),
  component: Dashboard,
});

const HEALTH = [
  { label: "Sales", value: 82, tone: "primary" as const },
  { label: "Inventory", value: 74, tone: "primary" as const },
  { label: "Marketing", value: 61, tone: "accent" as const },
  { label: "Finance", value: 88, tone: "primary" as const },
  { label: "Digital", value: 54, tone: "warn" as const },
];

function Dashboard() {
  const { state } = useApp();
  const lang = state.business.language;
  const [aiOpen, setAiOpen] = useState(false);
  const inv = inventoryService.summary(state.products);
  const todaySales = state.orders
    .filter((o) => o.date.startsWith("Today"))
    .reduce((s, o) => s + o.amount, 0);
  const openOrders = state.orders.filter((o) => o.status === "new" || o.status === "processing").length;

  return (
    <AppShell>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[15px] font-semibold tracking-tight">{t(lang, "health")}</p>
            <p className="text-[12px] text-muted-foreground">
              {localLine(lang, "fullView") ?? "How your business is doing"}
            </p>
          </div>
          <span className="font-mono text-[11px] font-bold tracking-wide text-primary">SCORE</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-[46px] leading-none font-bold">78</span>
            <span className="text-[16px] font-semibold text-muted-foreground">/100</span>
          </div>
          <Badge tone="accent">▲ 6 this week</Badge>
        </div>
        <div className="mt-4 space-y-2.5">
          {HEALTH.map((h) => (
            <div key={h.label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-[12px] font-medium text-muted-foreground">{h.label}</span>
              <Progress value={h.value} tone={h.tone} />
              <span className="w-8 shrink-0 text-right font-mono text-[11px] text-muted-foreground">{h.value}</span>
            </div>
          ))}
        </div>
        <Link
          to="/analytics"
          className="mt-4 flex min-h-12 w-full items-center justify-center rounded-2xl text-[15px] font-semibold text-primary transition-colors hover:bg-primary-soft"
        >
          {t(lang, "viewHealth")}
        </Link>
      </Card>

      <section className="rise" style={{ animationDelay: "80ms" }}>
        <SectionLabel>{t(lang, "quickActions")}</SectionLabel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <TileButton
            icon={Plus}
            label="Add Product"
            sub={localLine(lang, "addProduct") ?? undefined}
            to="/products/add"
          />
          <TileButton
            icon={Megaphone}
            label="Create Ad"
            sub={localLine(lang, "createAd") ?? undefined}
            to="/marketing/advertisement"
            tone="accent"
          />
          <TileButton
            icon={IndianRupee}
            label="Check Price"
            sub={localLine(lang, "checkPrice") ?? undefined}
            to="/ai-studio/pricing"
          />
          <TileButton
            icon={CheckCircle2}
            label="Record Sale"
            sub={localLine(lang, "recordSale") ?? undefined}
            tone="accent"
            onClick={() => { toast.success("Sale recorded", { description: "Rs 1,249 added to today’s sales." }); }}
          />
        </div>
      </section>

      <section className="rise" style={{ animationDelay: "140ms" }}>
        <SectionLabel>{t(lang, "snapshot")}</SectionLabel>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          <StatCard label="Sales" value={inr(todaySales)} hint="▲ 12%" tone="accent" />
          <StatCard label="Orders" value={String(openOrders)} hint="need action" tone="good" />
          <StatCard label="Products" value={String(inv.count)} hint="in catalogue" />
          <StatCard label="Low stock" value={String(inv.low.length + inv.out.length)} hint="● replenish" tone="warn" />
          <StatCard label="Pending pay" value="₹2,400" hint="1 buyer" />
        </div>
      </section>

      <section className="rise" style={{ animationDelay: "200ms" }}>
        <SectionLabel action={<Link to="/products" className="text-[12px] font-semibold text-primary">See all</Link>}>
          {t(lang, "catalogue")}
        </SectionLabel>
        <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
          {state.products.map((p) => (
            <Link key={p.id} to="/products/$id" params={{ id: p.id }} className="w-[150px] shrink-0">
              <div className="frost-tile overflow-hidden">
                <div className="relative">
                  <img
                    src={productImage(p.image)}
                    alt={p.name}
                    loading="lazy"
                    width={640}
                    height={640}
                    className="aspect-square w-full object-cover"
                  />
                  {p.bestSeller ? (
                    <span className="absolute top-2 left-2">
                      <Badge tone="accent">Best seller</Badge>
                    </span>
                  ) : null}
                  {p.stock === 0 ? (
                    <span className="absolute top-2 left-2">
                      <Badge tone="danger">Out of stock</Badge>
                    </span>
                  ) : null}
                </div>
                <div className="p-3">
                  <p className="truncate text-[13px] leading-tight font-semibold">{p.name}</p>
                  <p className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-[13px] font-bold">{inr(p.price)}</span>
                    <span className={p.stock <= p.reorderLevel ? "text-[11px] text-warn" : "text-[11px] text-muted-foreground"}>
                      {p.stock} left
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Card delay={260}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <p className="text-[15px] font-semibold tracking-tight">{t(lang, "askAi")}</p>
          </div>
          <ActionButton onClick={() => setAiOpen(true)} className="grid size-11 place-items-center rounded-full px-0">
            ↑
          </ActionButton>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Find a fair price", "Create an ad", "How can I increase sales?"].map((s) => (
            <button
              key={s}
              onClick={() => setAiOpen(true)}
              className="rounded-full bg-surface-2 px-3 py-1.5 text-[12px] font-medium ring-1 ring-line"
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setAiOpen(true)}
          className="mt-3 flex w-full items-center gap-2 rounded-2xl bg-surface-2 px-3 py-3 text-left ring-1 ring-line"
        >
          <span className="flex-1 text-[13px] text-muted-foreground">{t(lang, "speakPlaceholder")}</span>
          <span className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground">
            <Mic className="size-4" />
          </span>
        </button>
      </Card>

      <AssistantSheet open={aiOpen} onClose={() => setAiOpen(false)} lang={lang} />
    </AppShell>
  );
}
