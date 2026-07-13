import { describe, expect, it } from "vitest";
import {
  balanceSeries,
  budgetBreakdown,
  monthlyTotals,
  moneyFlowSeries,
  recentActivity,
  sortNewestFirst,
  weeklySeries,
} from "../src/lib/dashboard";
import { Transaction } from "../src/lib/transactions";

const ME = "acct-me";
const WALLET = "wallet-1";
const NOW = new Date("2026-07-13T12:00:00Z");

let counter = 0;
function tx(overrides: Partial<Transaction>): Transaction {
  counter++;
  return {
    id: `tx-${counter}`,
    reference: `REF-${counter}`,
    amount: 100,
    currency: "USD",
    transactionType: "transfer",
    transactionCategory: "debit",
    status: "completed",
    balanceBefore: 0,
    balanceAfter: 0,
    senderAccountId: ME,
    receiverAccountId: "",
    senderWalletId: WALLET,
    receiverWalletId: "",
    createdAt: "2026-07-10T10:00:00Z",
    ...overrides,
  };
}

describe("sortNewestFirst", () => {
  it("orders by createdAt descending regardless of input order", () => {
    const oldest = tx({ createdAt: "2026-01-01T00:00:00Z" });
    const newest = tx({ createdAt: "2026-07-01T00:00:00Z" });
    const middle = tx({ createdAt: "2026-03-01T00:00:00Z" });
    const sorted = sortNewestFirst([oldest, newest, middle]);
    expect(sorted.map((t) => t.id)).toEqual([newest.id, middle.id, oldest.id]);
  });
});

describe("monthlyTotals", () => {
  it("sums this month's credits as income and debits as expenses", () => {
    const txs = [
      tx({
        transactionCategory: "credit",
        amount: 4200,
        senderAccountId: "",
        receiverAccountId: ME,
        createdAt: "2026-07-01T08:00:00Z",
      }),
      tx({ amount: 1450, createdAt: "2026-07-01T10:00:00Z" }),
      tx({ amount: 50, createdAt: "2026-07-05T10:00:00Z" }),
    ];
    const { income, expenses } = monthlyTotals(txs, ME, NOW);
    expect(income).toBe(4200);
    expect(expenses).toBe(1500);
  });

  it("ignores previous months, pending and failed transactions", () => {
    const txs = [
      tx({ amount: 999, createdAt: "2026-06-28T10:00:00Z" }),
      tx({ amount: 999, status: "pending", createdAt: "2026-07-05T10:00:00Z" }),
      tx({ amount: 999, status: "failed", createdAt: "2026-07-06T10:00:00Z" }),
      tx({ amount: 10, createdAt: "2026-07-06T10:00:00Z" }),
    ];
    expect(monthlyTotals(txs, ME, NOW).expenses).toBe(10);
  });

  it("does not count self-transfers (auto-save legs) as income", () => {
    const txs = [
      tx({
        transactionCategory: "credit",
        amount: 500,
        senderAccountId: ME,
        receiverAccountId: ME,
        createdAt: "2026-07-01T11:01:00Z",
      }),
    ];
    expect(monthlyTotals(txs, ME, NOW).income).toBe(0);
  });
});

describe("weeklySeries", () => {
  it("returns one point per week, oldest first", () => {
    const txs = [
      tx({ amount: 70, createdAt: "2026-07-12T10:00:00Z" }), // this week
      tx({ amount: 30, createdAt: "2026-07-03T10:00:00Z" }), // ~1.5 weeks ago
    ];
    const series = weeklySeries(txs, ME, "expenses", NOW, 6);
    expect(series).toHaveLength(6);
    expect(series[5].value).toBe(70);
    expect(series[4].value).toBe(30);
    expect(series.slice(0, 4).every((p) => p.value === 0)).toBe(true);
  });
});

