import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import {
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
  Copy,
  Info,
  Plus,
  Snowflake,
  SquareChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { OmniTransactionsTable } from "@/components/test-transactions-table";
import OmniLogo from "./OmniLogo";
import OmniWalletCard from "./OmniWalletCard";
import { getDefaultVirtualCard } from "@/lib/virtualCards";
import { VirtualCard } from "@/types/virtualCard";
import { getWalletTransactions, Transaction } from "@/lib/transactions";
import OmniSendMoney from "./OmniSendMoney";

interface OmniWalletIdProps {
  wallet: OmniWalletData | null;
  formatCurrency: (amount: number, includeSign?: boolean) => string;
}
const OmniWalletId = ({ wallet, formatCurrency }: OmniWalletIdProps) => {
  const [defaultCard, setDefaultCard] = useState<VirtualCard | null>(null);
  const [isLoadingCard, setIsLoadingCard] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    async function fetchDefaultCard() {
      if (wallet?.accountId) {
        setIsLoadingCard(true);
        try {
          const card = await getDefaultVirtualCard(wallet.accountId);
          setDefaultCard(card);
        } catch (error) {
          console.error("Error fetching default card:", error);
        } finally {
          setIsLoadingCard(false);
        }
      }
    }
    fetchDefaultCard();
  }, [wallet?.accountId]);

  useEffect(() => {
    async function fetchTransactions() {
      if (wallet?.walletId) {
        setLoadingTransactions(true);
        try {
          const txs = await getWalletTransactions(wallet.walletId, {
            limit: 10,
          });
          setTransactions(txs);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setLoadingTransactions(false);
        }
      }
    }
    fetchTransactions();
  }, [wallet?.walletId]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className=" flex justify-between w-full px-2 gap-2 text-2xl font-semibold">
          <span className="text-omni-blue font-bold">{wallet?.type}</span>
          <OmniLogo size={8} />
        </h1>
      </div>
      <div className="md:flex size-full gap-6 justify-between">
        {/* Left Column */}
        <div className="space-y-6 border rounded-lg md:w-[70%] ">
          <div className="pt-6 px-6 space-y-6">
            <div className="flex justify-between">
              <div>
                <div className="flex gap-2 items-center text-muted-foreground">
                  <span>Available Balance</span>
                  <Info className="h-4 w-4" />
                </div>
                <h2 className="text-3xl font-semibold">
                  {formatCurrency(wallet?.balance ?? 0.0, false)}
                </h2>
              </div>
              <div className="flex gap-4">
                {/* <Button variant="outline">+ Deposit</Button>
                <Button variant="outline">Transfer</Button> */}
                <Button className="bg-omni-blue rounded-full text-white font-semibold flex justify-between gap-1 hover:bg-omni-blue/60">
                  <Plus className="size-4" />
                  Deposit
                </Button>
                <OmniSendMoney
                  accountId={wallet?.accountId}
                  onSuccess={async () => {
                    // Refresh transactions after successful transfer
                    if (wallet?.updatedAt) {
                      const txs = await getWalletTransactions(wallet.walletId, {
                        limit: 10,
                      });
                      setTransactions(txs);
                    }
                  }}
                  trigger={
                    <Button className="bg-omni-green rounded-full text-white font-semibold flex justify-between gap-1 hover:bg-omni-green/60">
                      <ArrowLeftRight className="size-4" />{" "}
                      <span>Transfer</span>
                      <ChevronDown className="size-4" />
                    </Button>
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div>
                      <div className="text-xs text-omni-pitch-black font-bold">
                        Type
                      </div>
                      <div className="text-base">{wallet?.type}</div>
                    </div>
                    {/* <Skeleton className="h-4 w-24 mb-2 bg-omni-text-grey animate-pulse" />
                    <Skeleton className="h-6 w-32 bg-omni-text-grey animate-pulse" /> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Bottom Left Holder */}
          <div className="flex border-t justify-between px-6 pt-6">
            <div className="flex items-center gap-2 text-green-600">
              <Snowflake />
              {/* <div className="h-2 w-2 bg-green-600 rounded-full" /> */}
              FREEZE CARD
            </div>
            <div className="text-muted-foreground">Next transfer: Jan 15</div>
          </div>
        </div>
        {/* Right Column */}
        <div className="rounded-lg border p-6 space-y-6 md:w-[30%]">
          {/* Virtual Card Section */}
          {isLoadingCard ? (
            <Skeleton className="h-48 w-full bg-omni-text-grey animate-pulse rounded-2xl" />
          ) : defaultCard ? (
            <OmniWalletCard
              balance={defaultCard.availableBalance}
              cardNumber={defaultCard.cardNumber}
              currency={
                defaultCard.currency as "JMD" | "USD" | "JPY" | "GBP" | "EUR"
              }
              cardBrand={defaultCard.cardBrand}
              date={new Date(defaultCard.expiryDate).toLocaleDateString(
                "en-US",
                {
                  month: "2-digit",
                  year: "2-digit",
                }
              )}
            />
          ) : (
            <div className="h-48 w-full border-2 border-dashed rounded-2xl flex items-center justify-center text-omni-text-grey">
              <div className="text-center">
                <p className="text-sm">No virtual card found</p>
                <p className="text-xs mt-2">
                  A default card should be created automatically
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg ">Recent transactions</h3>
          <Button className="bg-omni-background-grey rounded-full text-omni-blue font-semibold">
            View all <ChevronRight className="size-4" />
          </Button>
        </div>
        {loadingTransactions ? (
          <Skeleton className="h-[200px] w-full bg-omni-text-grey animate-pulse" />
        ) : (
          <OmniTransactionsTable transactions={transactions} />
        )}
      </div>
    </div>
  );
};

export default OmniWalletId;
