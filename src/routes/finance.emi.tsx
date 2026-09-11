import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, Field, PageHeader, SectionLabel, inputClass } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { calculateEmi } from "@/services/financeService";
import { inr } from "@/lib/store";

export const Route = createFileRoute("/finance/emi")({
  head: () => ({
    meta: [
      { title: "EMI Calculator — Kalaa Setu" },
      { name: "description", content: "See your monthly instalment, total interest and when the first payment starts after the moratorium." },
      { property: "og:title", content: "EMI calculator with moratorium" },
      { property: "og:description", content: "Know your monthly payment before you take the loan." },
    ],
  }),
  component: EmiPage,
});

function EmiPage() {
  const [loan, setLoan] = useState("450000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("7");
  const [moratorium, setMoratorium] = useState("6");

  const r = useMemo(
    () => calculateEmi(Number(loan) || 0, Number(rate) || 0, Number(years) || 1, Number(moratorium) || 0),
    [loan, rate, years, moratorium],
  );

  return (
    <AppShell>
      <PageHeader title="EMI Calculator" subtitle="What you will pay every month" icon={Calculator} />

      <Card>
        <SectionLabel>
          <Bi>Loan details</Bi>
        </SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Loan amount (₹)">
            <input className={inputClass} inputMode="numeric" value={loan} onChange={(e) => setLoan(e.target.value)} />
          </Field>
          <Field label="Interest (% a year)">
            <input className={inputClass} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
          </Field>
          <Field label="Repayment (years)">
            <input className={inputClass} inputMode="numeric" value={years} onChange={(e) => setYears(e.target.value)} />
          </Field>
          <Field label="No-payment period (months)">
            <input className={inputClass} inputMode="numeric" value={moratorium} onChange={(e) => setMoratorium(e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card delay={60}>
        <SectionLabel>
          <Bi>Your monthly instalment</Bi>
        </SectionLabel>
        <p className="font-mono text-[42px] leading-none font-bold text-primary">{inr(Math.round(r.emi))}</p>
        <p className="mt-1.5 text-[13px] text-muted-foreground">every month for {r.months} months</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Box label="If you pay every 3 months" value={inr(Math.round(r.quarterly))} />
          <Box label="Total interest" value={inr(Math.round(r.totalInterest))} />
          <Box label="Total you repay" value={inr(Math.round(r.totalRepayment))} />
          <Box label="Interest during no-payment period" value={inr(Math.round(r.moratoriumInterest))} />
        </div>
      </Card>

      <Card delay={120}>
        <SectionLabel>
          <Bi>Your timeline</Bi>
        </SectionLabel>
        <ol className="space-y-3">
          <Step n="1" title="Loan received" note="Money reaches your account" />
          <Step n="2" title={`${moratorium} months with no instalment`} note="Use this time to build stock and start selling" />
          <Step n="3" title={`First instalment in ${r.firstPaymentLabel}`} note={`${inr(Math.round(r.emi))} every month`} />
          <Step n="4" title="Loan closed" note={`After ${r.months} instalments`} />
        </ol>
        <p className="mt-4 rounded-2xl bg-surface-2 px-4 py-3 text-[12px] leading-relaxed text-muted-foreground">
          Estimated based on the scheme parameters entered.
        </p>
      </Card>
    </AppShell>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-3.5">
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-[16px] font-bold">{value}</p>
    </div>
  );
}

function Step({ n, title, note }: { n: string; title: string; note: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-mono text-[13px] font-bold text-primary-foreground">
        {n}
      </span>
      <span>
        <span className="block text-[14px] font-semibold">{title}</span>
        <span className="block text-[12px] text-muted-foreground">{note}</span>
      </span>
    </li>
  );
}