describe("balanceSeries", () => {
  it("reconstructs chronological balances from wallet transactions", () => {
    const txs = [
      tx({ balanceAfter: 900, createdAt: "2026-07-10T10:00:00Z" }),
      tx({ balanceAfter: 1000, createdAt: "2026-07-05T10:00:00Z" }),
    ];
    const series = balanceSeries(txs, WALLET, NOW);
    expect(series.map((p) => p.value)).toEqual([1000, 900]);
  });

  it("only considers the requested wallet and the last 30 days", () => {
    const txs = [
      tx({ balanceAfter: 5, senderWalletId: "other", createdAt: "2026-07-10T10:00:00Z" }),
      tx({ balanceAfter: 7, createdAt: "2026-05-01T10:00:00Z" }),
    ];
    expect(balanceSeries(txs, WALLET, NOW)).toEqual([]);
  });
});

describe("moneyFlowSeries", () => {
  it("buckets expenses across the range", () => {
    const txs = [
      tx({ amount: 40, createdAt: "2026-07-13T09:00:00Z" }),
      tx({ amount: 25, createdAt: "2026-06-20T10:00:00Z" }),
    ];
    const series = moneyFlowSeries(txs, "1M", NOW);
    expect(series).toHaveLength(6);
    expect(series.reduce((sum, p) => sum + p.value, 0)).toBeCloseTo(65);
  });

  it("excludes credits", () => {
    const txs = [
      tx({
        transactionCategory: "credit",
        amount: 4200,
        receiverAccountId: ME,
        createdAt: "2026-07-13T09:00:00Z",
      }),
    ];
    const series = moneyFlowSeries(txs, "1D", NOW);
    expect(series.every((p) => p.value === 0)).toBe(true);
  });
});

describe("budgetBreakdown", () => {
  it("groups by merchant category with largest slices first", () => {
    const txs = [
      tx({
        transactionType: "card_purchase",
        amount: 120,
        metadata: { merchantName: "MegaMart", merchantCategory: "groceries" },
        createdAt: "2026-07-08T10:00:00Z",
      }),
      tx({
        transactionType: "card_purchase",
        amount: 15,
        metadata: { merchantName: "Netflix", merchantCategory: "entertainment" },
        createdAt: "2026-07-09T10:00:00Z",
      }),
      tx({
        transactionType: "transfer",
        amount: 1450,
        description: "Rent — Harbour View Apts",
        createdAt: "2026-07-01T10:00:00Z",
      }),
    ];
    const slices = budgetBreakdown(txs, NOW);
    expect(slices[0]).toEqual({ label: "Rent", amount: 1450 });
    expect(slices[1]).toEqual({ label: "Groceries", amount: 120 });
    expect(slices[2]).toEqual({ label: "Entertainment", amount: 15 });
  });

  it("rolls extra categories into Other", () => {
    const categories = ["food", "shopping", "transport", "utilities", "health", "groceries"];
    const txs = categories.map((category, i) =>
      tx({
        transactionType: "card_purchase",
        amount: 100 - i,
        metadata: { merchantCategory: category },
        createdAt: "2026-07-08T10:00:00Z",
      })
    );
    const slices = budgetBreakdown(txs, NOW, 4);
    expect(slices).toHaveLength(5);
    expect(slices[4].label).toBe("Other");
    expect(slices[4].amount).toBeCloseTo(96 + 95);
  });
});

describe("recentActivity", () => {
  it("returns the newest completed transactions capped at count", () => {
    const txs = [
      tx({ createdAt: "2026-07-01T10:00:00Z" }),
      tx({ createdAt: "2026-07-13T10:00:00Z", status: "pending" }),
      tx({ createdAt: "2026-07-10T10:00:00Z" }),
      tx({ createdAt: "2026-07-11T10:00:00Z" }),
      tx({ createdAt: "2026-07-12T10:00:00Z" }),
    ];
    const recent = recentActivity(txs, 3);
    expect(recent).toHaveLength(3);
    expect(recent[0].createdAt).toBe("2026-07-12T10:00:00Z");
    expect(recent.every((t) => t.status === "completed")).toBe(true);
  });
});
