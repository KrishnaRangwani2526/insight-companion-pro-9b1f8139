import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { AiInsight, Card, PageHeader, SectionLabel, StatCard } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { MONTHLY_SALES } from "@/lib/demo-data";
import { useApp, inr } from "@/lib/store";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Kalaa Setu" },
      { name: "description", content: "See which products sell, where your buyers are and how your sales change month to month." },
      { property: "og:title", content: "Business analytics" },
      { property: "og:description", content: "Simple charts that show what is working in your business." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { state } = useApp();
  const totalSales = MONTHLY_SALES.reduce((s, m) => s + m.revenue, 0);
  const bestMonth = [...MONTHLY_SALES].sort((a, b) => b.revenue - a.revenue)[0];
  const productData = state.products.map((p) => ({ name: p.name.split(" ")[0] ?? p.name, sold: p.sold }));
  const best = [...state.products].sort((a, b) => b.sold - a.sold)[0];

  return (
    <AppShell>
      <PageHeader title="Analytics" subtitle="What is working and what needs attention" icon={BarChart3} />

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Sales (6 months)" value={inr(totalSales)} hint="+18% vs last period" tone="good" />
        <StatCard label="Best month" value={bestMonth?.month ?? "—"} hint={inr(bestMonth?.revenue ?? 0)} tone="primary" />
        <StatCard label="Pieces sold" value={String(state.products.reduce((s, p) => s + p.sold, 0))} hint="All products" />
        <StatCard label="Top product" value={best?.name.split(" ")[0] ?? "—"} hint={`${best?.sold ?? 0} sold`} tone="accent" />
      </div>

      <Card delay={60}>
        <SectionLabel>
          <Bi>Sales</Bi>
        </SectionLabel>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_SALES} margin={{ left: -18, right: 6, top: 6 }}>
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} width={52} />
              <Tooltip
                formatter={(v: number) => inr(v)}
                contentStyle={{ borderRadius: 14, border: "1px solid var(--color-line)", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#salesFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card delay={120}>
        <SectionLabel>
          <Bi>Products</Bi>
        </SectionLabel>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData} margin={{ left: -22, right: 6, top: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} width={40} />
              <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid var(--color-line)", fontSize: 12 }} />
              <Bar dataKey="sold" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <AiInsight
        title="What this means"
        body={`${best?.name ?? "Your top product"} brings most of your income, and sales rise sharply from October. Making more stock before the festival season is the single biggest thing you can do this year.`}
        reasons={[
          "October–December is 46% of your yearly sales",
          "City buyers pay more than local buyers for the same piece",
          "Two products have not sold in 30 days — consider a discount or a bundle",
        ]}
      />
    </AppShell>
  );
}
