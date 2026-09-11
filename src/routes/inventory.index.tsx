import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, TrendingUp, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Badge, Card, PageHeader, SectionLabel, StatCard, productImage } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { useApp, inr } from "@/lib/store";
import { inventoryService } from "@/services/inventoryService";

export const Route = createFileRoute("/inventory/")({
  head: () => ({
    meta: [
      { title: "Inventory — Kalaa Setu" },
      { name: "description", content: "See how much stock you have, what is running low and what to make next." },
      { property: "og:title", content: "Inventory for your craft business" },
      { property: "og:description", content: "Stock levels, reorder alerts and the value sitting in your store." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const { state, updateProduct } = useApp();
  const inv = inventoryService.summary(state.products);

  const change = (id: string, delta: number, current: number) => {
    const next = Math.max(0, current + delta);
    updateProduct(id, { stock: next });
    toast.success(`Stock updated to ${next}`);
  };

  return (
    <AppShell>
      <PageHeader
        title="Inventory"
        subtitle="What you have, what is finishing"
        icon={Boxes}
        action={
          <Link
            to="/inventory/forecast"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-surface-2 px-3.5 text-[13px] font-semibold ring-1 ring-line"
          >
            <TrendingUp className="size-4" /> Forecast
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total pieces" value={String(inv.totalStock)} hint={`${inv.count} products`} />
        <StatCard label="Stock value" value={inr(inv.value)} hint="At your cost price" tone="primary" />
        <StatCard label="Running low" value={String(inv.low.length)} hint="● make more soon" tone="warn" />
        <StatCard label="Finished" value={String(inv.out.length)} hint="● cannot sell" tone="accent" />
      </div>

      {inv.low.length + inv.out.length > 0 ? (
        <Card delay={60}>
          <SectionLabel>
            <Bi>Needs your attention</Bi>
          </SectionLabel>
          <div className="space-y-2.5">
            {[...inv.out, ...inv.low].map((p) => (
              <div key={p.id} className="frost-tile flex items-center gap-3 p-3">
                <img src={productImage(p.image)} alt={p.name} width={64} height={64} loading="lazy" className="size-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold">{p.name}</p>
                  <p className="text-[12px] text-muted-foreground">{p.stock} left · reorder at {p.reorderLevel}</p>
                </div>
                <Badge tone={p.stock === 0 ? "danger" : "warn"}>{p.stock === 0 ? "Finished" : "Low"}</Badge>
              </div>
            ))}
          </div>
          <ActionButton
            className="mt-4 w-full"
            onClick={() => toast.success("Reorder list saved", { description: "Shown on your dashboard until you make the stock." })}
          >
            Add these to my making list
          </ActionButton>
        </Card>
      ) : null}

      <Card delay={120}>
        <SectionLabel>
          <Bi>All stock</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          {state.products.map((p) => (
            <div key={p.id} className="frost-tile flex items-center gap-3 p-3">
              <img src={productImage(p.image)} alt={p.name} width={64} height={64} loading="lazy" className="size-12 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold">{p.name}</p>
                <p className="text-[12px] text-muted-foreground">
                  {inr(p.price)} · {p.sold} sold
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => change(p.id, -1, p.stock)}
                  aria-label={`Reduce stock of ${p.name}`}
                  className="grid size-9 place-items-center rounded-xl bg-surface-2 ring-1 ring-line"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-7 text-center font-mono text-[15px] font-bold">{p.stock}</span>
                <button
                  onClick={() => change(p.id, 1, p.stock)}
                  aria-label={`Add stock of ${p.name}`}
                  className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
