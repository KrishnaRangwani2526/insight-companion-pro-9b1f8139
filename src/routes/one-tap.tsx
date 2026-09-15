import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Upload, Mic, Square, Sparkles, Check } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
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
  VoiceTextInput,
  inputClass,
  productImage,
} from "@/components/ui-kit";
import { useApp } from "@/lib/store";
import { CATEGORIES } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { useVoiceRecorder, blobToBase64 } from "@/lib/use-voice-recorder";
import { transcribeBusinessVoice } from "@/lib/voice.functions";
import { oneTapUnderstand, type OneTapFields, type OneTapResult } from "@/lib/one-tap.functions";

export const Route = createFileRoute("/one-tap")({
  head: () => ({
    meta: [
      { title: "One Tap AI — Kalaa Setu" },
      {
        name: "description",
        content:
          "Add a photo, speak in your own language, and AI fills the whole product registration for you.",
      },
      { property: "og:title", content: "One Tap AI — photo plus your voice" },
      {
        property: "og:description",
        content: "Speak in your language, show your product, and every detail is filled automatically.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OneTap,
});

const EMPTY: OneTapFields = {
  name: "",
  category: "Other",
  material: "",
  colour: "",
  size: "",
  weight: "",
  useCase: "",
  howMade: "",
  craftOrigin: "",
  care: "",
  quantity: "",
  priceIdea: "",
  description: "",
  keywords: [],
};

const FIELD_LABELS: { key: keyof OneTapFields; label: string }[] = [
  { key: "name", label: "Product name" },
  { key: "material", label: "Material" },
  { key: "colour", label: "Colour" },
  { key: "size", label: "Size / dimensions" },
  { key: "weight", label: "Weight" },
  { key: "useCase", label: "Where it is used" },
  { key: "howMade", label: "How it is made" },
  { key: "craftOrigin", label: "Craft / place" },
  { key: "care", label: "Care instructions" },
  { key: "quantity", label: "Quantity you have" },
  { key: "priceIdea", label: "Price idea (₹)" },
];

function OneTap() {
  const { addProduct, state } = useApp();
  const navigate = useNavigate();
  const understand = useServerFn(oneTapUnderstand);
  const transcribe = useServerFn(transcribeBusinessVoice);
  const recorder = useVoiceRecorder();
  const cameraInput = useRef<HTMLInputElement>(null);
  const uploadInput = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [localText, setLocalText] = useState("");
  const [busyVoice, setBusyVoice] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState<OneTapResult | null>(null);
  const [fields, setFields] = useState<OneTapFields>(EMPTY);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const lang = state.business.language;
  const setField = (patch: Partial<OneTapFields>) => setFields((f) => ({ ...f, ...patch }));

  const prepareImage = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("This photo could not be read."));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("Please choose a valid JPG, PNG or WebP image."));
        image.onload = () => {
          const LIMIT = 1_400_000;
          const render = (longest: number, quality: number) => {
            const scale = Math.min(1, longest / Math.max(image.width, image.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL("image/jpeg", quality);
          };
          let out = render(1200, 0.82);
          if (!out) return reject(new Error("This browser could not prepare the photo."));
          for (const [side, q] of [
            [1000, 0.75],
            [800, 0.7],
            [640, 0.6],
          ] as const) {
            if (out.length <= LIMIT) break;
            out = render(side, q) ?? out;
          }
          if (out.length > LIMIT) return reject(new Error("This photo is too detailed. Please try a smaller photo."));
          resolve(out);
        };
        image.src = typeof reader.result === "string" ? reader.result : "";
      };
      reader.readAsDataURL(file);
    });

  const choosePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 15 * 1024 * 1024) return toast.error("That photo is too large. Please choose one under 15 MB.");
    try {
      setPhoto(await prepareImage(file));
      setError(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Photo could not be used.");
    }
  };

  const handleMic = async () => {
    setError(null);
    if (!recorder.recording) {
      const ok = await recorder.start();
      if (!ok) setError("Microphone permission is needed. Allow it and tap again.");
      return;
    }
    const clip = await recorder.stop();
    if (!clip) {
      setError("That was too short. Tap and speak for a few seconds.");
      return;
    }
    setBusyVoice(true);
    try {
      const out = await transcribe({ data: { audioBase64: await blobToBase64(clip), lang } });
      if (!out.text) setError("We could not hear any words. Please try again.");
      else setLocalText((prev) => (prev ? `${prev} ${out.text}`.trim() : out.text));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Voice failed. Please try again.");
    } finally {
      setBusyVoice(false);
    }
  };

  const run = async () => {
    if (!photo && !localText.trim()) {
      toast.error("Add a photo or speak first.");
      return;
    }
    setThinking(true);
    setError(null);
    try {
      const pending = (result?.questions ?? [])
        .filter((q) => answers[q.field]?.trim())
        .map((q) => ({ question: q.question, answer: answers[q.field]!.trim() }));
      const out = await understand({
        data: {
          ...(photo ? { imageDataUrl: photo } : {}),
          ...(localText.trim() ? { localText: localText.trim() } : {}),
          ...(pending.length ? { answers: pending } : {}),
        },
      });
      setResult(out);
      setFields((prev) => ({
        ...out.fields,
        // keep anything the seller edited by hand when AI leaves it empty
        ...Object.fromEntries(
          Object.entries(prev).filter(([k, v]) => typeof v === "string" && v && !(out.fields as Record<string, unknown>)[k]),
        ),
      }));
      toast.success("Details filled", { description: "Check the answers below, then save." });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Please try again.";
      setError(message);
      toast.error("One Tap AI could not finish", { description: message });
    } finally {
      setThinking(false);
    }
  };

  const save = () => {
    const price = Math.max(0, Math.round(Number(fields.priceIdea.replace(/[^\d.]/g, "")) || 0));
    const cost = price ? Math.round(price * 0.62) : 600;
    const p = addProduct({
      name: fields.name || "New product",
      category: CATEGORIES.includes(fields.category) ? fields.category : CATEGORIES[0]!,
      price: price || Math.round((cost * 1.6) / 10) * 10 - 1,
      cost,
      stock: Number(fields.quantity.replace(/[^\d]/g, "")) || 1,
      reorderLevel: 5,
      sold: 0,
      image: photo ?? "shawl",
      status: "active",
      material: fields.material,
      description: fields.description || localText,
      colour: fields.colour,
      size: fields.size,
      keywords: fields.keywords,
      aiLabelled: true,
    });
    toast.success("Product registered", { description: `${p.name} is now in your catalogue.` });
    navigate({ to: "/products/$id", params: { id: p.id } });
  };

  const openQuestions = (result?.questions ?? []).filter((q) => !answers[q.field]?.trim());

  return (
    <AppShell>
      <PageHeader
        title="One Tap AI"
        subtitle="Show the product, speak in your language — AI fills everything"
        icon={Sparkles}
      />

      <Card>
        <SectionLabel>Step 1 · Show your product</SectionLabel>
        <input ref={cameraInput} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => void choosePhoto(e)} />
        <input ref={uploadInput} type="file" accept="image/*" className="sr-only" onChange={(e) => void choosePhoto(e)} />
        {photo ? (
          <div className="flex gap-3">
            <img src={productImage(photo)} alt="Your product" width={640} height={640} className="size-28 rounded-2xl object-cover" />
            <div className="flex flex-wrap items-start gap-2">
              <ActionButton variant="soft" className="min-h-9 px-3 text-[12px]" onClick={() => cameraInput.current?.click()}>
                <Camera className="mr-1 inline size-3.5" /> Retake
              </ActionButton>
              <ActionButton variant="soft" className="min-h-9 px-3 text-[12px]" onClick={() => uploadInput.current?.click()}>
                <Upload className="mr-1 inline size-3.5" /> Replace
              </ActionButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => cameraInput.current?.click()} className="frost-tile flex flex-col items-center gap-2 p-6 text-[14px] font-semibold">
              <Camera className="size-6 text-primary" /> Take Photo
            </button>
            <button type="button" onClick={() => uploadInput.current?.click()} className="frost-tile flex flex-col items-center gap-2 p-6 text-[14px] font-semibold">
              <Upload className="size-6 text-primary" /> Upload Photo
            </button>
          </div>
        )}
      </Card>

      <Card delay={60}>
        <SectionLabel>Step 2 · Say it in your language</SectionLabel>
        <div className="flex items-start gap-2">
          <textarea
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            rows={3}
            placeholder="Tap the mic and speak — or type in any language"
            className={cn(inputClass, "min-h-24 py-3")}
          />
          <button
            type="button"
            onClick={busyVoice ? undefined : () => void handleMic()}
            aria-label={recorder.recording ? "Stop recording" : "Speak instead of typing"}
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-2xl transition-transform active:scale-95",
              recorder.recording ? "bg-accent text-accent-foreground" : "bg-surface-2 ring-1 ring-line",
              busyVoice && "opacity-70",
            )}
          >
            {busyVoice ? <Sparkles className="size-[18px] animate-pulse" /> : recorder.recording ? <Square className="size-[18px]" /> : <Mic className="size-[18px]" />}
          </button>
        </div>
        {recorder.recording ? (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-accent transition-[width] duration-100" style={{ width: `${Math.min(100, Math.round(recorder.level * 260))}%` }} />
            </div>
            <span className="text-[11px] font-semibold text-accent">{recorder.seconds}s — tap to stop</span>
          </div>
        ) : null}
        {busyVoice ? <p className="mt-2 text-[11px] text-muted-foreground">Writing your words…</p> : null}
        {error ? <p className="mt-2 text-[12px] font-semibold text-destructive">{error}</p> : null}

        <ActionButton onClick={() => void run()} className="mt-3 w-full" disabled={thinking}>
          <Sparkles className="mr-1.5 inline size-4" />
          {thinking ? "AI is working…" : "One Tap — fill everything"}
        </ActionButton>
        {thinking ? (
          <div className="mt-3">
            <ProcessingBar label="Reading your photo, your words, and filling the form…" />
          </div>
        ) : null}
      </Card>

      {result ? (
        <>
          <Card delay={120}>
            <SectionLabel>What you said</SectionLabel>
            <div className="frost-tile p-3">
              <p className="text-[14px] leading-relaxed">{localText || "—"}</p>
              {result.detectedLanguage ? <p className="mt-1 text-[11px] text-muted-foreground">Language heard: {result.detectedLanguage}</p> : null}
            </div>
            {result.englishText ? (
              <div className="frost-tile mt-2 p-3">
                <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">In English</p>
                <p className="mt-1 text-[14px] leading-relaxed">{result.englishText}</p>
              </div>
            ) : null}
          </Card>

          {openQuestions.length ? (
            <Card delay={150}>
              <SectionLabel>AI needs a little more</SectionLabel>
              <p className="mb-3 text-[13px] text-muted-foreground">
                Answer by voice in your language — AI will translate and fill the rest.
              </p>
              <div className="space-y-3">
                {openQuestions.map((q) => (
                  <Field key={q.field} label={q.question}>
                    <VoiceTextInput
                      value={answers[q.field] ?? ""}
                      onChange={(v) => setAnswers((a) => ({ ...a, [q.field]: v }))}
                      placeholder="Speak or type your answer"
                      lang={lang}
                    />
                  </Field>
                ))}
              </div>
              <ActionButton onClick={() => void run()} className="mt-3 w-full" disabled={thinking}>
                <Check className="mr-1.5 inline size-4" /> Use my answers
              </ActionButton>
            </Card>
          ) : null}

          <Card delay={180}>
            <SectionLabel>Registration details — filled by AI</SectionLabel>
            <div className="space-y-3">
              {FIELD_LABELS.map(({ key, label }) => (
                <Field key={key} label={label}>
                  <VoiceTextInput
                    value={(fields[key] as string) ?? ""}
                    onChange={(v) => setField({ [key]: v } as Partial<OneTapFields>)}
                    lang={lang}
                  />
                </Field>
              ))}
              <Field label="Category">
                <select className={inputClass} value={fields.category} onChange={(e) => setField({ category: e.target.value as OneTapFields["category"] })}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Description">
                <VoiceTextInput value={fields.description} onChange={(description) => setField({ description })} multiline lang={lang} />
              </Field>
              {fields.keywords.length ? (
                <div>
                  <p className="mb-1.5 text-[12px] font-semibold text-muted-foreground">Search keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {fields.keywords.map((k) => (
                      <Badge key={k} tone="primary">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
              {result.confidenceNote ? <p className="text-[12px] text-muted-foreground">{result.confidenceNote}</p> : null}
            </div>
          </Card>

          <ActionButton onClick={save} className="w-full">
            Save product
          </ActionButton>
        </>
      ) : null}
    </AppShell>
  );
}
