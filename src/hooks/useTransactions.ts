"use client";

import { useEffect, useState } from "react";
import { FraudTransaction } from "@/types/transaction";

export function useTransactions(pollInterval: number = 2000) {
  const [transactions, setTransactions] = useState<FraudTransaction[]>([]);
  const [newTransactionIds, setNewTransactionIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchInitialData = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data.transactions);
        setLoading(false);

        // Start polling after initial load
        startPolling();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    const pollForNewTransactions = async () => {
      try {
        const response = await fetch("/api/transactions?poll=true");
        if (!response.ok) {
          throw new Error("Failed to poll transactions");
        }
        const data = await response.json();

        if (data.transactions.length > 0) {
          const newTxns = data.transactions;

          console.log("New transactions received:", newTxns.length);

          // Add new transactions to the beginning
          setTransactions((prev) => [...newTxns, ...prev]);

          // Mark as new for animation
          const newIds = new Set<string>(newTxns.map((txn: FraudTransaction) => txn.id));
          setNewTransactionIds(newIds);

          // Remove "new" status after animation completes
          setTimeout(() => {
            setNewTransactionIds(new Set());
          }, 1000);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    const startPolling = () => {
      interval = setInterval(pollForNewTransactions, pollInterval);
    };

    fetchInitialData();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [pollInterval]);

  return { transactions, loading, error, newTransactionIds };
}
