"use client";

import { useEffect, useState } from "react";
import { getWallet } from "@/lib/fetch";
import WalletIdSkeleton from "@/components/OmniWalletIdSeleton";
import OmniWalletId from "@/components/OmniWalletId";

export default function Page({ params }: { params: { id: string } }) {
  const formatCurrency = (amount: number, includeSign = true) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    return includeSign ? (amount < 0 ? `-${formatted}` : formatted) : formatted;
  };
  const [wallet, setWallet] = useState<OmniWalletData | null>(null);

  useEffect(() => {
    async function fetchWallet() {
      const data = await getWallet(params.id);
      if (data) {
        setWallet(data);
      }
    }
    fetchWallet();
  }, [params.id]);

  if (!wallet) {
    return <WalletIdSkeleton />;
  }

  return <OmniWalletId wallet={wallet} formatCurrency={formatCurrency} />;
}
