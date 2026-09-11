import { createFileRoute } from "@tanstack/react-router";
import { Truck, MapPin, Clock, IndianRupee } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Badge, Card, ComingSoon, PageHeader, SectionLabel } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { LOGISTICS_PARTNERS } from "@/lib/demo-data";

export const Route = createFileRoute("/logistics")({
  head: () => ({
    meta: [
      { title: "Logistics — Kalaa Setu" },
      { name: "description", content: "Connect nearby delivery partners so orders from your shop reach buyers on time." },
      { property: "og:title", content: "Local delivery partners" },
      { property: "og:description", content: "Same-day local courier to all-India parcel services." },
    ],
  }),
  component: LogisticsPage,
});

function LogisticsPage() {
  const [connected, setConnected] = useState<string[]>(["Bhilwara Local Courier"]);

  const toggle = (name: string) => {
    const on = connected.includes(name);
    setConnected((c) => (on ? c.filter((x) => x !== name) : [...c, name]));
    toast.success(on ? `${name} removed` : `${name} connected`, {
      description: on ? "You can connect again any time." : "They will pick up your parcels.",
    });
  };

  return (
    <AppShell>
      <PageHeader title="Delivery Partners" subtitle="Get your orders to buyers without leaving the village" icon={Truck} />

      <Card>
        <SectionLabel>
          <Bi>Nearby partners</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          {LOGISTICS_PARTNERS.map((p) => {
            const on = connected.includes(p.name);
            return (
              <div key={p.name} className="frost-tile p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[15px] font-semibold">{p.name}</p>
                  <Badge tone={on ? "good" : "muted"}>{on ? "Connected" : p.status}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" /> {p.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" /> {p.eta}
                  </span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="size-3.5" /> {p.cost}
                  </span>
                </div>
                <ActionButton variant={on ? "soft" : "primary"} className="mt-3 w-full" onClick={() => toggle(p.name)}>
                  {on ? "Remove partner" : "Connect partner"}
                </ActionButton>
              </div>
            );
          })}
        </div>
      </Card>

      <Card delay={60}>
        <SectionLabel>
          <Bi>Parcels on the way</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          {[
            { id: "KS-1041", partner: "Bhilwara Local Courier", stage: "Out for delivery", tone: "accent" as const },
            { id: "KS-1039", partner: "India Post Parcel", stage: "In transit — Jaipur", tone: "primary" as const },
          ].map((t) => (
            <div key={t.id} className="frost-tile flex items-center gap-3 p-3.5">
              <Truck className="size-[18px] shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold">{t.id}</p>
                <p className="text-[12px] text-muted-foreground">{t.partner}</p>
              </div>
              <Badge tone={t.tone}>{t.stage}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <ComingSoon
        title="Live tracking and automatic pickup booking"
        note="Connections are simulated for now. Real courier APIs will book pickups and show live tracking."
      />
    </AppShell>
  );
}
