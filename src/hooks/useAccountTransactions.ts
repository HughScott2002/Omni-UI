"use client";

import { useCallback, useEffect, useState } from "react";
import { getAccountTransactions, Transaction } from "@/lib/transactions";
import { sortNewestFirst } from "@/lib/dashboard";
import { DashboardStatus } from "@/hooks/useDashboardData";

/**
 * Full transaction history for an account, newest first, deduped (the
 * backend lists self-transfers under both sender and receiver of the same
 * account). "error" means the backend is unreachable; an empty history is
 * still "ready".
 */
export function useAccountTransactions(accountId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState<DashboardStatus>("loading");

  const load = useCallback(async () => {
    if (!accountId) return;
    setStatus("loading");
    try {
      const history = await getAccountTransactions(accountId, { limit: 500 });
      setTransactions(
        sortNewestFirst(
          Array.from(new Map(history.map((tx) => [tx.id, tx])).values())
        )
      );
      setStatus("ready");
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setStatus("error");
    }
  }, [accountId]);

  useEffect(() => {
    load();
  }, [load]);

  return { transactions, status, refetch: load };
}
