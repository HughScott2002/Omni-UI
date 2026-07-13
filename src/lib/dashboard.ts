import { Transaction } from "@/lib/transactions";

/**
 * Pure derivation helpers for the dashboard. The backend exposes wallets and
 * raw transaction history but no aggregation endpoints, so every stat, chart
 * and breakdown shown on the dashboard is computed here from the raw data.
 */

export type MoneyFlowRange = "1D" | "5D" | "1M" | "3M" | "6M" | "1Y";

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface BudgetSlice {
  label: string;
  amount: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function sortNewestFirst(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function isSelfTransfer(tx: Transaction, accountId: string): boolean {
  return (
    tx.senderAccountId === accountId && tx.receiverAccountId === accountId
  );
}

function completed(tx: Transaction): boolean {
  return tx.status === "completed";
}

function inWindow(tx: Transaction, from: Date, to: Date): boolean {
  const t = new Date(tx.createdAt).getTime();
  return t >= from.getTime() && t <= to.getTime();
}

export function startOfMonth(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Income and expenses for the month containing `now`. Credits that are pure
 * self-transfers (e.g. auto-save legs into a savings wallet) don't count as
 * income; the matching debit leg does count as spending, which is how budget
 * apps conventionally treat savings contributions.
 */
export function monthlyTotals(
  transactions: Transaction[],
  accountId: string,
  now: Date = new Date()
): { income: number; expenses: number } {
  const from = startOfMonth(now);
  let income = 0;
  let expenses = 0;
  for (const tx of transactions) {
    if (!completed(tx) || !inWindow(tx, from, now)) continue;
    if (tx.transactionCategory === "credit") {
      if (!isSelfTransfer(tx, accountId)) income += tx.amount;
    } else if (tx.transactionCategory === "debit") {
      expenses += tx.amount;
    }
  }
  return { income: round2(income), expenses: round2(expenses) };
}

/**
 * Weekly totals for the mini bar charts on the stat cards — one bar per week,
 * oldest first, covering the last `weeks` weeks.
 */
export function weeklySeries(
  transactions: Transaction[],
  accountId: string,
  kind: "income" | "expenses",
  now: Date = new Date(),
  weeks = 6
): SeriesPoint[] {
  const buckets: SeriesPoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const to = new Date(now.getTime() - i * 7 * DAY_MS);
    const from = new Date(to.getTime() - 7 * DAY_MS);
    let total = 0;
    for (const tx of transactions) {
      if (!completed(tx) || !inWindow(tx, from, to)) continue;
      if (kind === "income") {
        if (tx.transactionCategory === "credit" && !isSelfTransfer(tx, accountId))
          total += tx.amount;
      } else if (tx.transactionCategory === "debit") {
        total += tx.amount;
      }
    }
    buckets.push({ label: `W${weeks - i}`, value: round2(total) });
  }
  return buckets;
}

/**
 * Balance history for the balance mini chart: the wallet balance sampled at
 * (at most) `points` evenly spread transactions over the last 30 days,
 * reconstructed from balanceAfter on the primary wallet's transactions.
 */
export function balanceSeries(
  transactions: Transaction[],
  walletId: string,
  now: Date = new Date(),
  points = 12
): SeriesPoint[] {
  const from = new Date(now.getTime() - 30 * DAY_MS);
  const relevant = sortNewestFirst(
    transactions.filter(
      (tx) =>
        completed(tx) &&
        inWindow(tx, from, now) &&
        (tx.senderWalletId === walletId || tx.receiverWalletId === walletId)
    )
  ).reverse(); // chronological
  if (relevant.length === 0) return [];
  const step = Math.max(1, Math.floor(relevant.length / points));
  const sampled = relevant.filter((_, i) => i % step === 0).slice(-points);
  return sampled.map((tx) => ({
    label: new Date(tx.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    value: round2(tx.balanceAfter),
  }));
}

const RANGE_CONFIG: Record<
  MoneyFlowRange,
  { days: number; buckets: number; label: (d: Date) => string }
> = {
  "1D": { days: 1, buckets: 6, label: (d) => d.toLocaleTimeString("en-US", { hour: "numeric" }) },
  "5D": { days: 5, buckets: 5, label: (d) => d.toLocaleDateString("en-US", { weekday: "short" }) },
  "1M": { days: 30, buckets: 6, label: (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
  "3M": { days: 91, buckets: 6, label: (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
  "6M": { days: 182, buckets: 6, label: (d) => d.toLocaleDateString("en-US", { month: "short" }) },
  "1Y": { days: 365, buckets: 12, label: (d) => d.toLocaleDateString("en-US", { month: "short" }) },
};

/**
 * Expense totals bucketed over the selected range for the Money Flow chart.
 * Bucket labels are the bucket end dates.
 */
export function moneyFlowSeries(
  transactions: Transaction[],
  range: MoneyFlowRange,
  now: Date = new Date()
): SeriesPoint[] {
  const { days, buckets, label } = RANGE_CONFIG[range];
  const windowMs = days * DAY_MS;
  const bucketMs = windowMs / buckets;
  const start = now.getTime() - windowMs;
  const series: SeriesPoint[] = [];
  for (let i = 0; i < buckets; i++) {
    const from = new Date(start + i * bucketMs);
    const to = new Date(start + (i + 1) * bucketMs);
    let total = 0;
    for (const tx of transactions) {
      if (!completed(tx) || tx.transactionCategory !== "debit") continue;
      if (inWindow(tx, from, to)) total += tx.amount;
    }
    series.push({ label: label(to), value: round2(total) });
  }
  return series;
}

/** Date-range label for the Money Flow header, e.g. "Jan 10 – Jul 13". */
export function moneyFlowRangeLabel(
  range: MoneyFlowRange,
  now: Date = new Date()
): string {
  const from = new Date(now.getTime() - RANGE_CONFIG[range].days * DAY_MS);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(from)} – ${fmt(now)}`;
}

const CATEGORY_LABELS: Record<string, string> = {
  food: "Food & Drink",
  groceries: "Groceries",
  restaurants: "Restaurants",
  health: "Health & Fitness",
  entertainment: "Entertainment",
  utilities: "Utilities",
  shopping: "Shopping",
  transport: "Transport",
};

function budgetLabel(tx: Transaction): string {
  const merchantCategory = tx.metadata?.merchantCategory as string | undefined;
  if (merchantCategory) {
    return CATEGORY_LABELS[merchantCategory] ?? capitalize(merchantCategory);
  }
  if (tx.transactionType === "fee_charged") return "Fees";
  if (tx.transactionType === "transfer") {
    if (tx.description?.toLowerCase().includes("rent")) return "Rent";
    if (tx.description?.toLowerCase().includes("sav")) return "Savings";
    return "Transfers";
  }
  return capitalize(tx.transactionType.replace(/_/g, " "));
}

/**
 * This month's spending grouped into the top `slices` categories (largest
 * first) with everything else rolled into "Other".
 */
export function budgetBreakdown(
  transactions: Transaction[],
  now: Date = new Date(),
  slices = 4
): BudgetSlice[] {
  const from = startOfMonth(now);
  const totals = new Map<string, number>();
  for (const tx of transactions) {
    if (!completed(tx) || tx.transactionCategory !== "debit") continue;
    if (!inWindow(tx, from, now)) continue;
    const label = budgetLabel(tx);
    totals.set(label, (totals.get(label) ?? 0) + tx.amount);
  }
  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, slices);
  const rest = sorted.slice(slices).reduce((sum, [, v]) => sum + v, 0);
  const result = top.map(([label, amount]) => ({ label, amount: round2(amount) }));
  if (rest > 0) result.push({ label: "Other", amount: round2(rest) });
  return result;
}

/** Most recent completed transactions for the activity feed. */
export function recentActivity(
  transactions: Transaction[],
  count = 5
): Transaction[] {
  return sortNewestFirst(transactions.filter(completed)).slice(0, count);
}

export function formatMoney(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
