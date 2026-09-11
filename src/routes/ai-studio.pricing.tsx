import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, AiInsight, Card, Field, PageHeader, ProcessingBar, SectionLabel, inputClass } from "@/components/ui-kit";
import { pricingService, type PricingResult } from "@/services/pricingService";
import { useApp, inr } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai-studio/pricing")({
  head: () => ({
    meta: [
      { title: "Fair Price Assistant — Kalaa Setu" },
      { name: "description", content: "Work out a fair price from your costs, the local market and demand — with the profit you keep." },
      { property: "og:title", content: "Fair Price Assistant" },
      { property: "og:description", content: "Minimum, recommended and premium prices for your handmade product." },
    ],
  }),
  component: PricingPage,
});

const MARKETS = [
  { key: "village", label: "My village" },
  { key: "district", label: "District town" },
  { key: "city", label: "Big city" },
  { key: "online", label: "Online" },
] as const;

function PricingPage() {
  const { state, updateProduct } = useApp();
  const [productId, setProductId] = useState(state.products[0]?.id ?? "");
  const [form, setForm] = useState({ raw: "380", labour: "300", packaging: "50", transport: "50", margin: "40" });
  const [market, setMarket] = useState<(typeof MARKETS)[number]["key"]>("city");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PricingResult | null>(null);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const run = async () => {
    setBusy(true);
    const res = await pricingService.suggestPrice({
      rawMaterial: Number(form.raw),
      labour: Number(form.labour),
      packaging: Number(form.packaging),
      transport: Number(form.transport),
      marginPercent: Number(form.margin),
      market,
    });
    setResult(res);
    setBusy(false);
  };

  return (
    <AppShell>
      <PageHeader title="Fair Price Assistant" subtitle="What should you charge? Let's work it out." icon={IndianRupee} />

      <Card>
        <SectionLabel>Your product</SectionLabel>
        <select className={inputClass} value={productId} onChange={(e) => setProductId(e.target.value)}>
          {state.products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field label="Raw material (₹)">
            <input className={inputClass} inputMode="numeric" value={form.raw} onChange={(e) => set({ raw: e.target.value })} />
          </Field>
          <Field label="Your labour (₹)">
            <input className={inputClass} inputMode="numeric" value={form.labour} onChange={(e) => set({ labour: e.target.value })} />
          </Field>
          <Field label="Packaging (₹)">
            <input className={inputClass} inputMode="numeric" value={form.packaging} onChange={(e) => set({ packaging: e.target.value })} />
          </Field>
          <Field label="Transport (₹)">
            <input className={inputClass} inputMode="numeric" value={form.transport} onChange={(e) => set({ transport: e.target.value })} />
          </Field>
          <Field label="Margin you want (%)">
            <input className={inputClass} inputMode="numeric" value={form.margin} onChange={(e) => set({ margin: e.target.value })} />
          </Field>
        </div>

        <p className="mt-4 mb-2 text-[13px] font-semibold">Where will you sell?</p>
        <div className="flex flex-wrap gap-2">
          {MARKETS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMarket(m.key)}
              className={cn(
                "rounded-full px-3.5 py-2.5 text-[13px] font-semibold ring-1 ring-line",
                market === m.key ? "bg-primary text-primary-foreground" : "bg-surface-2",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <ActionButton onClick={() => void run()} className="mt-4 w-full" disabled={busy}>
          {busy ? "Checking the market…" : "Find fair price"}
        </ActionButton>
        {busy ? <div className="mt-3"><ProcessingBar label="Comparing your costs with local prices…" /></div> : null}
      </Card>

      {result ? (
        <>
          <Card delay={60}>
            <SectionLabel>Suggested fair price</SectionLabel>
            <p className="font-mono text-[44px] leading-none font-bold text-primary">{inr(result.recommended)}</p>
            <p className="mt-2 text-[14px] font-semibold text-good">
              You keep {inr(result.profit)} profit on every piece
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Tier label="Minimum" value={inr(result.minimum)} note="Do not sell below this" />
              <Tier label="Recommended" value={inr(result.recommended)} note="Best balance" highlight />
              <Tier label="Premium" value={inr(result.premium)} note="Gift and export buyers" />
            </div>
            <div className="mt-4 rounded-2xl bg-surface-2 p-3">
              <p className="text-[12px] font-semibold text-muted-foreground">Local market range</p>
              <p className="mt-1 font-mono text-[15px] font-bold">
                {inr(result.marketLow)} – {inr(result.marketHigh)}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ActionButton
                onClick={() => {
                  if (productId) updateProduct(productId, { price: result.recommended });
                  toast.success("Price updated", { description: "Your store shows the new price immediately." });
                }}
              >
                Use this price
              </ActionButton>
              <ActionButton variant="soft" onClick={() => { toast("Market comparison ready below"); }}>
                Compare market
              </ActionButton>
            </div>
          </Card>

          <AiInsight
            title="Why this price?"
            body={`Your total cost is ${inr(result.cost)} per piece. This price keeps you profitable while staying inside what buyers in that market already pay.`}
            reasons={result.reasons}
          />
        </>
      ) : null}
    </AppShell>
  );
}

function Tier({ label, value, note, highlight }: { label: string; value: string; note: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-2xl p-3", highlight ? "bg-primary-soft ring-2 ring-primary" : "bg-surface-2")}>
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-mono text-[16px] font-bold", highlight && "text-primary")}>{value}</p>
      <p className="mt-1 text-[10px] text-muted-foreground">{note}</p>
    </div>
  );
}
