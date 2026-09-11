import { createFileRoute } from "@tanstack/react-router";
import { Compass, MapPin, Users, Grid3x3, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  ActionButton,
  Badge,
  Card,
  Field,
  PageHeader,
  ProcessingBar,
  RowLink,
  SectionLabel,
  inputClass,
} from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { aiService } from "@/services/aiService";
import { CATEGORIES } from "@/lib/demo-data";
import { useApp, inr } from "@/lib/store";

export const Route = createFileRoute("/advisor/")({
  head: () => ({
    meta: [
      { title: "Business Advisor — Kalaa Setu" },
      { name: "description", content: "Check if your business idea will work in your area: demand, competition, pricing, risks and a clear verdict." },
      { property: "og:title", content: "Business feasibility advisor" },
      { property: "og:description", content: "An honest read on your idea before you spend money." },
    ],
  }),
  component: AdvisorPage,
});

type Report = Awaited<ReturnType<typeof aiService.generateFeasibility>>;

function AdvisorPage() {
  const { state } = useApp();
  const b = state.business;
  const [form, setForm] = useState({
    village: b.village,
    block: b.block,
    district: b.district,
    category: b.category,
    capital: "150000",
  });
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  const run = async () => {
    setBusy(true);
    setReport(await aiService.generateFeasibility(form.category, Number(form.capital) || 0));
    setBusy(false);
  };

  return (
    <AppShell>
      <PageHeader title="Business Advisor" subtitle="Will this idea work where you live?" icon={Compass} />

      <Card>
        <SectionLabel>
          <Bi>Tell us about the plan</Bi>
        </SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Village">
            <input className={inputClass} value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} />
          </Field>
          <Field label="Block">
            <input className={inputClass} value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })} />
          </Field>
          <Field label="District">
            <input className={inputClass} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          </Field>
          <Field label="What you make">
            <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c: string) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Money you can invest (₹)">
            <input
              className={inputClass}
              inputMode="numeric"
              value={form.capital}
              onChange={(e) => setForm({ ...form, capital: e.target.value })}
            />
          </Field>
        </div>
        <ActionButton onClick={() => void run()} className="mt-4 w-full" disabled={busy}>
          {busy ? "Studying your area…" : "Check my idea"}
        </ActionButton>
        {busy ? <div className="mt-3"><ProcessingBar label="Looking at demand, competition and prices near you…" /></div> : null}
      </Card>

      {report ? (
        <Card delay={60}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <SectionLabel>
                <Bi>Verdict</Bi>
              </SectionLabel>
              <p className="text-[24px] leading-tight font-bold">{report.verdict}</p>
            </div>
            <span className="font-mono text-[34px] leading-none font-bold text-primary">
              {report.score}
              <span className="text-[14px] text-muted-foreground">/100</span>
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-foreground/85">{report.explanation}</p>

          <div className="mt-4 space-y-2.5">
            <Line label="People you can reach" value={report.reach} />
            <Line label="Demand score" value={`${report.demand}/100`} />
            <Line label="Opportunity" value={report.opportunity} />
            <Line label="Competition" value={report.competitorDensity} />
            <Line label="Prices nearby" value={report.priceRange} />
            <Line label="Money you plan to invest" value={inr(Number(form.capital) || 0)} />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-[13px] font-semibold">Risks to watch</p>
            <ul className="space-y-1.5">
              {report.risks.map((r) => (
                <li key={r} className="flex gap-2 text-[13px] text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warn" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge tone="primary">{form.category}</Badge>
            <Badge tone="muted">{form.village}</Badge>
            <Badge tone="muted">{form.district}</Badge>
          </div>
        </Card>
      ) : null}

      <section>
        <SectionLabel>
          <Bi>Go deeper</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          <RowLink icon={MapPin} label="Local Market Research" sub="Who lives near you and what they buy" to="/advisor/market" />
          <RowLink icon={Users} label="Competitor Mapping" sub="Who else sells what you sell" to="/advisor/competitors" />
          <RowLink icon={Grid3x3} label="SWOT Analysis" sub="Your strengths, weaknesses and chances" to="/advisor/swot" />
          <RowLink icon={Sparkles} label="Ask the AI advisor" sub="Any question about your business" to="/ai-studio/content" />
        </div>
      </section>
    </AppShell>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="frost-tile flex items-start justify-between gap-3 p-3">
      <span className="text-[12px] font-semibold text-muted-foreground">{label}</span>
      <span className="text-right text-[13px] font-semibold">{value}</span>
    </div>
  );
}
