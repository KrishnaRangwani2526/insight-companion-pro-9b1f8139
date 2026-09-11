import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Calculator, Landmark, Receipt } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader, RowLink, SectionLabel, StatCard } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { MONTHLY_SALES } from "@/lib/demo-data";
import { useApp, inr } from "@/lib/store";
import { inventoryService } from "@/services/inventoryService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance/")({
  head: () => ({
    meta: [
      { title: "Finance — Kalaa Setu" },
      { name: "description", content: "Sales, expenses, profit, pending payments and the money tied up in your stock — in plain numbers." },
      { property: "og:title", content: "Finance for micro-businesses" },
      { property: "og:description", content: "Know your profit, not just your sales." },
    ],
  }),
  component: FinancePage,
});

const RANGES = ["This month", "3 months", "6 months"] as const;

function FinancePage() {
  const { state } = useApp();
  const [range, setRange] = useState<(typeof RANGES)[number]>("6 months");
  const months = range === "This month" ? 1 : range === "3 months" ? 3 : 6;
  const data = MONTHLY_SALES.slice(-months);
  const revenue = data.reduce((s, m) => s + m.revenue, 0);
  const expenses = data.reduce((s, m) => s + m.expenses, 0);
  const profit = revenue - expenses;
  const inv = inventoryService.summary(state.products);
  const pending = state.orders.filter((o) => o.payment === "Cash on delivery" && o.status !== "delivered").reduce((s, o) => s + o.amount, 0);

  return (
    <AppShell>
      <PageHeader title="Finance" subtitle="Where your money comes from and where it goes" icon={Wallet} />

      <div className="flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              "min-h-10 rounded-full px-3.5 text-[13px] font-semibold ring-1 ring-line",
              range === r ? "bg-primary text-primary-foreground" : "bg-surface-2",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Sales" value={inr(revenue)} hint="Money coming in" tone="primary" />
        <StatCard label="Expenses" value={inr(expenses)} hint="Money going out" tone="warn" />
        <StatCard label="Profit" value={inr(profit)} hint={`${Math.round((profit / Math.max(1, revenue)) * 100)}% margin`} tone="good" />
        <StatCard label="Pending payments" value={inr(pending)} hint="Cash on delivery" tone="accent" />
      </div>

      <Card delay={60}>
        <SectionLabel>
          <Bi>Money in and out</Bi>
        </SectionLabel>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -18, right: 6, top: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} width={52} />
              <Tooltip formatter={(v: number) => inr(v)} contentStyle={{ borderRadius: 14, border: "1px solid var(--color-line)", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar name="Sales" dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              <Bar name="Expenses" dataKey="expenses" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 rounded-2xl bg-surface-2 p-3.5">
          <p className="text-[12px] font-semibold text-muted-foreground">Value of stock you are holding</p>
          <p className="mt-1 font-mono text-[18px] font-bold">{inr(inv.value)}</p>
        </div>
      </Card>

      <section>
        <SectionLabel>
          <Bi>Calculators</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          <RowLink icon={Receipt} label="Profit & Loss" sub="Work out your real profit and break-even" to="/finance/pnl" />
          <RowLink icon={Landmark} label="Scheme Calculator" sub="Which government scheme fits your project" to="/finance/scheme" />
          <RowLink icon={Calculator} label="EMI Calculator" sub="Monthly instalment with moratorium period" to="/finance/emi" />
        </div>
      </section>
    </AppShell>
  );
}
