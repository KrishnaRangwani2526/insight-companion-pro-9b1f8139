import { createFileRoute } from "@tanstack/react-router";
import { Users, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, AiInsight, Badge, Card, PageHeader, SectionLabel, Sheet, StatCard } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { useApp, inr } from "@/lib/store";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Kalaa Setu" },
      { name: "description", content: "Your buyers, what they bought, how much they spend and who to call back." },
      { property: "og:title", content: "Know your customers" },
      { property: "og:description", content: "Purchase history and simple suggestions for repeat sales." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { state } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);
  const c = state.customers.find((x) => x.id === openId);
  const total = state.customers.reduce((s, x) => s + x.spent, 0);
  const repeat = state.customers.filter((x) => x.orders > 1).length;

  return (
    <AppShell>
      <PageHeader title="Customers" subtitle="The people who buy from you" icon={Users} />

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Buyers" value={String(state.customers.length)} hint="All time" />
        <StatCard label="Repeat buyers" value={String(repeat)} hint="Bought twice or more" tone="good" />
        <StatCard label="Total spend" value={inr(total)} hint="From these buyers" tone="primary" />
      </div>

      <Card delay={60}>
        <SectionLabel>
          <Bi>All customers</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          {state.customers.map((x) => (
            <button key={x.id} onClick={() => setOpenId(x.id)} className="frost-tile flex w-full items-center gap-3 p-3 text-left">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-[14px] font-bold text-primary">
                {x.name.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold">{x.name}</span>
                <span className="block truncate text-[12px] text-muted-foreground">
                  {x.place} · {x.orders} orders · {inr(x.spent)}
                </span>
              </span>
              <Badge tone={x.tag === "Bulk buyer" ? "accent" : x.tag === "Regular" ? "good" : x.tag === "Inactive" ? "warn" : "muted"}>
                {x.tag}
              </Badge>
            </button>
          ))}
        </div>
      </Card>

      <AiInsight
        title="Who to call this week"
        body="Three buyers have not ordered in over 60 days but each bought more than once before. A short WhatsApp message with a new photo usually brings a third of them back."
        reasons={[
          "Repeat buyers cost nothing to reach",
          "Festival season is the easiest reason to message",
          "Bulk buyers respond best to a price list, not a single product",
        ]}
      />

      <Sheet open={!!c} onClose={() => setOpenId(null)} title={c?.name ?? "Customer"}>
        {c ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Orders" value={String(c.orders)} />
              <StatCard label="Spent" value={inr(c.spent)} tone="primary" />
            </div>
            <div className="frost-tile p-3.5">
              <p className="text-[12px] font-semibold text-muted-foreground">Last purchase</p>
              <p className="mt-0.5 text-[14px] font-semibold">{c.lastPurchase}</p>
            </div>
            <div className="frost-tile p-3.5">
              <p className="text-[12px] font-semibold text-muted-foreground">Contact</p>
              <p className="mt-0.5 text-[14px] font-semibold">{c.phone} · {c.place}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton variant="soft" onClick={() => toast(`Calling ${c.name}`, { description: c.phone })}>
                <Phone className="mr-1.5 inline size-4" /> Call
              </ActionButton>
              <ActionButton onClick={() => toast.success("WhatsApp message ready", { description: "Photo and price included." })}>
                <MessageCircle className="mr-1.5 inline size-4" /> Message
              </ActionButton>
            </div>
          </div>
        ) : null}
      </Sheet>
    </AppShell>
  );
}
