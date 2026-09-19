import { createFileRoute } from "@tanstack/react-router";
import {
  Globe,
  Search,
  Star,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Share2,
  Store,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  ActionButton,
  Badge,
  Card,
  PageHeader,
  SectionLabel,
  Sheet,
  VoiceTextInput,
  inputClass,
  productImage,
} from "@/components/ui-kit";
import { useApp } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/e-setu")({
  head: () => ({
    meta: [
      { title: "E-Setu — buyers meet artisans directly" },
      {
        name: "description",
        content:
          "E-Setu is the buyer–artisan marketplace: your AI-enhanced photos, prices and descriptions become a live catalogue buyers can browse and enquire about.",
      },
      { property: "og:title", content: "E-Setu — buyers meet artisans directly" },
      {
        property: "og:description",
        content: "Your product catalogue, artisan story and reviews on one simple buyer-facing page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ESetu,
});

const REVIEWS = [
  { name: "Ananya S.", place: "Bengaluru", rating: 5, text: "The weave is beautiful and the colour is exactly as shown. Packed with care." },
  { name: "Rahul M.", place: "Pune", rating: 5, text: "Bought two as gifts. Real handwork, worth the price." },
  { name: "Fatima K.", place: "Hyderabad", rating: 4, text: "Lovely quality. Delivery took a few extra days but the artisan kept me updated." },
];

function ESetu() {
  const { state, updateProduct } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState<Product | null>(null);
  const [enquiry, setEnquiry] = useState("");

  const business = state.business;
  const listed = state.products.filter((p) => p.status === "active");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(listed.map((p) => p.category)))],
    [listed],
  );

  const shown = listed.filter((p) => {
    const inCategory = category === "All" || p.category === category;
    const text = `${p.name} ${p.material ?? ""} ${p.colour ?? ""} ${(p.keywords ?? []).join(" ")}`.toLowerCase();
    return inCategory && (!query.trim() || text.includes(query.trim().toLowerCase()));
  });

  const pending = listed.filter((p) => !p.listedOnESetu);

  const publishAll = () => {
    pending.forEach((p) => updateProduct(p.id, { listedOnESetu: true }));
    toast.success("Catalogue sent to E-Setu", {
      description: `${pending.length} product${pending.length === 1 ? "" : "s"} are now visible to buyers.`,
    });
  };

  const sendEnquiry = () => {
    if (!enquiry.trim()) {
      toast.error("Write your question for the artisan first.");
      return;
    }
    toast.success("Enquiry sent", { description: "The artisan will reply on WhatsApp." });
    setEnquiry("");
    setOpen(null);
  };

  const cover = (p: Product) => productImage(p.enhancedImage ?? p.image);

  return (
    <AppShell>
      <PageHeader
        title="E-Setu"
        subtitle="Your live buyer page — photos, prices, story and reviews in one place"
        icon={Globe}
      />

      {/* Shop front */}
      <Card>
        <div className="flex items-start gap-3">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary-soft font-mono text-[18px] font-bold text-primary">
            {business.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[17px] font-bold leading-tight">{business.name}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted-foreground">
              <MapPin className="size-3.5" /> {business.village}, {business.district}, {business.state}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone="primary">{business.category}</Badge>
              {business.verified ? (
                <Badge tone="good">
                  <ShieldCheck className="mr-1 inline size-3" /> Verified artisan
                </Badge>
              ) : null}
              <Badge tone="accent">
                <Star className="mr-1 inline size-3" /> 4.8 · 126 buyers
              </Badge>
            </div>
          </div>
        </div>
        {business.about ? <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{business.about}</p> : null}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <ActionButton variant="soft" onClick={publishAll} disabled={!pending.length}>
            <Upload className="mr-1.5 inline size-4" />
            {pending.length ? `Send ${pending.length} to E-Setu` : "Catalogue is live"}
          </ActionButton>
          <ActionButton
            variant="soft"
            onClick={() => {
              void navigator.clipboard
                ?.writeText(`https://e-setu.in/${state.store.slug || "my-shop"}`)
                .then(() => toast.success("Buyer link copied"))
                .catch(() => toast.error("Could not copy the link"));
            }}
          >
            <Share2 className="mr-1.5 inline size-4" /> Share buyer link
          </ActionButton>
        </div>
      </Card>

      {/* Search + categories */}
      <Card delay={60}>
        <div className="flex items-center gap-2 rounded-2xl bg-surface-2 px-3 ring-1 ring-line">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products buyers can see"
            className="min-h-11 flex-1 bg-transparent text-[14px] outline-none"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px] font-semibold ring-1 ring-line",
                c === category ? "bg-primary text-primary-foreground ring-primary" : "bg-surface-2",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </Card>

      {/* Catalogue */}
      <Card delay={120}>
        <SectionLabel>Buyer catalogue</SectionLabel>
        {shown.length ? (
          <div className="grid grid-cols-2 gap-3">
            {shown.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpen(p)}
                className="frost-tile overflow-hidden p-0 text-left"
              >
                <img src={cover(p)} alt={p.name} width={640} height={640} className="h-32 w-full object-cover" />
                <span className="block p-3">
                  <span className="block truncate text-[13px] font-semibold">{p.seoTitle || p.name}</span>
                  <span className="mt-0.5 block text-[14px] font-bold text-primary">₹{p.price.toLocaleString("en-IN")}</span>
                  <span className="mt-1 line-clamp-2 block text-[11px] text-muted-foreground">
                    {p.shortDescription || p.description || `${p.material ?? ""} ${p.colour ?? ""}`}
                  </span>
                  <span className="mt-1.5 flex flex-wrap gap-1">
                    {p.enhancedImage ? <Badge tone="accent">AI photo</Badge> : null}
                    {p.listedOnESetu ? <Badge tone="good">Live</Badge> : <Badge tone="warn">Not sent yet</Badge>}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-muted-foreground">
            No products match this search. Add a product with One Tap AI and it appears here.
          </p>
        )}
      </Card>

      {/* Reviews */}
      <Card delay={180}>
        <SectionLabel>What buyers say</SectionLabel>
        <div className="space-y-2.5">
          {REVIEWS.map((r) => (
            <div key={r.name} className="frost-tile p-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold">
                  {r.name} <span className="font-normal text-muted-foreground">· {r.place}</span>
                </p>
                <span className="flex items-center gap-0.5 text-accent">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </Card>

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.seoTitle || open?.name || "Product"}>
        {open ? (
          <div className="space-y-3">
            <img src={cover(open)} alt={open.name} width={800} height={600} className="h-48 w-full rounded-2xl object-cover" />
            <div className="flex items-center justify-between">
              <p className="text-[20px] font-bold text-primary">₹{open.price.toLocaleString("en-IN")}</p>
              <Badge tone={open.stock > 0 ? "good" : "warn"}>
                {open.stock > 0 ? `${open.stock} ready to ship` : "Made to order"}
              </Badge>
            </div>
            <p className="text-[14px] leading-relaxed">
              {open.seoDescription || open.description || "Handmade with care by the artisan."}
            </p>
            {open.bullets?.length ? (
              <ul className="space-y-1">
                {open.bullets.map((b) => (
                  <li key={b} className="text-[13px] leading-relaxed text-muted-foreground">
                    • {b}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              {[
                ["Material", open.material],
                ["Colour", open.colour],
                ["Size", open.size],
                ["Weight", open.weight],
                ["Craft", open.craftOrigin],
                ["Care", open.care],
                ["Used for", open.useCase],
                ["How it is made", open.howMade],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k as string} className="frost-tile p-2.5">
                    <p className="text-[11px] font-semibold text-muted-foreground">{k}</p>
                    <p className="mt-0.5 text-[13px]">{v}</p>
                  </div>
                ))}
            </div>
            <div className="frost-tile p-3">
              <p className="text-[12px] font-bold tracking-wide text-muted-foreground uppercase">About the artisan</p>
              <p className="mt-1 text-[13px] font-semibold">{business.owner} · {business.name}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {business.village}, {business.district} — {business.about || "Traditional handmade craft."}
              </p>
            </div>
            <div>
              <p className="mb-1.5 text-[12px] font-semibold text-muted-foreground">Ask the artisan</p>
              <VoiceTextInput
                value={enquiry}
                onChange={setEnquiry}
                multiline
                placeholder="Can you make this in a different colour?"
                lang={business.language}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton onClick={sendEnquiry}>
                <MessageCircle className="mr-1.5 inline size-4" /> Send enquiry
              </ActionButton>
              <ActionButton variant="soft" onClick={() => setOpen(null)}>
                <X className="mr-1.5 inline size-4" /> Close
              </ActionButton>
            </div>
            {!open.listedOnESetu ? (
              <ActionButton
                variant="soft"
                className="w-full"
                onClick={() => {
                  updateProduct(open.id, { listedOnESetu: true });
                  setOpen({ ...open, listedOnESetu: true });
                  toast.success("Sent to E-Setu", { description: `${open.name} is now visible to buyers.` });
                }}
              >
                <Store className="mr-1.5 inline size-4" /> Send this product to E-Setu
              </ActionButton>
            ) : null}
          </div>
        ) : null}
      </Sheet>
    </AppShell>
  );
}
