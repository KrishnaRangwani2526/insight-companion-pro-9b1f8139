import { createFileRoute } from "@tanstack/react-router";
import { Video, Music, Subtitles, Mic, Hash, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  ActionButton,
  Badge,
  Card,
  ComingSoon,
  PageHeader,
  ProcessingBar,
  SectionLabel,
  inputClass,
} from "@/components/ui-kit";
import { aiService } from "@/services/aiService";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/marketing/reel")({
  head: () => ({
    meta: [
      { title: "Reel Generator — Kalaa Setu" },
      { name: "description", content: "Get a scene-by-scene reel plan with hook, voiceover, subtitles, music and hashtags for your craft." },
      { property: "og:title", content: "Reel Generator for artisans" },
      { property: "og:description", content: "A 20-second reel plan you can shoot on your phone today." },
    ],
  }),
  component: ReelPage,
});

type Reel = Awaited<ReturnType<typeof aiService.generateReelScript>>;

function ReelPage() {
  const { state } = useApp();
  const [productId, setProductId] = useState(state.products[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [reel, setReel] = useState<Reel | null>(null);
  const product = state.products.find((p) => p.id === productId);

  const run = async () => {
    setBusy(true);
    setReel(await aiService.generateReelScript(product?.name ?? "Handmade product"));
    setBusy(false);
  };

  return (
    <AppShell>
      <PageHeader title="Create a Reel" subtitle="We plan it — you just shoot it on your phone" icon={Video} />

      <Card>
        <SectionLabel>Which product?</SectionLabel>
        <select className={inputClass} value={productId} onChange={(e) => setProductId(e.target.value)}>
          {state.products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <ActionButton onClick={() => void run()} className="mt-4 w-full" disabled={busy}>
          {busy ? "Planning your reel…" : "Create reel plan"}
        </ActionButton>
        {busy ? <div className="mt-3"><ProcessingBar label="Choosing scenes and music…" /></div> : null}
      </Card>

      {reel ? (
        <>
          <Card delay={60}>
            <SectionLabel>The idea</SectionLabel>
            <p className="text-[14px] leading-relaxed text-foreground/85">{reel.concept}</p>
            <div className="mt-3 rounded-2xl bg-accent-soft p-3.5">
              <p className="text-[11px] font-bold tracking-wide text-accent uppercase">Opening line (hook)</p>
              <p className="mt-1 text-[15px] font-semibold">{reel.hook}</p>
            </div>
          </Card>

          <Card delay={100}>
            <SectionLabel>Shoot these scenes</SectionLabel>
            <ol className="space-y-2.5">
              {reel.scenes.map((s, i) => (
                <li key={s} className="frost-tile flex items-start gap-3 p-3.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary font-mono text-[12px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-[14px] leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
          </Card>

          <Card delay={140}>
            <SectionLabel>Sound and text</SectionLabel>
            <div className="space-y-2.5">
              <Line icon={Mic} label="Voiceover" text={reel.voiceover} />
              <Line icon={Subtitles} label="Subtitles" text={reel.subtitles} />
              <Line icon={Music} label="Music" text={reel.music} />
              <Line icon={Hash} label="Caption" text={reel.caption} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {reel.hashtags.map((h) => (
                <Badge key={h} tone="primary">{h}</Badge>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ActionButton
                variant="soft"
                onClick={() => {
                  void navigator.clipboard?.writeText(`${reel.caption}\n${reel.hashtags.join(" ")}`);
                  toast.success("Caption copied");
                }}
              >
                <Copy className="mr-1.5 inline size-4" /> Copy caption
              </ActionButton>
              <ActionButton onClick={() => toast.success("Sent for free promotion", { description: "We will post it on our social pages." })}>
                Send to our page
              </ActionButton>
            </div>
          </Card>

          <ComingSoon title="Automatic video editing" note="Right now we give you the plan. Auto-cutting your clips into a finished reel is being built." />
        </>
      ) : null}
    </AppShell>
  );
}

function Line({ icon: Icon, label, text }: { icon: typeof Mic; label: string; text: string }) {
  return (
    <div className="frost-tile flex items-start gap-3 p-3.5">
      <Icon className="mt-0.5 size-[18px] shrink-0 text-primary" />
      <div>
        <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">{label}</p>
        <p className="mt-0.5 text-[14px] leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
