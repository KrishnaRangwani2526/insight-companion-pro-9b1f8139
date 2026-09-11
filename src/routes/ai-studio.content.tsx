import { createFileRoute } from "@tanstack/react-router";
import { Wand2, FileUp, Camera, Mic, ClipboardPaste, Copy } from "lucide-react";
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
  VoiceButton,
  inputClass,
} from "@/components/ui-kit";
import { aiService } from "@/services/aiService";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai-studio/content")({
  head: () => ({
    meta: [
      { title: "Content Transformer — Kalaa Setu" },
      { name: "description", content: "Turn one photo, note or voice recording into posts, reels, blogs, catalogues and summaries." },
      { property: "og:title", content: "Create anything from your content" },
      { property: "og:description", content: "One input, many outputs — posts, reels, blogs, advisories and presentations." },
    ],
  }),
  component: ContentEngine,
});

const OUTPUTS = [
  "Advertisement",
  "Instagram Post",
  "Facebook Post",
  "LinkedIn Post",
  "X/Twitter Post",
  "WhatsApp Promotion",
  "Reel",
  "Video",
  "Blog",
  "Product Description",
  "Catalogue",
  "Advisory",
  "Infographic",
  "Executive Summary",
  "Presentation",
];

function ContentEngine() {
  const { state } = useApp();
  const [source, setSource] = useState("");
  const [picked, setPicked] = useState<string[]>(["Instagram Post", "WhatsApp Promotion"]);
  const [params, setParams] = useState({ language: "Hindi", audience: "City buyers", tone: "Warm", length: "Short", objective: "Get orders", style: "Story" });
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<{ type: string; body: string }[]>([]);

  const generate = async () => {
    if (!source.trim()) {
      toast("Add some text, a photo or a voice note first");
      return;
    }
    setBusy(true);
    const res = await aiService.transformContent(source, picked, params);
    setResults(res);
    setBusy(false);
  };

  return (
    <AppShell>
      <PageHeader title="Create Anything From Your Content" subtitle="One input. Many ready-to-post outputs." icon={Wand2} />

      <Card>
        <SectionLabel>1 · Your content</SectionLabel>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <button onClick={() => { setSource("Photo of handwoven indigo shawl on the loom, taken this morning."); toast.success("File added"); }} className="frost-tile flex flex-col items-center gap-2 p-4 text-[13px] font-semibold">
            <FileUp className="size-5 text-primary" /> Upload File
          </button>
          <button onClick={() => { setSource("Photo of terracotta vases drying in the sun outside the workshop."); toast.success("Photo added"); }} className="frost-tile flex flex-col items-center gap-2 p-4 text-[13px] font-semibold">
            <Camera className="size-5 text-primary" /> Take Photo
          </button>
          <div className="frost-tile flex items-center justify-center p-2">
            <VoiceButton label="Record" lang={state.business.language} onResult={setSource} />
          </div>
          <button onClick={() => setSource("We make handwoven shawls in Bhilwara. Each one takes four days.")} className="frost-tile flex flex-col items-center gap-2 p-4 text-[13px] font-semibold">
            <ClipboardPaste className="size-5 text-primary" /> Paste Text
          </button>
        </div>
        <textarea
          value={source}
          onChange={(e) => setSource(e.target.value)}
          rows={3}
          placeholder="Or type here — a few sentences is enough"
          className={cn(inputClass, "mt-3 py-3")}
        />
      </Card>

      <Card delay={60}>
        <SectionLabel>2 · What do you want to create?</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {OUTPUTS.map((o) => {
            const on = picked.includes(o);
            return (
              <button
                key={o}
                onClick={() => setPicked((p) => (on ? p.filter((x) => x !== o) : [...p, o]))}
                className={cn(
                  "rounded-full px-3.5 py-2.5 text-[13px] font-semibold ring-1 ring-line",
                  on ? "bg-primary text-primary-foreground" : "bg-surface-2",
                )}
              >
                {o}
              </button>
            );
          })}
        </div>
      </Card>

      <Card delay={120}>
        <SectionLabel>3 · How should it sound?</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["language", ["Hindi", "English", "Punjabi", "Bengali", "Tamil"]],
              ["audience", ["City buyers", "Local buyers", "Bulk buyers", "Tourists"]],
              ["tone", ["Warm", "Simple", "Festive", "Professional"]],
              ["length", ["Short", "Medium", "Long"]],
              ["objective", ["Get orders", "Build trust", "Announce offer"]],
              ["style", ["Story", "Direct", "Educational"]],
            ] as const
          ).map(([key, options]) => (
            <Field key={key} label={key[0]!.toUpperCase() + key.slice(1)}>
              <select
                className={inputClass}
                value={params[key]}
                onChange={(e) => setParams((p) => ({ ...p, [key]: e.target.value }))}
              >
                {options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
          ))}
        </div>
        <ActionButton onClick={() => void generate()} className="mt-4 w-full" disabled={busy}>
          {busy ? "Creating…" : `Generate ${picked.length} item${picked.length === 1 ? "" : "s"}`}
        </ActionButton>
        {busy ? <div className="mt-3"><ProcessingBar label="Writing your content…" /></div> : null}
      </Card>

      {results.map((r, i) => (
        <Card key={r.type} delay={i * 40}>
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold">{r.type}</p>
            <button
              onClick={() => { void navigator.clipboard?.writeText(r.body); toast.success("Copied"); }}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-primary"
            >
              <Copy className="size-3.5" /> Copy
            </button>
          </div>
          <pre className="mt-2 font-sans text-[14px] leading-relaxed whitespace-pre-wrap text-foreground/85">{r.body}</pre>
        </Card>
      ))}
    </AppShell>
  );
}
