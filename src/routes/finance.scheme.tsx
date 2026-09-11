import { createFileRoute, Link } from "@tanstack/react-router";
import { Landmark, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Badge, Card, ComingSoon, Field, PageHeader, SectionLabel, inputClass } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { routeScheme } from "@/services/financeService";
import { inr } from "@/lib/store";

export const Route = createFileRoute("/finance/scheme")({
  head: () => ({
    meta: [
      { title: "Scheme Calculator — Kalaa Setu" },
      { name: "description", content: "Enter the money you can put in and see which loan scheme fits your project, with the loan amount and terms." },
      { property: "og:title", content: "Scheme Calculator for artisans" },
      { property: "og:description", content: "From your own capital to the right scheme and loan size." },
    ],
  }),
  component: SchemePage,
});

function SchemePage() {
  const [capital, setCapital] = useState("50000");
  const [marginPercent, setMarginPercent] = useState("10");

  const result = useMemo(
    () => routeScheme(Number(capital) || 0, Number(marginPercent) || 10),
    [capital, marginPercent],
  );

  return (
    <AppShell>
      <PageHeader title="Scheme Calculator" subtitle="How much support can your project get?" icon={Landmark} />

      <Card>
        <SectionLabel>
          <Bi>Your own money</Bi>
        </SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Margin capital you have (₹)" hint="The money you can put in yourself">
            <input className={inputClass} inputMode="numeric" value={capital} onChange={(e) => setCapital(e.target.value)} />
          </Field>
          <Field label="Your share (%)" hint="Usually 10%">
            <input className={inputClass} inputMode="numeric" value={marginPercent} onChange={(e) => setMarginPercent(e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-surface-2 p-3.5">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">Your money</p>
            <p className="font-mono text-[15px] font-bold">{inr(Number(capital) || 0)}</p>
          </div>
          <ArrowRight className="size-4 text-muted-foreground" />
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">Total project cost</p>
            <p className="font-mono text-[15px] font-bold text-primary">{inr(result.projectCost)}</p>
          </div>
        </div>
      </Card>

      <Card delay={60}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <SectionLabel>
              <Bi>Scheme that fits</Bi>
            </SectionLabel>
            <p className="text-[19px] leading-tight font-bold">{result.title}</p>
          </div>
          <Badge tone={result.scheme === "over-limit" ? "danger" : "good"}>
            {result.scheme === "micro" ? "Micro" : result.scheme === "term" ? "Term loan" : "Over limit"}
          </Badge>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{result.note}</p>

        {result.scheme !== "over-limit" ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Box label="Loan you can ask for" value={inr(Math.min(result.maxLoan, result.maxAgencyFunding))} highlight />
              <Box label="Interest rate" value={`${result.interest}% a year`} />
              <Box label="Repayment period" value={`${result.tenureYears} years`} />
              <Box label="No-payment period" value={`${result.moratoriumMonths} months`} />
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Maximum funding under this scheme is {inr(result.maxAgencyFunding)}.
            </p>
            <Link
              to="/finance/emi"
              className="mt-4 flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground"
            >
              See my monthly instalment
            </Link>
          </>
        ) : (
          <ActionButton variant="soft" className="mt-4 w-full" onClick={() => setCapital("400000")}>
            Try a smaller project
          </ActionButton>
        )}

        <p className="mt-4 rounded-2xl bg-surface-2 px-4 py-3 text-[12px] leading-relaxed text-muted-foreground">
          Estimated based on the scheme parameters entered. Final terms are decided by the lending bank or agency.
        </p>
      </Card>

      <ComingSoon
        title="Applying for the loan from inside the app"
        note="Today this is a planning calculator. Direct applications to banks and agencies are being built."
      />
    </AppShell>
  );
}

function Box({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={highlight ? "rounded-2xl bg-primary-soft p-3.5" : "rounded-2xl bg-surface-2 p-3.5"}>
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className={"mt-1 font-mono text-[17px] font-bold" + (highlight ? " text-primary" : "")}>{value}</p>
    </div>
  );
}
