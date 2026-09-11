import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShoppingCart, MessageCircle, MapPin, Star, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Badge, Card, SectionLabel, productImage } from "@/components/ui-kit";
import { useApp, inr } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/store/preview")({
  head: () => ({
    meta: [
      { title: "Store Preview — Kalaa Setu" },
      { name: "description", content: "See your online shop exactly as your buyers see it, with products, cart and WhatsApp ordering." },
      { property: "og:title", content: "Preview your online shop" },
      { property: "og:description", content: "What your buyers see when they open your link." },
    ],
  }),
  component: StorePreview,
});

function StorePreview() {
  const { state } = useApp();
  const s = state.store;
  const b = state.business;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = ["All", ...Array.from(new Set(state.products.map((p) => p.category)))];
  const list = state.products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase()),
  );
  const open = state.products.find((p) => p.id === openId);

  return (
    <AppShell>
      <div className="mb-3 flex items-center justify-between gap-3">
        <Link to="/store" className="flex items-center gap-1.5 text-[13px] font-semibold text-primary">
          <ArrowLeft className="size-4" /> Back to my shop settings
        </Link>
        <Badge tone="good">Live preview</Badge>
      </div>

      <div className="overflow-hidden rounded-3xl ring-1 ring-line">
        {/* Shop header */}
        <div className="bg-primary px-5 py-6 text-primary-foreground">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary-foreground/15 text-[18px] font-bold">
              {b.name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[19px] leading-tight font-bold">{b.name}</p>
              <p className="truncate text-[12px] opacity-80">{s.tagline}</p>
            </div>
          </div>
          <p className="mt-3 font-mono text-[11px] opacity-75">{s.slug}.business.com</p>
        </div>

        <div className="bg-surface p-5">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-2xl bg-surface-2 px-3 ring-1 ring-line">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="min-h-11 flex-1 bg-transparent text-[14px] outline-none"
            />
          </div>

          {/* Categories */}
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold ring-1 ring-line",
                  category === c ? "bg-primary text-primary-foreground" : "bg-surface-2",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {list.map((p) => (
              <button key={p.id} onClick={() => setOpenId(p.id)} className="frost-tile overflow-hidden text-left">
                <img src={productImage(p.image)} alt={p.name} width={640} height={640} loading="lazy" className="aspect-square w-full object-cover" />
                <span className="block p-3">
                  <span className="block truncate text-[13px] font-semibold">{p.name}</span>
                  <span className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-[14px] font-bold">{inr(p.price)}</span>
                    <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                      <Star className="size-3 fill-warn text-warn" /> 4.7
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
          {list.length === 0 ? <p className="mt-4 text-center text-[13px] text-muted-foreground">Nothing matches that search.</p> : null}

          {/* Product page */}
          {open ? (
            <div className="mt-4 rounded-2xl bg-surface-2 p-4 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[16px] font-bold">{open.name}</p>
                <button onClick={() => setOpenId(null)} className="text-[12px] font-semibold text-primary">
                  Close
                </button>
              </div>
              <p className="mt-1 font-mono text-[18px] font-bold text-primary">{inr(open.price)}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {open.description ?? "Handmade in our village workshop. Every piece is slightly different."}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ActionButton
                  variant="soft"
                  onClick={() => {
                    setCart((c) => [...c, open.id]);
                    toast.success("Added to cart");
                  }}
                >
                  <ShoppingCart className="mr-1.5 inline size-4" /> Add to cart
                </ActionButton>
                <ActionButton onClick={() => toast.success("Order placed in the demo shop")}>Buy now</ActionButton>
              </div>
            </div>
          ) : null}

          {/* Shop footer */}
          <div className="mt-5 space-y-2.5">
            <div className="frost-tile flex items-center gap-3 p-3.5">
              <MessageCircle className="size-[18px] text-good" />
              <span className="flex-1 text-[13px] font-semibold">Order on WhatsApp · {s.whatsapp}</span>
            </div>
            <div className="frost-tile flex items-center gap-3 p-3.5">
              <MapPin className="size-[18px] text-primary" />
              <span className="flex-1 text-[13px]">
                {b.village}, {b.district}, {b.state}
              </span>
            </div>
            <div className="frost-tile p-3.5">
              <p className="text-[12px] font-bold tracking-wide text-muted-foreground uppercase">About us</p>
              <p className="mt-1 text-[13px] leading-relaxed">{b.about}</p>
            </div>
          </div>
        </div>
      </div>

      <Card delay={60}>
        <SectionLabel>Cart in this preview</SectionLabel>
        <p className="text-[14px] font-semibold">
          {cart.length} item{cart.length === 1 ? "" : "s"} ·{" "}
          {inr(cart.reduce((sum, id) => sum + (state.products.find((p) => p.id === id)?.price ?? 0), 0))}
        </p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Real buyer orders arrive in your Orders page.
        </p>
      </Card>
    </AppShell>
  );
}
