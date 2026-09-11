import { createFileRoute } from "@tanstack/react-router";
import { Users, Star } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AiInsight, Badge, Card, ComingSoon, PageHeader, SectionLabel, StatCard } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { COMPETITORS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/advisor/competitors")({
  head: () => ({
    meta: [
      { title: "Competitor Mapping — Kalaa Setu" },
      { name: "description", content: "See who else sells what you sell nearby, what they charge and where you can stand apart." },
      { property: "og:title", content: "Competitor mapping" },
      { property: "og:description", content: "Know your neighbours in the market before you set your price." },
    ],
  }),
  component: CompetitorsPage,
});

function CompetitorsPage() {
  const [active, setActive] = useState<string | null>(null);
  const direct = COMPETITORS.filter((c) => c.type === "Direct").length;

  return (
    <AppShell>
      <PageHeader title="Competitor Mapping" subtitle="Who else sells what you sell" icon={Users} />

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Nearby sellers" value={String(COMPETITORS.length)} hint="Within 10 km" />
        <StatCard label="Direct" value={String(direct)} hint="Same products" tone="warn" />
        <StatCard label="Indirect" value={String(COMPETITORS.length - direct)} hint="Similar buyers" tone="accent" />
      </div>

      <Card delay={60}>
        <SectionLabel>
          <Bi>Map around you</Bi>
        </SectionLabel>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-line">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:28px_28px]" />
          <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-4 ring-primary/20">
            You
          </span>
          {COMPETITORS.map((c) => (
            <button
              key={c.name}
              onClick={() => setActive(active === c.name ? null : c.name)}
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-line transition-transform",
                c.type === "Direct" ? "bg-warn-soft text-warn" : "bg-surface text-muted-foreground",
                active === c.name && "scale-110 ring-2 ring-primary",
              )}
            >
              {c.distance}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">Tap a pin to see that seller below.</p>
      </Card>

      <Card delay={120}>
        <SectionLabel>
          <Bi>Sellers near you</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          {COMPETITORS.map((c) => (
            <button
              key={c.name}
              onClick={() => setActive(active === c.name ? null : c.name)}
              className={cn("frost-tile w-full p-3.5 text-left", active === c.name && "ring-2 ring-primary")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-semibold">{c.name}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    {c.category} · {c.distance}
                  </p>
                </div>
                <Badge tone={c.type === "Direct" ? "warn" : "muted"}>{c.type}</Badge>
              </div>
              <div className="mt-2 flex items-center justify-between text-[12px]">
                <span className="font-mono font-semibold">{c.price}</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Star className="size-3.5 fill-warn text-warn" /> {c.rating}
                </span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <AiInsight
        title="How to stand apart"
        body="Three sellers offer products like yours, but none of them tell the story of who made the piece. Your name, your village and your process are things a factory cannot copy."
        reasons={[
          "Rangoli Craft Emporium charges up to ₹2,400 — proof that buyers pay more for presentation",
          "None of them sell online, so an online store is open ground",
          "The weekly haat competes on price only; avoid competing there",
        ]}
      />

      <ComingSoon title="Live competitor prices and reviews" note="Pins and prices are demo data. Real local business intelligence is being connected." />
    </AppShell>
  );
}
