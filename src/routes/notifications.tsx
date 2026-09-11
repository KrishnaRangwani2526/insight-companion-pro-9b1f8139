import { createFileRoute } from "@tanstack/react-router";
import { Bell, Package, IndianRupee, Truck, Sparkles, Megaphone } from "lucide-react";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader, SectionLabel } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Kalaa Setu" },
      { name: "description", content: "New orders, low stock warnings, payment reminders and AI suggestions for your business." },
      { property: "og:title", content: "Notifications" },
      { property: "og:description", content: "Everything that needs your attention today." },
    ],
  }),
  component: NotificationsPage,
});

const ITEMS = [
  { icon: Package, tone: "text-primary", title: "New order from Meera Sharma", body: "1 × Handwoven Cotton Shawl · ₹1,250 · Cash on delivery", when: "10 minutes ago", today: true },
  { icon: IndianRupee, tone: "text-good", title: "Payment received", body: "₹2,400 credited for order #KS-1043", when: "2 hours ago", today: true },
  { icon: Sparkles, tone: "text-accent", title: "AI suggestion", body: "Terracotta vases sell 40% more in the festival weeks. Consider making 10 more.", when: "5 hours ago", today: true },
  { icon: Truck, tone: "text-primary", title: "Order shipped", body: "Order #KS-1041 picked up by Bhilwara Local Courier", when: "Yesterday", today: false },
  { icon: Package, tone: "text-warn", title: "Low stock", body: "Embroidered Jhola Bag has only 2 pieces left", when: "Yesterday", today: false },
  { icon: Megaphone, tone: "text-accent", title: "Your reel was published", body: "We posted your shawl reel on our social page — 1,240 views so far", when: "2 days ago", today: false },
];

function NotificationsPage() {
  const { state, update } = useApp();

  useEffect(() => {
    if (!state.notificationsRead) update({ notificationsRead: true });
  }, [state.notificationsRead, update]);

  return (
    <AppShell>
      <PageHeader title="Notifications" subtitle="What needs your attention" icon={Bell} />

      {(["today", "earlier"] as const).map((group) => {
        const list = ITEMS.filter((i) => (group === "today" ? i.today : !i.today));
        return (
          <section key={group}>
            <SectionLabel>{group === "today" ? "Today" : "Earlier"}</SectionLabel>
            <div className="space-y-2.5">
              {list.map((n) => (
                <Card key={n.title} className="flex items-start gap-3 p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2">
                    <n.icon className={`size-[18px] ${n.tone}`} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold">
                      <Bi>{n.title}</Bi>
                    </p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{n.when}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </AppShell>
  );
}
