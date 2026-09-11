export interface SchemeResult {
  projectCost: number;
  maxLoan: number;
  scheme: "micro" | "term" | "over-limit";
  title: string;
  interest: number;
  tenureYears: number;
  moratoriumMonths: number;
  maxAgencyFunding: number;
  note: string;
}

/** Margin money -> project cost -> scheme routing. */
export function routeScheme(marginCapital: number, marginPercent = 10): SchemeResult {
  const projectCost = marginCapital / (marginPercent / 100);
  const maxLoan = projectCost - marginCapital;

  if (projectCost <= 140000) {
    return {
      projectCost,
      maxLoan,
      scheme: "micro",
      title: "Micro Finance Scheme",
      interest: 6.5,
      tenureYears: 3,
      moratoriumMonths: 3,
      maxAgencyFunding: 125000,
      note: "Suited to small tool, loom or stock purchases.",
    };
  }
  if (projectCost <= 5000000) {
    return {
      projectCost,
      maxLoan,
      scheme: "term",
      title: "Term Loan Scheme",
      interest: 8,
      tenureYears: 7,
      moratoriumMonths: 6,
      maxAgencyFunding: 4500000,
      note: "Suited to workshop expansion, machinery or a production unit.",
    };
  }
  return {
    projectCost,
    maxLoan,
    scheme: "over-limit",
    title: "Project exceeds current scheme limit",
    interest: 0,
    tenureYears: 0,
    moratoriumMonths: 0,
    maxAgencyFunding: 0,
    note: "Reduce the project size or explore other financing routes such as consortium lending.",
  };
}

export interface EmiResult {
  emi: number;
  quarterly: number;
  totalInterest: number;
  totalRepayment: number;
  moratoriumInterest: number;
  firstPaymentLabel: string;
  months: number;
}

export function calculateEmi(
  principal: number,
  annualRate: number,
  tenureYears: number,
  moratoriumMonths: number,
): EmiResult {
  const months = Math.max(1, Math.round(tenureYears * 12));
  const r = annualRate / 12 / 100;
  const emi = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalRepayment = emi * months;
  const moratoriumInterest = principal * r * moratoriumMonths;
  const first = new Date();
  first.setMonth(first.getMonth() + moratoriumMonths + 1);
  return {
    emi,
    quarterly: emi * 3,
    totalInterest: totalRepayment - principal,
    totalRepayment,
    moratoriumInterest,
    firstPaymentLabel: first.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    months,
  };
}

export interface PnlInput {
  revenue: number;
  rawMaterial: number;
  labour: number;
  transport: number;
  packaging: number;
  rent: number;
  utilities: number;
  marketing: number;
  other: number;
}

export function calculatePnl(i: PnlInput) {
  const variable = i.rawMaterial + i.labour + i.transport + i.packaging;
  const fixed = i.rent + i.utilities + i.marketing + i.other;
  const expenses = variable + fixed;
  const netProfit = i.revenue - expenses;
  const margin = i.revenue > 0 ? (netProfit / i.revenue) * 100 : 0;
  const contributionRatio = i.revenue > 0 ? (i.revenue - variable) / i.revenue : 0;
  const breakEven = contributionRatio > 0 ? fixed / contributionRatio : 0;
  return { expenses, variable, fixed, netProfit, margin, breakEven };
}
