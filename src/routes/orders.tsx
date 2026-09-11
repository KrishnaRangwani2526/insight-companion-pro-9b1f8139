import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Phone, Truck, PackageCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Badge, Card, EmptyState, PageHeader } from "@/components/ui-kit";
import { useApp, inr } from "@/lib/store";
import type { Order } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Kalaa Setu" },
      { name: "description", content: "Accept new orders, pack them, mark them shipped and contact your buyers — all in one list." },
      { property: "og:title", content: "Manage your orders" },
      { property: "og:description", content: "From new order to delivered, step by step." },
    ],
  }),
  component: OrdersPage,
});

const TABS: { key: Order["status"] | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "processing", label: "Packing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const TONE: Record<Order["status"], "primary" | "warn" | "accent" | "good" | "danger"> = {
  new: "primary",
  processing: "warn",
  shipped: "accent",
  delivered: "good",
  cancelled: "danger",
};

function OrdersPage() {
  const { state, setOrderStatus } = useApp();
  const [tab, setTab] = useState<Order["status"] | "all">("all");
  const list = tab === "all" ? state.orders : state.orders.filter((o) => o.status === tab);

  const advance = (o: Order) => {
    const next: Record<Order["status"], Order["status"]> = {
      new: "processing",
      processing: "shipped",
      shipped: "delivered",
      delivered: "delivered",
      cancelled: "cancelled",
    };
    setOrderStatus(o.id, next[o.status]);
    toast.success(`Order ${o.id} is now ${next[o.status]}`);
  };

  const label: Record<Order["status"], string> = {
    new: "Accept order",
    processing: "Mark as packed & shipped",
    shipped: "Mark as delivered",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <AppShell>
      <PageHeader title="Orders" subtitle="Every order from your shop and WhatsApp" icon={ClipboardList} />

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        {TABS.map((t) => {
          const count = t.key === "all" ? state.orders.length : state.orders.filter((o) => o.status === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "min-h-10 shrink-0 rounded-full px-3.5 text-[13px] font-semibold ring-1 ring-line",
                tab === t.key ? "bg-primary text-primary-foreground" : "bg-surface-2",
              )}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="No orders here yet"
          note="When a buyer orders from your shop, it will appear in this list."
          action={
            <Link to="/store" className="inline-flex min-h-12 items-center rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground">
              Share my shop link
            </Link>
          }
        />
      ) : (
        list.map((o, i) => (
          <Card key={o.id} delay={i * 40}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[12px] font-bold text-muted-foreground">{o.id}</p>
                <p className="mt-0.5 truncate text-[16px] font-semibold">{o.customer}</p>
                <p className="text-[12px] text-muted-foreground">{o.date} · {o.payment}</p>
              </div>
              <Badge tone={TONE[o.status]}>{o.status}</Badge>
            </div>

            <ul className="mt-3 space-y-1.5">
              {o.items.map((it) => (
                <li key={it.productId} className="flex items-center justify-between text-[13px]">
                  <span className="truncate text-muted-foreground">
                    {it.qty} × {it.name}
                  </span>
                  <span className="shrink-0 font-mono font-semibold">{inr(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center justify-between rounded-2xl bg-surface-2 p-3">
              <span className="text-[12px] font-semibold text-muted-foreground">Total</span>
              <span className="font-mono text-[16px] font-bold">{inr(o.amount)}</span>
            </div>

            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{o.address}</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <ActionButton
                variant="soft"
                onClick={() => toast(`Calling ${o.customer}`, { description: o.phone })}
              >
                <Phone className="mr-1.5 inline size-4" /> Contact buyer
              </ActionButton>
              {o.status === "delivered" || o.status === "cancelled" ? (
                <Link
                  to="/logistics"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-surface-2 text-[15px] font-semibold ring-1 ring-line"
                >
                  <Truck className="mr-1.5 inline size-4" /> Delivery
                </Link>
              ) : (
                <ActionButton onClick={() => advance(o)}>
                  <PackageCheck className="mr-1.5 inline size-4" /> {label[o.status]}
                </ActionButton>
              )}
            </div>
          </Card>
        ))
      )}
    </AppShell>
  );
}
