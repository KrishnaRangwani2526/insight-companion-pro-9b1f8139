import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AiInsight, Card, Field, PageHeader, SectionLabel, inputClass } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { calculatePnl, type PnlInput } from "@/services/financeService";
import { inr } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance/pnl")({
  head: () => ({
    meta: [
      { title: "Profit & Loss Calculator — Kalaa Setu" },
      { name: "description", content: "Enter your sales and costs to see real profit, margin and the sales you need to break even." },
      { property: "og:title", content: "Profit & Loss calculator" },
      { property: "og:description", content: "Find out what you actually keep after every cost." },
    ],
  }),
  component: PnlPage,
});

const FIELDS: { key: keyof PnlInput; label: string }[] = [
  { key: "revenue", label: "Total sales (₹)" },
  { key: "rawMaterial", label: "Raw material (₹)" },
  { key: "labour", label: "Labour / wages (₹)" },
  { key: "transport", label: "Transport (₹)" },
  { key: "packaging", label: "Packaging (₹)" },
  { key: "rent", label: "Rent (₹)" },
  { key: "utilities", label: "Electricity, water (₹)" },
  { key: "marketing", label: "Marketing (₹)" },
  { key: "other", label: "Other costs (₹)" },
];

function PnlPage() {
  const [form, setForm] = useState<Record<keyof PnlInput, string>>({
    revenue: "52900",
    rawMaterial: "14200",
    labour: "8600",
    transport: "1900",
    packaging: "1200",
    rent: "1500",
    utilities: "700",
    marketing: "900",
    other: "300",
  });

  const result = useMemo(() => {
    const input = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, Number(v) || 0]),
    ) as unknown as PnlInput;
    return { input, ...calculatePnl(input) };
  }, [form]);

  return (
    <AppShell>
      <PageHeader title="Profit & Loss" subtitle="Sales minus every cost — what you actually keep" icon={Receipt} />

      <Card>
        <SectionLabel>
          <Bi>Your numbers</Bi>
        </SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <input
                className={inputClass}
                inputMode="numeric"
                value={form[f.key]}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              />
            </Field>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-muted-foreground">The result updates as you type.</p>
      </Card>

      <Card delay={60}>
        <SectionLabel>
          <Bi>Result</Bi>
        </SectionLabel>
        <p className={cn("font-mono text-[40px] leading-none font-bold", result.netProfit >= 0 ? "text-good" : "text-destructive")}>
          {inr(result.netProfit)}
        </p>
        <p className="mt-1.5 text-[14px] font-semibold text-muted-foreground">
          {result.netProfit >= 0 ? "Profit" : "Loss"} · {result.margin.toFixed(1)}% margin
        </p>

        <div className="mt-4 space-y-2">
          <Row label="Sales" value={inr(result.input.revenue)} />
          <Row label="Variable costs (material, labour, transport, packaging)" value={`− ${inr(result.variable)}`} />
          <Row label="Fixed costs (rent, bills, marketing, other)" value={`− ${inr(result.fixed)}`} />
          <Row label="Total expenses" value={`− ${inr(result.expenses)}`} strong />
        </div>

        <div className="mt-4 rounded-2xl bg-primary-soft p-4">
          <p className="text-[12px] font-semibold text-primary">Break-even sales</p>
          <p className="mt-1 font-mono text-[22px] font-bold text-primary">{inr(result.breakEven)}</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Sell at least this much in a month to cover all your fixed costs.
          </p>
        </div>
      </Card>

      <AiInsight
        title="What to do with this"
        body={
          result.margin < 20
            ? "Your margin is thin. Raising your price a little, or buying raw material in bulk, will improve it faster than selling more pieces."
            : "Your margin is healthy. The fastest growth now comes from selling the same pieces to city buyers who pay more."
        }
        reasons={[
          `Every ₹100 of sales leaves you ₹${result.margin.toFixed(0)}`,
          `Fixed costs of ${inr(result.fixed)} must be covered before any profit starts`,
          "Bulk raw-material purchase in one trip cuts transport cost per piece",
        ]}
      />
    </AppShell>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className={cn("text-[13px]", strong ? "font-semibold" : "text-muted-foreground")}>{label}</span>
      <span className={cn("shrink-0 font-mono text-[14px]", strong && "font-bold")}>{value}</span>
    </div>
  );
}
