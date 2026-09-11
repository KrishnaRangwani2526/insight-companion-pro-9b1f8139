import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Plus, Search } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Badge, PageHeader, productImage, EmptyState } from "@/components/ui-kit";
import { useApp, inr } from "@/lib/store";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — Kalaa Setu" },
      { name: "description", content: "Your product catalogue with prices, stock and sales at a glance." },
      { property: "og:title", content: "Product catalogue — Kalaa Setu" },
      { property: "og:description", content: "Manage every product you make: photos, price, stock and status." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { state } = useApp();
  const [q, setQ] = useState("");
  const list = state.products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell>
      <PageHeader
        title="My Products"
        subtitle={`${state.products.length} products in your catalogue`}
        icon={Package}
      />
      <div className="flex gap-2">
        <div className="frost-tile flex min-h-12 flex-1 items-center gap-2 px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your products"
            className="w-full bg-transparent text-[15px] outline-none"
          />
        </div>
        <Link
          to="/products/add"
          className="flex min-h-12 items-center gap-1.5 rounded-2xl bg-primary px-4 text-[15px] font-semibold text-primary-foreground"
        >
          <Plus className="size-4" /> Add
        </Link>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="No products yet"
          note="Add your first product with a photo and a few spoken words. AI writes the rest."
          action={<Link to="/products/add"><ActionButton>Add Product</ActionButton></Link>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <Link key={p.id} to="/products/$id" params={{ id: p.id }} className="frost-tile overflow-hidden">
              <div className="relative">
                <img
                  src={productImage(p.image)}
                  alt={p.name}
                  loading="lazy"
                  width={640}
                  height={640}
                  className="aspect-square w-full object-cover"
                />
                <span className="absolute top-2 left-2">
                  {p.stock === 0 ? (
                    <Badge tone="danger">Out of stock</Badge>
                  ) : p.stock <= p.reorderLevel ? (
                    <Badge tone="warn">Low stock</Badge>
                  ) : p.bestSeller ? (
                    <Badge tone="accent">Best seller</Badge>
                  ) : null}
                </span>
              </div>
              <div className="p-3">
                <p className="truncate text-[14px] leading-tight font-semibold">{p.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{p.category}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-[15px] font-bold">{inr(p.price)}</span>
                  <span className="text-[11px] text-muted-foreground">{p.sold} sold</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
