"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Transaction } from "@/lib/transactions";
import { sortNewestFirst } from "@/lib/dashboard";

export type DashboardStatus = "loading" | "ready" | "error";

export interface DashboardData {
  wallets: OmniWalletData[];
  defaultWallet: OmniWalletData | null;
  savingsWallets: OmniWalletData[];
  transactions: Transaction[]; // newest first
}

const EMPTY: DashboardData = {
  wallets: [],
  defaultWallet: null,
  savingsWallets: [],
  transactions: [],
};

/**
 * Loads everything the dashboard needs in one place: wallets and transaction
 * history for the signed-in account. `status` is "error" only when the
 * backend is unreachable/failing — an empty account is still "ready" (the
 * cards render their empty states instead of the offline fallback).
 */
export function useDashboardData(accountId: string | undefined) {
  const [data, setData] = useState<DashboardData>(EMPTY);
  const [status, setStatus] = useState<DashboardStatus>("loading");

  const load = useCallback(async () => {
    if (!accountId) return;
    setStatus("loading");
    try {
      const [wallets, transactions] = await Promise.all([
        apiFetch<OmniWalletData[]>(`/api/wallets/list/${accountId}`),
        apiFetch<Transaction[]>(
          `/api/transactions/account/${accountId}?limit=500`
        ),
      ]);
      setData({
        wallets,
        defaultWallet:
          wallets.find((w) => w.isDefault && w.type === "PRIMARY") ??
          wallets.find((w) => w.isDefault) ??
          wallets[0] ??
          null,
        savingsWallets: wallets.filter((w) => w.type === "SAVINGS"),
        // The in-memory backend returns insertion order, Redis returns
        // newest-first — sort here so the UI never depends on storage mode.
        // Dedupe by id: self-transfers can be listed under both the sender
        // and receiver index of the same account.
        transactions: sortNewestFirst(
          Array.from(new Map(transactions.map((tx) => [tx.id, tx])).values())
        ),
      });
      setStatus("ready");
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setStatus("error");
    }
  }, [accountId]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, status, refetch: load };
}
