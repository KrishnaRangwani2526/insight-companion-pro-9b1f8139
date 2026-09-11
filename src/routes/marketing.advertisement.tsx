import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  ActionButton,
  Card,
  Field,
  PageHeader,
  ProcessingBar,
  SectionLabel,
  inputClass,
  productImage,
} from "@/components/ui-kit";
import { aiService } from "@/services/aiService";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/marketing/advertisement")({
  head: () => ({
    meta: [
      { title: "Advertisement Generator — Kalaa Setu" },
      { name: "description", content: "Create a ready advertisement for your product: headline, offer text, poster, caption and WhatsApp message." },
      { property: "og:title", content: "Advertisement Generator" },
      { property: "og:description", content: "A complete ad for your handmade product in one tap." },
    ],
  }),
  component: AdPage,
});

type Ad = Awaited<ReturnType<typeof aiService.generateAdvertisement>>;

function AdPage() {
  const { state } = useApp();
  const [productId, setProductId] = useState(state.products[0]?.id ?? "");
  const [offer, setOffer] = useState("Festival offer: free delivery this week.");
  const [audience, setAudience] = useState("City buyers");
  const [busy, setBusy] = useState(false);
  const [ad, setAd] = useState<Ad | null>(null);

  const product = state.products.find((p) => p.id === productId);

  const run = async () => {
    setBusy(true);
    const res = await aiService.generateAdvertisement(product?.name ?? "Handmade product", offer, audience);
    setAd(res);
    setBusy(false);
  };

  const copy = (text: string) => {
    void navigator.clipboard?.writeText(text);
    toast.success("Copied");
  };

  return (
    <AppShell>
      <PageHeader title="Create Advertisement" subtitle="A full ad for your product — written for you" icon={Megaphone} />

      <Card>
        <SectionLabel>Your product</SectionLabel>
        <div className="space-y-3">
          <select className={inputClass} value={productId} onChange={(e) => setProductId(e.target.value)}>
            {state.products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <Field label="Offer (optional)">
            <input className={inputClass} value={offer} onChange={(e) => setOffer(e.target.value)} />
          </Field>
          <Field label="Who should see it?">
            <select className={inputClass} value={audience} onChange={(e) => setAudience(e.target.value)}>
              {["City buyers", "Local buyers", "Bulk buyers", "Tourists", "Gift shoppers"].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </Field>
        </div>
        <ActionButton onClick={() => void run()} className="mt-4 w-full" disabled={busy}>
          {busy ? "Writing your ad…" : "Create advertisement"}
        </ActionButton>
        {busy ? <div className="mt-3"><ProcessingBar label="Choosing the right words for your buyers…" /></div> : null}
      </Card>

      {ad && product ? (
        <>
          <Card delay={60} className="overflow-hidden p-0">
            <img
              src={productImage(product.image)}
              alt={product.name}
              width={640}
              height={640}
              loading="lazy"
              className="h-52 w-full object-cover"
            />
            <div className="p-5">
              <p className="text-[19px] leading-tight font-bold">{ad.headline}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground/85">{ad.primary}</p>
              <ActionButton className="mt-4 w-full" onClick={() => copy(`${ad.headline}\n\n${ad.primary}`)}>
                {ad.cta}
              </ActionButton>
            </div>
          </Card>

          {(
            [
              ["Poster text", ad.poster],
              ["Social caption", ad.caption],
              ["WhatsApp message", ad.whatsapp],
            ] as const
          ).map(([label, text], i) => (
            <Card key={label} delay={100 + i * 40}>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold">{label}</p>
                <button onClick={() => copy(text)} className="flex items-center gap-1.5 text-[12px] font-semibold text-primary">
                  <Copy className="size-3.5" /> Copy
                </button>
              </div>
              <pre className="mt-2 font-sans text-[14px] leading-relaxed whitespace-pre-wrap text-foreground/85">{text}</pre>
            </Card>
          ))}

          <ActionButton variant="soft" className="w-full" onClick={() => void run()}>
            Try a different version
          </ActionButton>
        </>
      ) : null}
    </AppShell>
  );
}
