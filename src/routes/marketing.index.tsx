import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Video, FileText, MessageCircle, Image, BookOpen, Share2, Instagram } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Badge, Card, ComingSoon, PageHeader, RowLink, SectionLabel, TileButton } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/marketing/")({
  head: () => ({
    meta: [
      { title: "Marketing — Kalaa Setu" },
      { name: "description", content: "Create ads, social posts, reels, posters and WhatsApp messages for your craft business in minutes." },
      { property: "og:title", content: "Marketing hub for artisans" },
      { property: "og:description", content: "Ads, reels, posters and free promotion on our social pages." },
    ],
  }),
  component: MarketingPage,
});

function MarketingPage() {
  const { state, update } = useApp();
  const [submitting, setSubmitting] = useState(false);

  const submitToQueue = (kind: "Product" | "Reel" | "Story" | "Festival offer") => {
    setSubmitting(true);
    const item = {
      id: `pr-${Date.now()}`,
      title: `${kind} — ${state.products[0]?.name ?? state.business.name}`,
      kind,
      status: "Pending" as const,
    };
    update({ promotions: [item, ...state.promotions] });
    setSubmitting(false);
    toast.success("Sent for free promotion", {
      description: "Our team reviews it and posts it on our social pages.",
    });
  };

  return (
    <AppShell>
      <PageHeader title="Marketing" subtitle="Tell people about your craft — we help you say it well" icon={Megaphone} />

      <section>
        <SectionLabel>
          <Bi>Create something</Bi>
        </SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <TileButton icon={Megaphone} label="Advertisement" sub="Headline, offer, caption" to="/marketing/advertisement" />
          <TileButton icon={Video} label="Reel" sub="Scene plan + voiceover" to="/marketing/reel" tone="accent" />
          <TileButton icon={MessageCircle} label="WhatsApp message" sub="Ready to forward" to="/ai-studio/content" />
          <TileButton icon={Image} label="Poster / flyer" sub="Festival and offer posters" to="/ai-studio/content" tone="accent" />
          <TileButton icon={BookOpen} label="Blog / story" sub="Your craft story in words" to="/ai-studio/content" />
          <TileButton icon={FileText} label="Catalogue" sub="All products in one PDF" to="/ai-studio/content" tone="accent" />
        </div>
      </section>

      <Card delay={60}>
        <SectionLabel>
          <Bi>Free promotion on our pages</Bi>
        </SectionLabel>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Send us a product photo, a reel or a festival offer. We review it and post it on our own social pages — free of
          cost. Later we can help you run your own page too.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(["Product", "Reel", "Story", "Festival offer"] as const).map((k) => (
            <button
              key={k}
              disabled={submitting}
              onClick={() => submitToQueue(k)}
              className="frost-tile flex items-center gap-2 p-3 text-[14px] font-semibold"
            >
              <Share2 className="size-4 text-primary" /> {k}
            </button>
          ))}
        </div>
      </Card>

      <Card delay={120}>
        <SectionLabel>
          <Bi>Promotion queue</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          {state.promotions.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">Nothing sent yet. Pick something above.</p>
          ) : (
            state.promotions.map((p) => (
              <RowLink
                key={p.id}
                icon={Instagram}
                label={p.title}
                sub={p.kind}
                onClick={() => toast(`Status: ${p.status}`)}
                right={
                  <Badge tone={p.status === "Published" ? "good" : p.status === "Approved" ? "primary" : "warn"}>
                    {p.status}
                  </Badge>
                }
              />
            ))
          )}
        </div>
      </Card>

      <ComingSoon
        title="Posting straight to your Instagram, Facebook and WhatsApp Business"
        note="For now we post on our own pages for you. Direct publishing to your accounts is being built."
      />
    </AppShell>
  );
}
