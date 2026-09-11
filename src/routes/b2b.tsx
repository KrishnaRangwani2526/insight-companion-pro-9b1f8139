import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, ExternalLink, GraduationCap } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Badge, Card, PageHeader, SectionLabel, Sheet } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";

export const Route = createFileRoute("/b2b")({
  head: () => ({
    meta: [
      { title: "B2B Marketplace — Kalaa Setu" },
      { name: "description", content: "Reach bigger buyers: national marketplaces, government platforms and bulk buyers near you." },
      { property: "og:title", content: "Sell to bigger marketplaces" },
      { property: "og:description", content: "Amazon, Flipkart, government and Indian B2B platforms, explained simply." },
    ],
  }),
  component: B2bPage,
});

const PLACES = [
  { name: "Amazon Karigar", note: "National buyers, handmade section", need: "GST or Udyam number, product photos", status: "Coming soon" },
  { name: "Flipkart Samarth", note: "Programme for artisans and weavers", need: "Bank account, ID proof", status: "Coming soon" },
  { name: "Government e-Marketplace", note: "Sell to government departments", need: "Udyam registration", status: "Coming soon" },
  { name: "IndiaMART / TradeIndia", note: "Bulk enquiries from shops and exporters", need: "Product list with prices", status: "Coming soon" },
  { name: "Local bulk buyers", note: "Emporiums, hotels and gift shops near you", need: "Nothing — we can introduce you", status: "Available" },
];

function B2bPage() {
  const [open, setOpen] = useState<string | null>(null);
  const active = PLACES.find((p) => p.name === open);

  return (
    <AppShell>
      <PageHeader title="Bigger Marketplaces" subtitle="Sell beyond your village" icon={Building2} />

      <Card>
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          These platforms bring buyers from all over India. Each one needs a few documents. We tell you exactly what to
          prepare, and we teach you how to list.
        </p>
      </Card>

      <section>
        <SectionLabel>
          <Bi>Where you can sell</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          {PLACES.map((p) => (
            <button key={p.name} onClick={() => setOpen(p.name)} className="frost-tile w-full p-3.5 text-left">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold">{p.name}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">{p.note}</p>
                </div>
                <Badge tone={p.status === "Available" ? "good" : "warn"}>{p.status}</Badge>
              </div>
            </button>
          ))}
        </div>
      </section>

      <Card delay={60}>
        <SectionLabel>
          <Bi>Learn to list yourself</Bi>
        </SectionLabel>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Short lessons show you how to open an account, add products and price for bigger platforms.
        </p>
        <Link
          to="/learning"
          className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground"
        >
          <GraduationCap className="size-[18px]" /> Open the lessons
        </Link>
      </Card>

      <Sheet open={!!active} onClose={() => setOpen(null)} title={active?.name ?? ""}>
        {active ? (
          <div className="space-y-3">
            <p className="text-[14px] leading-relaxed">{active.note}</p>
            <div className="frost-tile p-3.5">
              <p className="text-[12px] font-semibold text-muted-foreground">What you need</p>
              <p className="mt-1 text-[14px] font-semibold">{active.need}</p>
            </div>
            {active.status === "Available" ? (
              <ActionButton className="w-full" onClick={() => setOpen(null)}>
                Ask for an introduction
              </ActionButton>
            ) : (
              <div className="frost-tile flex items-start gap-3 p-4">
                <span className="text-[18px]">⏳</span>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Upcoming feature.</span> Direct connection to{" "}
                  {active.name} is being built. For now, the lessons show you how to do it yourself.
                </p>
              </div>
            )}
            <Link
              to="/learning"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-surface-2 text-[15px] font-semibold ring-1 ring-line"
            >
              <ExternalLink className="size-4" /> See the lesson
            </Link>
          </div>
        ) : null}
      </Sheet>
    </AppShell>
  );
}
