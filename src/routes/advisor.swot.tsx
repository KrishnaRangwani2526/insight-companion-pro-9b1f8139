import { createFileRoute } from "@tanstack/react-router";
import { Grid3x3, ThumbsUp, TriangleAlert, Rocket, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ActionButton, AiInsight, Card, PageHeader, ProcessingBar, SectionLabel } from "@/components/ui-kit";
import { aiService } from "@/services/aiService";

export const Route = createFileRoute("/advisor/swot")({
  head: () => ({
    meta: [
      { title: "SWOT Analysis — Kalaa Setu" },
      { name: "description", content: "Your strengths, weaknesses, opportunities and threats, written in plain language with next steps." },
      { property: "og:title", content: "SWOT analysis for your craft business" },
      { property: "og:description", content: "An honest picture of where your business stands." },
    ],
  }),
  component: SwotPage,
});

type Swot = Awaited<ReturnType<typeof aiService.generateSWOT>>;

function SwotPage() {
  const [swot, setSwot] = useState<Swot | null>(null);
  const [busy, setBusy] = useState(true);

  const run = () => {
    setBusy(true);
    void aiService.generateSWOT().then((s) => {
      setSwot(s);
      setBusy(false);
    });
  };

  useEffect(run, []);

  const blocks = swot
    ? ([
        { title: "Strengths", note: "What you already do well", items: swot.strengths, icon: ThumbsUp, cls: "bg-good-soft text-good" },
        { title: "Weaknesses", note: "What holds you back", items: swot.weaknesses, icon: TriangleAlert, cls: "bg-warn-soft text-warn" },
        { title: "Opportunities", note: "What you can grab", items: swot.opportunities, icon: Rocket, cls: "bg-primary-soft text-primary" },
        { title: "Threats", note: "What to watch out for", items: swot.threats, icon: ShieldAlert, cls: "bg-destructive/12 text-destructive" },
      ] as const)
    : [];

  return (
    <AppShell>
      <PageHeader title="SWOT Analysis" subtitle="Where your business stands today" icon={Grid3x3} />

      {busy ? <ProcessingBar label="Looking at your business…" /> : null}

      {blocks.map((b, i) => (
        <Card key={b.title} delay={i * 50}>
          <div className="flex items-center gap-2.5">
            <span className={`grid size-9 place-items-center rounded-xl ${b.cls}`}>
              <b.icon className="size-[18px]" />
            </span>
            <div>
              <p className="text-[15px] font-semibold">{b.title}</p>
              <p className="text-[12px] text-muted-foreground">{b.note}</p>
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {b.items.map((item) => (
              <li key={item} className="flex gap-2 text-[14px] leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      ))}

      {swot ? (
        <>
          <AiInsight
            title="Your next three steps"
            body="Use your strengths against your biggest weakness: you make a genuine product but sell it at prices set by others. Selling directly online fixes that."
            reasons={[
              "Publish your online store this week — it costs nothing",
              "Raise prices for city buyers by 15–20%",
              "Build stock now for the festival season",
            ]}
          />
          <ActionButton variant="soft" className="w-full" onClick={run}>
            Run the analysis again
          </ActionButton>
        </>
      ) : null}
    </AppShell>
  );
}
