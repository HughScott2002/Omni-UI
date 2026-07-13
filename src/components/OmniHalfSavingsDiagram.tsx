"use client";

import { LucideIcon, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import * as Progress from "@radix-ui/react-progress";
import { FC, useEffect, useMemo, useState } from "react";
import { Transaction } from "@/lib/transactions";
import { formatMoney, startOfMonth } from "@/lib/dashboard";
import { OmniEmpty, OmniOffline, OmniPanelSkeleton } from "./OmniCardState";
import { DashboardStatus } from "@/hooks/useDashboardData";

interface OmniHalfSavingsDiagramProps {
  savingsWallets: OmniWalletData[];
  transactions: Transaction[];
  state?: DashboardStatus;
  onRetry?: () => void;
}

// Tailwind needs literal class names — dynamic `text-${colour}` gets purged.
const PALETTE = [
  { icon: "text-omni-blue bg-omni-blue/20", bar: "bg-omni-blue" },
  { icon: "text-omni-green bg-omni-green/20", bar: "bg-omni-green" },
  { icon: "text-omni-yellow bg-omni-yellow/20", bar: "bg-omni-yellow" },
] as const;

interface SavingsItemProps {
  Icon: LucideIcon;
  label: string;
  sublabel: string;
  amount: string;
  progress: number;
  palette: (typeof PALETTE)[number];
}

const SavingsItem: FC<SavingsItemProps> = ({
  Icon,
  label,
  sublabel,
  amount,
  progress,
  palette,
}) => (
  <div className="w-full h-fit p-4 border-2 rounded-2xl">
    <div className="w-full h-fit flex justify-between items-center">
      <div className="flex gap-4">
        <div className={`rounded-full p-2 ${palette.icon}`}>
          <Icon className="size-5" />
        </div>
        <div className="flex flex-col">
          <h2 className="font-manrope font-extrabold text-sm">{label}</h2>
          <span className="font-manrope font-medium text-omni-text-grey text-xs">
            {sublabel}
          </span>
        </div>
      </div>
      <span className="font-extrabold text-sm text-omni-pitch-black tabular-nums">
        {amount}
      </span>
    </div>
    <ProgressBar value={progress} colourClass={palette.bar} />
  </div>
);

const ProgressBar: FC<{ value: number; colourClass: string }> = ({
  value,
  colourClass,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(Math.min(value, 100)), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Progress.Root
      className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-omni-background-grey"
      style={{ transform: "translateZ(0)" }}
      value={progress}
    >
      <Progress.Indicator
        className={`ease-in size-full transition-transform ${colourClass}`}
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
};

const OmniHalfSavingsDiagram: FC<OmniHalfSavingsDiagramProps> = ({
  savingsWallets,
  transactions,
  state = "ready",
  onRetry,
}) => {
  const savedThisMonth = useMemo(() => {
    const from = startOfMonth(new Date());
    return transactions
      .filter(
        (tx) =>
          tx.status === "completed" &&
          tx.transactionCategory === "credit" &&
          savingsWallets.some((w) => w.walletId === tx.receiverWalletId) &&
          new Date(tx.createdAt) >= from
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions, savingsWallets]);

  return (
    <Card className="my-4 w-full h-[18rem] rounded-3xl border-2 border-omni-background-grey transition-all p-6">
      <CardHeader className="flex flex-row items-center justify-between h-fit w-full p-0 mb-3">
        <h2 className="font-bold text-lg">Savings</h2>
        {state === "ready" && savingsWallets.length > 0 && (
          <span className="rounded-lg text-xs h-8 px-3 inline-flex items-center bg-omni-background-grey font-semibold tabular-nums">
            +{formatMoney(savedThisMonth)} this month
          </span>
        )}
      </CardHeader>
      <CardContent className="h-[80%] overflow-y-auto flex flex-col gap-2 px-2">
        {state === "loading" ? (
          <OmniPanelSkeleton rows={3} />
        ) : state === "error" ? (
          <OmniOffline onRetry={onRetry} />
        ) : savingsWallets.length === 0 ? (
          <OmniEmpty
            title="No savings wallets yet"
            hint="Open a savings wallet to start putting money aside"
            icon={<PiggyBank className="size-5" />}
          />
        ) : (
          savingsWallets.map((wallet, index) => {
            const goal = wallet.monthlyLimit || 0;
            const progress = goal > 0 ? (wallet.balance / goal) * 100 : 0;
            return (
              <SavingsItem
                key={wallet.walletId}
                Icon={index === 0 ? PiggyBank : index === 1 ? Wallet : TrendingUp}
                label={`${wallet.currency} Savings`}
                sublabel={
                  goal > 0
                    ? `${Math.round(progress)}% of ${formatMoney(
                        goal,
                        wallet.currency
                      )} goal`
                    : "No goal set"
                }
                amount={formatMoney(wallet.balance, wallet.currency)}
                progress={progress}
                palette={PALETTE[index % PALETTE.length]}
              />
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default OmniHalfSavingsDiagram;
