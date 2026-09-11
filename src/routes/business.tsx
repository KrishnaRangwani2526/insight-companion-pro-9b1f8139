import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, BadgeCheck, Target, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Bi } from "@/components/Bi";
import { ActionButton, Badge, Card, Field, PageHeader, SectionLabel, Sheet, inputClass } from "@/components/ui-kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "My Business — Kalaa Setu" },
      { name: "description", content: "Your business profile: name, owner, craft, village and goals — the details every listing and store page uses." },
      { property: "og:title", content: "My Business profile" },
      { property: "og:description", content: "Keep your craft business details in one place." },
    ],
  }),
  component: BusinessPage,
});

function BusinessPage() {
  const { state, update } = useApp();
  const b = state.business;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(b);

  const save = () => {
    update({ business: draft });
    setOpen(false);
    toast.success("Business details saved");
  };

  return (
    <AppShell>
      <PageHeader
        title="My Business"
        subtitle="These details appear on your store and every listing"
        icon={Building2}
        action={
          <ActionButton variant="soft" onClick={() => { setDraft(b); setOpen(true); }}>
            <Pencil className="mr-1.5 inline size-4" /> Edit
          </ActionButton>
        }
      />

      <Card>
        <div className="flex items-start gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-primary text-[22px] font-bold text-primary-foreground">
            {b.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <h2 className="text-[20px] leading-tight font-bold">{b.name}</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {b.owner} · {b.category}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone="primary">{b.type}</Badge>
              {b.verified ? (
                <Badge tone="good">
                  <BadgeCheck className="mr-1 inline size-3" /> Verified by salesman
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-foreground/85">{b.about}</p>
      </Card>

      <Card delay={60}>
        <SectionLabel>
          <Bi>Where you are</Bi>
        </SectionLabel>
        <div className="frost-tile flex items-start gap-3 p-3.5">
          <MapPin className="mt-0.5 size-[18px] shrink-0 text-primary" />
          <p className="text-[14px] leading-relaxed">
            {b.village}, Block {b.block}
            <br />
            {b.district}, {b.state} — {b.pin}
          </p>
        </div>
      </Card>

      <Card delay={120}>
        <SectionLabel>
          <Bi>Your goals</Bi>
        </SectionLabel>
        <ul className="space-y-2">
          {b.goals.map((g) => (
            <li key={g} className="frost-tile flex items-center gap-3 p-3 text-[14px] font-medium">
              <Target className="size-[18px] shrink-0 text-accent" />
              {g}
            </li>
          ))}
        </ul>
      </Card>

      <Sheet open={open} onClose={() => setOpen(false)} title="Edit business details">
        <div className="space-y-3">
          <Field label="Business name">
            <input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Owner name">
            <input className={inputClass} value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} />
          </Field>
          <Field label="Village">
            <input className={inputClass} value={draft.village} onChange={(e) => setDraft({ ...draft, village: e.target.value })} />
          </Field>
          <Field label="District">
            <input className={inputClass} value={draft.district} onChange={(e) => setDraft({ ...draft, district: e.target.value })} />
          </Field>
          <Field label="About your business">
            <textarea
              rows={3}
              className={inputClass + " py-3"}
              value={draft.about}
              onChange={(e) => setDraft({ ...draft, about: e.target.value })}
            />
          </Field>
          <ActionButton className="w-full" onClick={save}>
            Save
          </ActionButton>
        </div>
      </Sheet>
    </AppShell>
  );
}
