import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, MapPin, Star, Search, Instagram } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Badge, Card, ComingSoon, PageHeader, Progress, SectionLabel } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/presence")({
  head: () => ({
    meta: [
      { title: "Get Found Online — Kalaa Setu" },
      { name: "description", content: "Improve how easily buyers find your business on maps, search and social media." },
      { property: "og:title", content: "Get found online" },
      { property: "og:description", content: "A simple score and clear steps to be visible to buyers." },
    ],
  }),
  component: PresencePage,
});

const CHECKS = [
  { label: "Online shop published", done: true, icon: Globe },
  { label: "Business listed on maps", done: false, icon: MapPin },
  { label: "Photos added to your listing", done: false, icon: Star },
  { label: "Business name easy to search", done: true, icon: Search },
  { label: "Social page linked", done: false, icon: Instagram },
];

function PresencePage() {
  const { state } = useApp();
  const done = CHECKS.filter((c) => c.done).length + (state.store.published ? 0 : -1);
  const score = Math.max(10, Math.round((done / CHECKS.length) * 100));

  return (
    <AppShell>
      <PageHeader title="Get Found Online" subtitle="Can buyers find you when they search?" icon={Globe} />

      <Card>
        <SectionLabel>
          <Bi>Your visibility score</Bi>
        </SectionLabel>
        <div className="flex items-end gap-2">
          <span className="font-mono text-[44px] leading-none font-bold text-primary">{score}</span>
          <span className="pb-1 text-[15px] font-semibold text-muted-foreground">/100</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={score} tone={score > 60 ? "good" : "warn"} />
          <span className="text-[12px] font-semibold text-muted-foreground">{done}/{CHECKS.length} done</span>
        </div>
      </Card>

      <Card delay={60}>
        <SectionLabel>
          <Bi>What to do next</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          {CHECKS.map((c) => (
            <div key={c.label} className="frost-tile flex items-center gap-3 p-3.5">
              <c.icon className={`size-[18px] shrink-0 ${c.done ? "text-good" : "text-muted-foreground"}`} />
              <span className="flex-1 text-[14px] font-medium">{c.label}</span>
              {c.done ? (
                <Badge tone="good">Done</Badge>
              ) : (
                <button
                  onClick={() => toast("We will guide you through this step", { description: c.label })}
                  className="rounded-xl bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground"
                >
                  Fix it
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card delay={120}>
        <SectionLabel>
          <Bi>Free promotion</Bi>
        </SectionLabel>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Send us your products and reels — we post them on our own social pages at no cost, so new buyers discover your
          craft.
        </p>
        <Link
          to="/marketing"
          className="mt-3 flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground"
        >
          Send something to post
        </Link>
        <ActionButton variant="soft" className="mt-2 w-full" onClick={() => toast("Saved — we will contact you about your own page")}>
          I want help with my own Instagram page
        </ActionButton>
      </Card>

      <ComingSoon
        title="Google Business Profile and direct social publishing"
        note="Map listings and posting straight to your own accounts are being built."
      />
    </AppShell>
  );
}
