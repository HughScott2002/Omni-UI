"use client";

import Link from "next/link";
import { FC } from "react";
import OmniSmallTransactionComponent from "./OmniSmallTransactionComponent";
import { Button } from "./ui/button";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  Landmark,
  PiggyBank,
  Receipt,
} from "lucide-react";
import { Transaction } from "@/lib/transactions";
import { formatMoney } from "@/lib/dashboard";
import { OmniEmpty, OmniOffline, OmniPanelSkeleton } from "./OmniCardState";
import { DashboardStatus } from "@/hooks/useDashboardData";

interface OmniDashboardRecentActivityProps {
  transactions: Transaction[];
  accountId: string;
  state?: DashboardStatus;
  onRetry?: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
  card_purchase: "Card payment",
  card_refund: "Refund",
  reversal: "Reversal",
  fee_charged: "Fee",
  interest_credited: "Interest",
};

function transactionIcon(tx: Transaction, isCredit: boolean) {
  const disc = (icon: React.ReactNode, classes: string) => (
    <div
      className={`size-12 rounded-xl flex items-center justify-center ${classes}`}
    >
      {icon}
    </div>
  );
  switch (tx.transactionType) {
    case "card_purchase":
      return disc(<CreditCard className="size-5" />, "bg-omni-dark-blue/10 text-omni-dark-blue");
    case "deposit":
      return disc(<Landmark className="size-5" />, "bg-omni-green/10 text-omni-green");
    case "interest_credited":
      return disc(<PiggyBank className="size-5" />, "bg-omni-green/10 text-omni-green");
    case "fee_charged":
      return disc(<Receipt className="size-5" />, "bg-omni-yellow/20 text-omni-dark-blue");
    default:
      return isCredit
        ? disc(<ArrowDownLeft className="size-5" />, "bg-omni-green/10 text-omni-green")
        : disc(<ArrowUpRight className="size-5" />, "bg-omni-blue/10 text-omni-blue");
  }
}

const OmniDashboardRecentActivity: FC<OmniDashboardRecentActivityProps> = ({
  transactions,
  accountId,
  state = "ready",
  onRetry,
}) => {
  return (
    <div className="min-h-fit w-full flex flex-col">
      <h2 className="flex w-full my-4 justify-between items-center sticky top-0">
        <span className="w-full font-poppins font-semibold text-lg">
          Recent Activity
        </span>
        <Link href={"/transactions"}>
          <Button className="bg-omni-background-grey rounded-full text-omni-blue font-semibold transition-[background-color,scale] active:scale-[0.96]">
            View all <ChevronRight className="size-4" />
          </Button>
        </Link>
      </h2>

      <div className="flex-1 min-h-2">
        {state === "loading" ? (
          <OmniPanelSkeleton rows={4} />
        ) : state === "error" ? (
          <OmniOffline onRetry={onRetry} />
        ) : transactions.length === 0 ? (
          <OmniEmpty
            title="No activity yet"
            hint="Your latest transactions will show up here"
          />
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto">
            {transactions.map((tx) => {
              const isCredit =
                tx.transactionCategory === "credit" ||
                tx.receiverAccountId === accountId;
              const created = new Date(tx.createdAt);
              return (
                <OmniSmallTransactionComponent
                  key={tx.id}
                  transationLabel={
                    (tx.metadata?.merchantName as string) ||
                    tx.description ||
                    TYPE_LABELS[tx.transactionType] ||
                    "Transaction"
                  }
                  type={TYPE_LABELS[tx.transactionType] ?? tx.transactionType}
                  date={created.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  Time={created.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                  href={"/transactions"}
                  icon={transactionIcon(tx, isCredit)}
                  amount={`${isCredit ? "+" : "−"}${formatMoney(
                    tx.amount,
                    tx.currency
                  )}`}
                  amountClass={
                    isCredit ? "text-omni-green" : "text-omni-pitch-black"
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OmniDashboardRecentActivity;
