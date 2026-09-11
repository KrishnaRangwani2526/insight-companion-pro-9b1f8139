import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AppShell } from "@/components/AppShell";
import { AiInsight, Card, ComingSoon, PageHeader, SectionLabel, StatCard } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/advisor/market")({
  head: () => ({
    meta: [
      { title: "Local Market Research — Kalaa Setu" },
      { name: "description", content: "Who lives around you, what they buy and which nearby markets are worth your time." },
      { property: "og:title", content: "Local market research" },
      { property: "og:description", content: "Population, buyer types and nearby markets within 5 and 10 km." },
    ],
  }),
  component: MarketPage,
});

const SEGMENTS = [
  { name: "Village households", value: 42, color: "var(--color-primary)" },
  { name: "Town buyers", value: 27, color: "var(--color-accent)" },
  { name: "Tourists & gifting", value: 18, color: "var(--color-good)" },
  { name: "Bulk / shops", value: 13, color: "var(--color-warn)" },
];

const MARKETS = [
  { name: "Kotri Weekly Haat", day: "Every Tuesday", distance: "2.4 km", footfall: "3,000+ people" },
  { name: "Bhilwara Main Bazaar", day: "Daily", distance: "9.1 km", footfall: "12,000+ people" },
  { name: "Craft Emporium, Bhilwara", day: "Mon–Sat", distance: "9.6 km", footfall: "Bulk buyers" },
  { name: "Highway Craft Stalls", day: "Weekends", distance: "6.8 km", footfall: "Tourists" },
];

function MarketPage() {
  const { state } = useApp();
  const [radius, setRadius] = useState<5 | 10>(10);

  return (
    <AppShell>
      <PageHeader title="Local Market Research" subtitle={`Around ${state.business.village}, ${state.business.district}`} icon={MapPin} />

      <div className="flex gap-2">
        {([5, 10] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRadius(r)}
            className={cn(
              "min-h-10 rounded-full px-4 text-[13px] font-semibold ring-1 ring-line",
              radius === r ? "bg-primary text-primary-foreground" : "bg-surface-2",
            )}
          >
            Within {r} km
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="People" value={radius === 5 ? "21,400" : "48,000"} hint="Estimated" tone="primary" />
        <StatCard label="Households" value={radius === 5 ? "4,900" : "11,200"} hint="Estimated" />
        <StatCard label="Likely buyers" value={radius === 5 ? "2,600" : "6,100"} hint="Interested in handmade" tone="good" />
        <StatCard label="Shops selling crafts" value={radius === 5 ? "6" : "14"} hint="Possible partners" tone="accent" />
      </div>

      <Card delay={60}>
        <SectionLabel>
          <Bi>Who your buyers are</Bi>
        </SectionLabel>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={SEGMENTS} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>
                {SEGMENTS.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 14, border: "1px solid var(--color-line)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {SEGMENTS.map((s) => (
            <div key={s.name} className="flex items-center gap-2 text-[12px]">
              <span className="size-2.5 rounded-full" style={{ background: s.color }} />
              <span className="flex-1 truncate text-muted-foreground">{s.name}</span>
              <span className="font-mono font-bold">{s.value}%</span>
            </div>
          ))}
        </div>
      </Card>

      <Card delay={120}>
        <SectionLabel>
          <Bi>Markets near you</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          {MARKETS.map((m) => (
            <div key={m.name} className="frost-tile p-3.5">
              <p className="text-[14px] font-semibold">{m.name}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {m.day} · {m.distance} · {m.footfall}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <AiInsight
        title="Where to sell first"
        body="Most of your income today comes from village households who pay the least. Town buyers and gifting customers are only a short distance away and pay far more for the same piece."
        reasons={[
          "Town buyers are 27% of the market but pay about double",
          "The Tuesday haat gives you weekly cash flow",
          "The craft emporium can take bulk orders before festivals",
        ]}
      />

      <ComingSoon title="Live population and demand data" note="These figures are estimates for the demo. Real census and market data will be connected later." />
    </AppShell>
  );
}
