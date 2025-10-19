"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Copy, CreditCard, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { OmniTransactionsTable } from "@/components/test-transactions-table";
import { useEffect, useState } from "react";
import { getWallets } from "@/lib/fetch";
import WalletIdSkeleton from "@/components/OmniWalletIdSeleton";
import OmniWalletId from "@/components/OmniWalletId";
//TODO: FIX THE SINGLE WALLET FETCHING

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
      const data: OmniWalletData[] = await getWallets(params.id);
      if (data) {
        // Type assertion to handle the mismatch
        setWallet(data as unknown as OmniWalletData);
      }
    }
    fetchWallet();
  }, [params.id]);

  if (!wallet) {
    return <WalletIdSkeleton />;
  }

  return <OmniWalletId wallet={wallet} formatCurrency={formatCurrency} />;
}
