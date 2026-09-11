import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Upload, Plus, Wand2, Check } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
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
  productImage,
  Badge,
} from "@/components/ui-kit";
import { useApp } from "@/lib/store";
import { CATEGORIES } from "@/lib/demo-data";
import { aiService, type CatalogueCopy } from "@/services/aiService";
import { cn } from "@/lib/utils";
import { analyzeProductImage } from "@/lib/product-image.functions";

export const Route = createFileRoute("/products/add")({
  head: () => ({
    meta: [
      { title: "Add a product — Kalaa Setu" },
      { name: "description", content: "Add a product with a photo and your voice. AI cleans the photo and writes the description." },
      { property: "og:title", content: "Add a product in three steps" },
      { property: "og:description", content: "Photo, details, AI description — your product is ready to sell." },
    ],
  }),
  component: AddProduct,
});

const IMAGE_TOOLS = ["Remove Background", "Improve Lighting", "Enhance Image", "Crop", "Create E-commerce Image"];
const SAMPLES = ["shawl", "vase", "bag", "basket", "dupatta"];

function AddProduct() {
  const { addProduct, state } = useApp();
  const navigate = useNavigate();
  const analyzeImage = useServerFn(analyzeProductImage);
  const cameraInput = useRef<HTMLInputElement>(null);
  const uploadInput = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiLabelled, setAiLabelled] = useState(false);
  const [applied, setApplied] = useState<string[]>([]);
  const [busyTool, setBusyTool] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: CATEGORIES[0]!,
    material: "",
    size: "",
    colour: "",
    quantity: "10",
    raw: "300",
    production: "250",
    other: "50",
  });
  const [spoken, setSpoken] = useState("");
  const [copy, setCopy] = useState<CatalogueCopy | null>(null);
  const [writing, setWriting] = useState(false);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const prepareImage = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("This photo could not be read."));
      reader.onload = () => {
        const source = typeof reader.result === "string" ? reader.result : "";
        const image = new Image();
        image.onerror = () => reject(new Error("Please choose a valid JPG, PNG, or WebP image."));
        image.onload = () => {
          const longestSide = 1200;
          const scale = Math.min(1, longestSide / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error("This browser could not prepare the photo."));
            return;
          }
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        image.src = source;
      };
      reader.readAsDataURL(file);
    });

  const choosePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("That photo is too large. Please choose one under 15 MB.");
      return;
    }

    setAnalyzing(true);
    setAiLabelled(false);
    setApplied([]);
    setCopy(null);
    try {
      const imageDataUrl = await prepareImage(file);
      setPhoto(imageDataUrl);
      const result = await analyzeImage({ data: { imageDataUrl } });
      set({
        name: result.name,
        category: result.category,
        material: result.material,
        colour: result.colour,
        size: result.size,
      });
      setCopy({
        title: result.name,
        short: result.short,
        full: result.full,
        hindi: result.hindi,
        english: result.english,
        keywords: result.keywords,
      });
      setAiLabelled(true);
      toast.success("Product details found", { description: "Review the AI labels before saving." });
    } catch (error) {
      toast.error("Photo analysis failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const runTool = async (tool: string) => {
    setBusyTool(tool);
    const res = await aiService.enhanceImage(tool);
    setBusyTool(null);
    setApplied((a) => [...new Set([...a, tool])]);
    toast.success(tool, { description: res.note });
  };

  const write = async () => {
    setWriting(true);
    const res = await aiService.generateProductDescription(form.name || "Handmade product", form.material);
    setCopy(res);
    setWriting(false);
  };

  const save = () => {
    const cost = Number(form.raw) + Number(form.production) + Number(form.other);
    const p = addProduct({
      name: form.name || "New product",
      category: form.category,
      price: Math.round((cost * 1.6) / 10) * 10 - 1,
      cost,
      stock: Number(form.quantity),
      reorderLevel: 5,
      sold: 0,
      image: photo ?? "shawl",
      status: "active",
      material: form.material,
      description: copy?.full ?? spoken,
      colour: form.colour,
      size: form.size,
      keywords: copy?.keywords,
      aiLabelled,
    });
    toast.success("Product saved", { description: `${p.name} is now in your catalogue and your store.` });
    navigate({ to: "/products/$id", params: { id: p.id } });
  };

  return (
    <AppShell>
      <PageHeader title="Add Product" subtitle="Photo first — everything else can be spoken" icon={Plus} />

      <Card>
        <SectionLabel>Step 1 · Product photo</SectionLabel>
        {!photo ? (
          <>
            <input
              ref={cameraInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(event) => void choosePhoto(event)}
            />
            <input
              ref={uploadInput}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => void choosePhoto(event)}
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => cameraInput.current?.click()}
                className="frost-tile flex flex-col items-center gap-2 p-6 text-[14px] font-semibold"
                disabled={analyzing}
              >
                <Camera className="size-6 text-primary" /> Take Photo
              </button>
              <button
                type="button"
                onClick={() => uploadInput.current?.click()}
                className="frost-tile flex flex-col items-center gap-2 p-6 text-[14px] font-semibold"
                disabled={analyzing}
              >
                <Upload className="size-6 text-primary" /> Upload Photo
              </button>
            </div>
            {analyzing ? <div className="mt-3"><ProcessingBar label="Reading the product photo with AI…" /></div> : null}
          </>
        ) : (
          <div>
            <input
              ref={cameraInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(event) => void choosePhoto(event)}
            />
            <input
              ref={uploadInput}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => void choosePhoto(event)}
            />
            <div className="flex gap-3">
              <img
                src={productImage(photo)}
                alt="Your product"
                width={640}
                height={640}
                className="size-28 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <p className="text-[14px] font-semibold">{aiLabelled ? "AI labels ready" : "AI Product Studio"}</p>
                <p className="text-[12px] text-muted-foreground">
                  {aiLabelled ? "Review the details below before saving." : "Tap a tool to clean up your photo."}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ActionButton variant="soft" className="min-h-9 px-3 text-[12px]" onClick={() => cameraInput.current?.click()}>
                    <Camera className="mr-1 inline size-3.5" /> Retake
                  </ActionButton>
                  <ActionButton variant="soft" className="min-h-9 px-3 text-[12px]" onClick={() => uploadInput.current?.click()}>
                    <Upload className="mr-1 inline size-3.5" /> Replace
                  </ActionButton>
                </div>
              </div>
            </div>
            {analyzing ? <div className="mt-3"><ProcessingBar label="Reading the product photo with AI…" /></div> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {IMAGE_TOOLS.map((tool) => (
                <button
                  key={tool}
                  onClick={() => void runTool(tool)}
                  className={cn(
                    "rounded-full px-3 py-2 text-[12px] font-semibold ring-1 ring-line",
                    applied.includes(tool) ? "bg-good-soft text-good" : "bg-surface-2",
                  )}
                >
                  {applied.includes(tool) ? <Check className="mr-1 inline size-3.5" /> : null}
                  {tool}
                </button>
              ))}
            </div>
            {busyTool ? <div className="mt-3"><ProcessingBar label={`AI is working: ${busyTool}…`} /></div> : null}
          </div>
        )}
      </Card>

      <Card delay={60}>
        <SectionLabel>Step 2 · Product details</SectionLabel>
        <div className="space-y-3">
          <Field label="Product name">
            <input className={inputClass} value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Handwoven cotton shawl" />
          </Field>
          <Field label="Category">
            <select className={inputClass} value={form.category} onChange={(e) => set({ category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Material">
              <input className={inputClass} value={form.material} onChange={(e) => set({ material: e.target.value })} placeholder="Cotton" />
            </Field>
            <Field label="Size">
              <input className={inputClass} value={form.size} onChange={(e) => set({ size: e.target.value })} placeholder="2m × 1m" />
            </Field>
            <Field label="Colour">
              <input className={inputClass} value={form.colour} onChange={(e) => set({ colour: e.target.value })} placeholder="Indigo" />
            </Field>
            <Field label="Quantity you have">
              <input className={inputClass} inputMode="numeric" value={form.quantity} onChange={(e) => set({ quantity: e.target.value })} />
            </Field>
            <Field label="Raw material cost (₹)">
              <input className={inputClass} inputMode="numeric" value={form.raw} onChange={(e) => set({ raw: e.target.value })} />
            </Field>
            <Field label="Making cost (₹)">
              <input className={inputClass} inputMode="numeric" value={form.production} onChange={(e) => set({ production: e.target.value })} />
            </Field>
          </div>
          <VoiceButton
            label="🎙️ Describe your product in your language"
            lang={state.business.language}
            onResult={(text) => {
              setSpoken(text);
              toast.success("Voice turned into text");
            }}
          />
          {spoken ? <p className="frost-tile p-3 text-[13px] text-muted-foreground">{spoken}</p> : null}
        </div>
      </Card>

      <Card delay={120}>
        <SectionLabel>Step 3 · AI writes your listing</SectionLabel>
        <ActionButton onClick={() => void write()} className="w-full" disabled={writing}>
          <Wand2 className="mr-1.5 inline size-4" />
          {writing ? "Writing…" : "Generate description"}
        </ActionButton>
        {writing ? <div className="mt-3"><ProcessingBar label="Reading your words and writing the listing…" /></div> : null}
        {copy ? (
          <div className="mt-4 space-y-3">
            <Block label="Product title" text={copy.title} />
            <Block label="Short description" text={copy.short} />
            <Block label="Full description" text={copy.full} />
            <Block label="Hindi description" text={copy.hindi} />
            <div>
              <p className="mb-1.5 text-[12px] font-semibold text-muted-foreground">Search keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {copy.keywords.map((k) => (
                  <Badge key={k} tone="primary">{k}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <ActionButton variant="soft" onClick={() => void write()} className="flex-1">Regenerate</ActionButton>
              <ActionButton variant="soft" onClick={() => toast("Translated to 8 languages")} className="flex-1">Translate</ActionButton>
            </div>
          </div>
        ) : null}
      </Card>

      <ActionButton onClick={save} className="w-full">Save Product</ActionButton>
    </AppShell>
  );
}

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div className="frost-tile p-3">
      <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-[14px] leading-relaxed">{text}</p>
    </div>
  );
}
