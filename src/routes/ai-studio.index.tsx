import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Image, Mic, Wand2, IndianRupee, Megaphone, Video, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, RowLink, SectionLabel, AiInsight } from "@/components/ui-kit";

export const Route = createFileRoute("/ai-studio/")({
  head: () => ({
    meta: [
      { title: "AI Studio — Kalaa Setu" },
      { name: "description", content: "Clean up product photos, turn your voice into listings, set fair prices and create marketing content." },
      { property: "og:title", content: "AI Studio — photos, listings, prices, content" },
      { property: "og:description", content: "Every AI tool for your craft business in one place." },
    ],
  }),
  component: AiStudio,
});

function AiStudio() {
  return (
    <AppShell>
      <PageHeader title="AI Studio" subtitle="Let AI do the typing, designing and pricing" icon={Sparkles} />

      <AiInsight
        title="Today's suggestion"
        score={82}
        body="Your Handwoven Cotton Shawl photo is dark. Cleaning the lighting usually lifts online sales by about a fifth."
        reasons={[
          "Buyers scroll past dim photos",
          "Marketplaces prefer white backgrounds",
          "Your shawl already sells 2.4× faster than other products",
        ]}
      />

      <section>
        <SectionLabel>Make your product look good</SectionLabel>
        <div className="space-y-2.5">
          <RowLink icon={Image} label="AI Product Studio" sub="Remove background, fix lighting, make marketplace photos" to="/ai-studio/image" />
          <RowLink icon={Mic} label="Voice Cataloguing" sub="Speak in your language, get a full listing" to="/ai-studio/catalog" />
          <RowLink icon={IndianRupee} label="Fair Price Assistant" sub="Cost, market and demand based price" to="/ai-studio/pricing" />
        </div>
      </section>

      <section>
        <SectionLabel>Make content</SectionLabel>
        <div className="space-y-2.5">
          <RowLink icon={Wand2} label="Content Transformer" sub="Turn any text, photo or voice note into posts, videos, reports" to="/ai-studio/content" />
          <RowLink icon={Megaphone} label="Advertisement Generator" sub="Headline, offer, caption and WhatsApp message" to="/marketing/advertisement" />
          <RowLink icon={Video} label="Reel Generator" sub="Scene-by-scene plan for a 20 second reel" to="/marketing/reel" />
          <RowLink icon={FileText} label="Marketing hub" sub="Posters, catalogues, blogs and more" to="/marketing" />
        </div>
      </section>
    </AppShell>
  );
}
