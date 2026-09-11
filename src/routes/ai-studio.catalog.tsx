import { createFileRoute } from "@tanstack/react-router";
import { Mic, Languages, Volume2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  ActionButton,
  Badge,
  Card,
  Field,
  PageHeader,
  ProcessingBar,
  SectionLabel,
  VoiceButton,
  inputClass,
} from "@/components/ui-kit";
import { useApp } from "@/lib/store";
import { LANGUAGES } from "@/lib/i18n";
import { aiService, type CatalogueCopy } from "@/services/aiService";

export const Route = createFileRoute("/ai-studio/catalog")({
  head: () => ({
    meta: [
      { title: "Voice Cataloguing — Kalaa Setu" },
      { name: "description", content: "Speak about your product in your own language and get a complete listing in Hindi and English." },
      { property: "og:title", content: "Voice Cataloguing — speak, don't type" },
      { property: "og:description", content: "Your voice becomes a title, description, keywords and translations." },
    ],
  }),
  component: VoiceCatalog,
});

function VoiceCatalog() {
  const { state } = useApp();
  const [lang, setLang] = useState(state.business.language);
  const [spoken, setSpoken] = useState("");
  const [name, setName] = useState(state.products[0]?.name ?? "");
  const [copy, setCopy] = useState<CatalogueCopy | null>(null);
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    setBusy(true);
    const res = await aiService.generateProductDescription(name || "Handmade product", spoken.slice(0, 60));
    setCopy(res);
    setBusy(false);
  };

  return (
    <AppShell>
      <PageHeader title="Voice Cataloguing" subtitle="Speak about your product — we write the listing" icon={Mic} />

      <Card>
        <SectionLabel>Speak in</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.slice(0, 6).map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={
                "rounded-full px-3.5 py-2 text-[13px] font-semibold ring-1 ring-line " +
                (lang === l.code ? "bg-primary text-primary-foreground" : "bg-surface-2")
              }
            >
              {l.native}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          <Field label="Product name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <VoiceButton label="🎙️ Hold and describe your product" lang={lang} onResult={setSpoken} />
        </div>
        {spoken ? (
          <div className="frost-tile mt-3 p-3">
            <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">Your description</p>
            <p className="mt-1 text-[14px] leading-relaxed">{spoken}</p>
            <button
              onClick={() => { toast("Playing back your description"); }}
              className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-primary"
            >
              <Volume2 className="size-4" /> Listen (text to voice)
            </button>
          </div>
        ) : null}
        <ActionButton onClick={() => void generate()} className="mt-4 w-full" disabled={busy}>
          {busy ? "Writing your listing…" : "Create listing"}
        </ActionButton>
        {busy ? <div className="mt-3"><ProcessingBar label="Turning your words into a listing…" /></div> : null}
      </Card>

      {copy ? (
        <Card delay={60}>
          <SectionLabel>Your listing</SectionLabel>
          <div className="space-y-3">
            <Row label="Product title" text={copy.title} />
            <Row label="Short description" text={copy.short} />
            <Row label="Full description" text={copy.full} />
            <Row label="Hindi description" text={copy.hindi} />
            <Row label="English description" text={copy.english} />
            <div>
              <p className="mb-1.5 text-[12px] font-semibold text-muted-foreground">SEO keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {copy.keywords.map((k) => (
                  <Badge key={k} tone="primary">{k}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <ActionButton variant="soft" onClick={() => void generate()}>Regenerate</ActionButton>
            <ActionButton variant="soft" onClick={() => { toast.success("Translated into 8 languages"); }}>
              <Languages className="mr-1.5 inline size-4" /> Translate
            </ActionButton>
            <ActionButton className="col-span-2" onClick={() => { toast.success("Saved to your product"); }}>
              Save to product
            </ActionButton>
          </div>
        </Card>
      ) : null}
    </AppShell>
  );
}

function Row({ label, text }: { label: string; text: string }) {
  return (
    <div className="frost-tile p-3">
      <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-[14px] leading-relaxed">{text}</p>
    </div>
  );
}
