"use client";

import { useCallback, useEffect, useState } from "react";
import { getProfile, UserProfile } from "@/lib/settings";
import { DashboardStatus } from "@/hooks/useDashboardData";

/** Full profile for the signed-in account, with reload support. */
export function useProfile(accountId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<DashboardStatus>("loading");

  const load = useCallback(async () => {
    if (!accountId) return;
    setStatus("loading");
    try {
      setProfile(await getProfile(accountId));
      setStatus("ready");
    } catch (error) {
      console.error("Failed to load profile:", error);
      setStatus("error");
    }
  }, [accountId]);

  useEffect(() => {
    load();
  }, [load]);

  return { profile, status, refetch: load };
}
