import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/AppShell";
import { AiInsight, Badge, Card, PageHeader, ProcessingBar, SectionLabel, productImage } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { DEMAND_FORECAST } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import { inventoryService } from "@/services/inventoryService";

export const Route = createFileRoute("/inventory/forecast")({
  head: () => ({
    meta: [
      { title: "Demand Predictor — Kalaa Setu" },
      { name: "description", content: "See which products will run out, what season is coming and how much stock to prepare." },
      { property: "og:title", content: "AI Demand Predictor" },
      { property: "og:description", content: "Know what to make before the demand arrives." },
    ],
  }),
  component: ForecastPage,
});

type Row = Awaited<ReturnType<typeof inventoryService.forecast>>[number];

function ForecastPage() {
  const { state } = useApp();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let alive = true;
    void inventoryService.forecast(state.products).then((r) => {
      if (alive) setRows(r);
    });
    return () => {
      alive = false;
    };
  }, [state.products]);

  return (
    <AppShell>
      <PageHeader title="Demand Predictor" subtitle="What to make next, and how much" icon={TrendingUp} />

      <Card>
        <SectionLabel>
          <Bi>Expected demand</Bi>
        </SectionLabel>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DEMAND_FORECAST} margin={{ left: -22, right: 6, top: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} width={36} />
              <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid var(--color-line)", fontSize: 12 }} />
              <Line type="monotone" dataKey="actual" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="predicted" stroke="var(--color-accent)" strokeWidth={2.5} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">
          Solid line is what already sold. Dotted line is what we expect.
        </p>
      </Card>

      <Card delay={60}>
        <SectionLabel>
          <Bi>How long your stock lasts</Bi>
        </SectionLabel>
        {!rows ? (
          <ProcessingBar label="Looking at your sales pattern…" />
        ) : (
          <div className="space-y-2.5">
            {rows.map((r) => (
              <div key={r.product.id} className="frost-tile flex items-center gap-3 p-3">
                <img
                  src={productImage(r.product.image)}
                  alt={r.product.name}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="size-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold">{r.product.name}</p>
                  <p className="text-[12px] text-muted-foreground">
                    About {r.weeksLeft} weeks of stock left
                  </p>
                </div>
                <Badge tone={r.weeksLeft < 2 ? "danger" : r.weeksLeft < 5 ? "warn" : "good"}>
                  {r.weeksLeft < 2 ? "Make now" : r.weeksLeft < 5 ? "Make soon" : "Enough"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AiInsight
        title="Season ahead"
        score={88}
        body="Festival demand starts in about six weeks. Shawls and dupattas usually sell nearly twice as fast in that period."
        reasons={[
          "Last year your October sales were 1.9× September",
          "Gift buyers order in bulk before Diwali",
          "Raw cotton is cheaper now than it will be in October",
        ]}
      />
    </AppShell>
  );
}
