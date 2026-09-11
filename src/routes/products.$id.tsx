import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, Megaphone, Share2, Tag, Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Badge, Card, EmptyState, PageHeader, productImage } from "@/components/ui-kit";
import { useApp, inr } from "@/lib/store";

export const Route = createFileRoute("/products/$id")({
  head: () => ({
    meta: [
      { title: "Product details — Kalaa Setu" },
      { name: "description", content: "See and change a product's price, stock, description and marketing." },
      { property: "og:title", content: "Product details — Kalaa Setu" },
      { property: "og:description", content: "Price, stock, sales and one-tap marketing for your product." },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { state, updateProduct, removeProduct } = useApp();
  const navigate = useNavigate();
  const product = state.products.find((p) => p.id === id);

  if (!product)
    return (
      <AppShell>
        <EmptyState
          title="Product not found"
          note="It may have been deleted from your catalogue."
          action={<Link to="/products"><ActionButton>Back to products</ActionButton></Link>}
        />
      </AppShell>
    );

  const margin = product.price > 0 ? Math.round(((product.price - product.cost) / product.price) * 100) : 0;

  return (
    <AppShell>
      <PageHeader title={product.name} subtitle={product.category} />

      <Card className="p-0! overflow-hidden">
        <img
          src={productImage(product.image)}
          alt={product.name}
          width={640}
          height={640}
          className="aspect-square w-full object-cover sm:aspect-[16/9]"
        />
        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[28px] font-bold">{inr(product.price)}</span>
            <Badge tone={product.stock === 0 ? "danger" : product.stock <= product.reorderLevel ? "warn" : "good"}>
              {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
            </Badge>
          </div>
          {product.nameLocal ? <p className="mt-1 text-[14px] text-muted-foreground">{product.nameLocal}</p> : null}
          <p className="mt-3 text-[14px] leading-relaxed text-foreground/85">{product.description}</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Mini label="Cost" value={inr(product.cost)} />
            <Mini label="Margin" value={`${margin}%`} />
            <Mini label="Sold" value={String(product.sold)} />
          </div>
        </div>
      </Card>

      <Card delay={60}>
        <p className="text-[15px] font-semibold">Stock</p>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => updateProduct(product.id, { stock: Math.max(0, product.stock - 1) })}
            className="grid size-12 place-items-center rounded-2xl bg-surface-2 ring-1 ring-line"
            aria-label="Remove one"
          >
            <Minus className="size-5" />
          </button>
          <span className="flex-1 text-center font-mono text-[28px] font-bold">{product.stock}</span>
          <button
            onClick={() => updateProduct(product.id, { stock: product.stock + 1 })}
            className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground"
            aria-label="Add one"
          >
            <Plus className="size-5" />
          </button>
        </div>
        <p className="mt-3 text-[12px] text-muted-foreground">
          Changes here update your online store immediately — the store shows the same price and stock.
        </p>
      </Card>

      <Card delay={120}>
        <p className="text-[15px] font-semibold">Change price</p>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            value={product.price}
            onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })}
            className="min-h-12 flex-1 rounded-2xl bg-surface-2 px-4 font-mono text-[18px] font-bold ring-1 ring-line outline-none focus:ring-2 focus:ring-ring"
          />
          <Link to="/ai-studio/pricing">
            <ActionButton variant="soft">
              <Tag className="mr-1.5 inline size-4" /> Ask AI
            </ActionButton>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/marketing/advertisement">
          <ActionButton variant="soft" className="w-full">
            <Megaphone className="mr-1.5 inline size-4" /> Create ad
          </ActionButton>
        </Link>
        <ActionButton
          variant="soft"
          className="w-full"
          onClick={() => { toast.success("Link copied", { description: `Share ${product.name} on WhatsApp.` }); }}
        >
          <Share2 className="mr-1.5 inline size-4" /> Share
        </ActionButton>
        <ActionButton
          variant="soft"
          className="w-full"
          onClick={() => { toast("Duplicated", { description: "Edit the copy and save it as a new product." }); }}
        >
          <Copy className="mr-1.5 inline size-4" /> Duplicate
        </ActionButton>
        <ActionButton
          variant="soft"
          className="w-full"
          onClick={() => {
            removeProduct(product.id);
            toast.success("Product removed");
            navigate({ to: "/products" });
          }}
        >
          <Trash2 className="mr-1.5 inline size-4" /> Delete
        </ActionButton>
      </div>
    </AppShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-[16px] font-bold">{value}</p>
    </div>
  );
}
