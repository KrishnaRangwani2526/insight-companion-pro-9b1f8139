import { createFileRoute, Link } from "@tanstack/react-router";
import { Palette, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Card, Field, PageHeader, SectionLabel, inputClass, productImage } from "@/components/ui-kit";
import { useApp } from "@/lib/store";
import type { StoreConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/store/customize")({
  head: () => ({
    meta: [
      { title: "Customise My Store — Kalaa Setu" },
      { name: "description", content: "Change your shop's theme, tagline, featured products, contact details and social links." },
      { property: "og:title", content: "Customise your online store" },
      { property: "og:description", content: "Make the shop look and sound like your business." },
    ],
  }),
  component: CustomizeStore,
});

const THEMES: { key: StoreConfig["theme"]; label: string; swatch: string }[] = [
  { key: "artisan", label: "Artisan", swatch: "bg-accent" },
  { key: "minimal", label: "Minimal", swatch: "bg-foreground" },
  { key: "traditional", label: "Traditional", swatch: "bg-warn" },
  { key: "modern", label: "Modern", swatch: "bg-primary" },
  { key: "local", label: "Local", swatch: "bg-good" },
];

function CustomizeStore() {
  const { state, update } = useApp();
  const [draft, setDraft] = useState(state.store);
  const [about, setAbout] = useState(state.business.about);

  const toggleFeatured = (id: string) =>
    setDraft((d) => ({
      ...d,
      featured: d.featured.includes(id) ? d.featured.filter((f) => f !== id) : [...d.featured, id],
    }));

  const save = () => {
    update({ store: draft, business: { ...state.business, about } });
    toast.success("Shop updated", { description: "Buyers see the change immediately." });
  };

  return (
    <AppShell>
      <PageHeader title="Change the look" subtitle="Make the shop feel like your business" icon={Palette} />

      <Card>
        <SectionLabel>Theme</SectionLabel>
        <div className="flex flex-wrap gap-2.5">
          {THEMES.map((t) => (
            <button
              key={t.key}
              onClick={() => setDraft({ ...draft, theme: t.key })}
              className={cn("frost-tile flex items-center gap-2 px-3 py-2.5", draft.theme === t.key && "ring-2 ring-primary")}
            >
              <span className={cn("size-5 rounded-lg", t.swatch)} />
              <span className="text-[13px] font-semibold">{t.label}</span>
              {draft.theme === t.key ? <Check className="size-3.5 text-primary" /> : null}
            </button>
          ))}
        </div>
      </Card>

      <Card delay={60}>
        <SectionLabel>Shop text</SectionLabel>
        <div className="space-y-3">
          <Field label="Tagline">
            <input className={inputClass} value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} />
          </Field>
          <Field label="About your business">
            <textarea rows={4} className={inputClass + " py-3"} value={about} onChange={(e) => setAbout(e.target.value)} />
          </Field>
          <Field label="WhatsApp number">
            <input className={inputClass} inputMode="tel" value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card delay={120}>
        <SectionLabel>Featured on the front page</SectionLabel>
        <div className="grid grid-cols-3 gap-2.5">
          {state.products.map((p) => {
            const on = draft.featured.includes(p.id);
            return (
              <button key={p.id} onClick={() => toggleFeatured(p.id)} className={cn("overflow-hidden rounded-xl ring-1 ring-line", on && "ring-2 ring-primary")}>
                <img src={productImage(p.image)} alt={p.name} width={128} height={128} loading="lazy" className="aspect-square w-full object-cover" />
                <span className="block truncate px-2 py-1.5 text-[11px] font-semibold">{on ? "✓ " : ""}{p.name}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <ActionButton onClick={save}>Save changes</ActionButton>
        <Link
          to="/store/preview"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-surface-2 text-[15px] font-semibold ring-1 ring-line"
        >
          See my shop
        </Link>
      </div>
    </AppShell>
  );
}
