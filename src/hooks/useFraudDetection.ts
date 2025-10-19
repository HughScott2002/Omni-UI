"use client";

import { useEffect, useState } from "react";
import { FraudDetectionResponse } from "@/types/fraud-detection";

export function useFraudDetection(refreshInterval: number = 3000) {
  const [data, setData] = useState<FraudDetectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/fraud-detection");
        if (!response.ok) {
          throw new Error("Failed to fetch fraud detection data");
        }
        const result: FraudDetectionResponse = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for real-time updates
    const interval = setInterval(fetchData, refreshInterval);

    // Cleanup
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error };
}
