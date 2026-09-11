import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Card, PageHeader, ProcessingBar, SectionLabel, productImage, ComingSoon } from "@/components/ui-kit";
import { aiService } from "@/services/aiService";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai-studio/image")({
  head: () => ({
    meta: [
      { title: "AI Product Studio — Kalaa Setu" },
      { name: "description", content: "Improve product photos: remove background, fix lighting, crop for marketplaces and social media." },
      { property: "og:title", content: "AI Product Studio" },
      { property: "og:description", content: "Turn a phone photo into a shop-ready product picture." },
    ],
  }),
  component: ImageStudio,
});

const TOOLS = [
  "Remove Background",
  "Improve Lighting",
  "Sharpen",
  "Remove Clutter",
  "White Background",
  "Marketplace Format",
  "Social Media Format",
  "Generate Product Banner",
];

function ImageStudio() {
  const { state } = useApp();
  const [selected, setSelected] = useState(state.products[0]?.image ?? "shawl");
  const [chosen, setChosen] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const apply = async () => {
    if (chosen.length === 0) {
      toast("Pick at least one tool first");
      return;
    }
    setBusy(true);
    setDone(false);
    for (const tool of chosen) {
      await aiService.enhanceImage(tool);
    }
    setBusy(false);
    setDone(true);
    toast.success("Photo improved", { description: `${chosen.length} changes applied.` });
  };

  return (
    <AppShell>
      <PageHeader title="AI Product Studio" subtitle="Make a phone photo look shop-ready" icon={ImageIcon} />

      <Card>
        <SectionLabel>Choose a photo</SectionLabel>
        <div className="flex gap-2">
          {state.products.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelected(p.image); setDone(false); }}
              className={cn("size-14 overflow-hidden rounded-xl ring-1 ring-line", selected === p.image && "ring-2 ring-primary")}
            >
              <img src={productImage(p.image)} alt={p.name} width={64} height={64} className="size-full object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <figure>
            <figcaption className="mb-1.5 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">Before</figcaption>
            <img
              src={productImage(selected)}
              alt="Before"
              width={640}
              height={640}
              className="aspect-square w-full rounded-2xl object-cover brightness-90 contrast-90 saturate-75"
            />
          </figure>
          <figure>
            <figcaption className="mb-1.5 text-[11px] font-bold tracking-wide text-accent uppercase">After</figcaption>
            <img
              src={productImage(selected)}
              alt="After"
              width={640}
              height={640}
              className={cn("aspect-square w-full rounded-2xl object-cover transition-all", done && "brightness-105 contrast-105 saturate-110")}
            />
          </figure>
        </div>
      </Card>

      <Card delay={60}>
        <SectionLabel>Tools</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((tool) => {
            const on = chosen.includes(tool);
            return (
              <button
                key={tool}
                onClick={() => setChosen((c) => (on ? c.filter((x) => x !== tool) : [...c, tool]))}
                className={cn(
                  "rounded-full px-3.5 py-2.5 text-[13px] font-semibold ring-1 ring-line",
                  on ? "bg-primary text-primary-foreground" : "bg-surface-2",
                )}
              >
                {on ? <Check className="mr-1 inline size-3.5" /> : null}
                {tool}
              </button>
            );
          })}
        </div>
        <ActionButton onClick={() => void apply()} className="mt-4 w-full" disabled={busy}>
          {busy ? "AI is working…" : "Apply Changes"}
        </ActionButton>
        {busy ? <div className="mt-3"><ProcessingBar label="Cleaning your photo…" /></div> : null}
        {done ? (
          <p className="mt-3 rounded-2xl bg-good-soft px-4 py-2.5 text-[13px] font-semibold text-good">
            Done — the improved photo is saved with your product.
          </p>
        ) : null}
      </Card>

      <ComingSoon
        title="Real image generation backend"
        note="The demo shows the workflow. A production image model will do the actual editing."
      />
    </AppShell>
  );
}
