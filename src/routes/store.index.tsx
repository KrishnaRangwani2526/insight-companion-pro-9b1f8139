import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, Globe, Palette, Eye, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Badge, Card, ComingSoon, PageHeader, RowLink, SectionLabel, StatCard } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { useApp, inr } from "@/lib/store";

export const Route = createFileRoute("/store/")({
  head: () => ({
    meta: [
      { title: "My Store — Kalaa Setu" },
      { name: "description", content: "Your own online shop built from your catalogue — one tap to create, customise and publish." },
      { property: "og:title", content: "Your own online store" },
      { property: "og:description", content: "A real shop link you can send to any buyer." },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const { state, update } = useApp();
  const s = state.store;
  const url = `${s.slug}.business.com`;
  const liveProducts = state.products.filter((p) => p.status === "active");
  const value = liveProducts.reduce((sum, p) => sum + p.price * p.stock, 0);

  if (!s.published) {
    return (
      <AppShell>
        <PageHeader title="My Store" subtitle="Turn your catalogue into a real online shop" icon={Store} />
        <Card>
          <p className="text-[16px] leading-relaxed font-semibold">
            You already have everything needed for an online shop.
          </p>
          <ul className="mt-3 space-y-2 text-[14px] text-muted-foreground">
            <li>✓ Business name, logo and story</li>
            <li>✓ {state.products.length} products with photos and prices</li>
            <li>✓ Your location and WhatsApp number</li>
          </ul>
          <Link
            to="/store/create"
            className="mt-5 flex min-h-13 w-full items-center justify-center rounded-2xl bg-primary text-[16px] font-semibold text-primary-foreground"
          >
            Build My Online Store
          </Link>
          <p className="mt-2 text-center text-[12px] text-muted-foreground">Takes about one minute. No cost.</p>
        </Card>
        <ComingSoon title="Your own paid domain name" note="The demo uses a safe placeholder address. Real domain registration comes later." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="My Store"
        subtitle="Your shop is live"
        icon={Store}
        action={<Badge tone="good">Published</Badge>}
      />

      <Card>
        <SectionLabel>
          <Bi>Your shop address</Bi>
        </SectionLabel>
        <div className="frost-tile flex items-center gap-3 p-3.5">
          <Globe className="size-[18px] shrink-0 text-primary" />
          <p className="min-w-0 flex-1 truncate font-mono text-[14px] font-semibold">{url}</p>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(`https://${url}`);
              toast.success("Link copied — send it on WhatsApp");
            }}
            className="shrink-0 rounded-xl bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground"
          >
            <Share2 className="mr-1 inline size-3.5" /> Share
          </button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Demo address. Your real shop address is set up when you go live.
        </p>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Products live" value={String(liveProducts.length)} hint="Visible to buyers" tone="good" />
        <StatCard label="Shop value" value={inr(value)} hint="Stock on sale" />
        <StatCard label="Visitors" value="184" hint="Last 7 days" tone="accent" />
      </div>

      <Card delay={60}>
        <SectionLabel>
          <Bi>App and shop are connected</Bi>
        </SectionLabel>
        <div className="flex items-center gap-3 rounded-2xl bg-good-soft p-3.5">
          <RefreshCw className="size-[18px] shrink-0 text-good" />
          <p className="text-[13px] leading-relaxed font-semibold text-good">
            Synced — change a price or stock in the app and your shop updates at once.
          </p>
        </div>
        <ActionButton
          variant="soft"
          className="mt-3 w-full"
          onClick={() => toast.success("All changes synced", { description: "Your shop shows the latest prices and stock." })}
        >
          Sync now
        </ActionButton>
      </Card>

      <section>
        <SectionLabel>
          <Bi>Manage your shop</Bi>
        </SectionLabel>
        <div className="space-y-2.5">
          <RowLink icon={Eye} label="See my shop" sub="Exactly what buyers see" to="/store/preview" />
          <RowLink icon={Palette} label="Change the look" sub="Theme, banner, about and contact" to="/store/customize" />
          <RowLink
            icon={Store}
            label="Take shop offline"
            sub="Hide it from buyers for now"
            onClick={() => {
              update({ store: { ...s, published: false } });
              toast("Your shop is hidden. You can publish it again any time.");
            }}
          />
        </div>
      </section>
    </AppShell>
  );
}
