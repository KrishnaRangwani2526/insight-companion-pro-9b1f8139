import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Store, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Card, Field, PageHeader, ProcessingBar, SectionLabel, inputClass, productImage } from "@/components/ui-kit";
import { useApp } from "@/lib/store";
import type { StoreConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/store/create")({
  head: () => ({
    meta: [
      { title: "Create My Store — Kalaa Setu" },
      { name: "description", content: "Build your online shop from your business details and catalogue in one tap." },
      { property: "og:title", content: "Create your online store" },
      { property: "og:description", content: "Pick a look, confirm your address and publish." },
    ],
  }),
  component: CreateStore,
});

const THEMES: { key: StoreConfig["theme"]; label: string; note: string; swatch: string }[] = [
  { key: "artisan", label: "Artisan", note: "Warm, handmade feel", swatch: "bg-accent" },
  { key: "minimal", label: "Minimal", note: "Clean and simple", swatch: "bg-foreground" },
  { key: "traditional", label: "Traditional", note: "Cultural patterns", swatch: "bg-warn" },
  { key: "modern", label: "Modern", note: "Bold and current", swatch: "bg-primary" },
  { key: "local", label: "Local", note: "Village shop style", swatch: "bg-good" },
];

const STEPS = ["Collecting your business details", "Adding your products and photos", "Setting prices and stock", "Building your shop pages"];

function CreateStore() {
  const { state, update } = useApp();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<StoreConfig["theme"]>(state.store.theme);
  const [slug, setSlug] = useState(state.store.slug);
  const [tagline, setTagline] = useState(state.store.tagline);
  const [whatsapp, setWhatsapp] = useState(state.store.whatsapp);
  const [step, setStep] = useState(-1);

  const build = async () => {
    for (let i = 0; i < STEPS.length; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 700));
    }
    update({
      store: {
        published: true,
        slug: slug || "my-shop",
        theme,
        tagline,
        whatsapp,
        featured: state.products.slice(0, 3).map((p) => p.id),
      },
    });
    toast.success("Your shop is live!", { description: `${slug}.business.com is ready to share.` });
    void navigate({ to: "/store/preview" });
  };

  return (
    <AppShell>
      <PageHeader title="Create My Store" subtitle="We use what you have already added" icon={Store} />

      <Card>
        <SectionLabel>Choose a look</SectionLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {THEMES.map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className={cn("frost-tile p-3.5 text-left", theme === t.key && "ring-2 ring-primary")}
            >
              <span className={cn("block size-8 rounded-xl", t.swatch)} />
              <span className="mt-2 block text-[14px] font-semibold">
                {t.label}
                {theme === t.key ? <Check className="ml-1 inline size-3.5 text-primary" /> : null}
              </span>
              <span className="block text-[12px] text-muted-foreground">{t.note}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card delay={60}>
        <SectionLabel>Your shop details</SectionLabel>
        <div className="space-y-3">
          <Field label="Shop address" hint="Demo address — a real one is set up when you go live">
            <div className="flex items-center gap-2">
              <input className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())} />
              <span className="shrink-0 font-mono text-[13px] text-muted-foreground">.business.com</span>
            </div>
          </Field>
          <Field label="One line about your shop">
            <input className={inputClass} value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </Field>
          <Field label="WhatsApp number for orders">
            <input className={inputClass} inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card delay={120}>
        <SectionLabel>Products that will appear</SectionLabel>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {state.products.map((p) => (
            <img
              key={p.id}
              src={productImage(p.image)}
              alt={p.name}
              width={96}
              height={96}
              loading="lazy"
              className="size-20 shrink-0 rounded-xl object-cover"
            />
          ))}
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">
          {state.products.length} products with prices, photos and descriptions.
        </p>
      </Card>

      {step >= 0 ? (
        <Card>
          <ol className="space-y-2.5">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-[14px]">
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full text-[12px] font-bold",
                    i < step ? "bg-good text-background" : i === step ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground",
                  )}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                <span className={i <= step ? "font-semibold" : "text-muted-foreground"}>{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3">
            <ProcessingBar label="Building your shop…" />
          </div>
        </Card>
      ) : (
        <ActionButton className="w-full" onClick={() => void build()}>
          Create My Store
        </ActionButton>
      )}
    </AppShell>
  );
}
