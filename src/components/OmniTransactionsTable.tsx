"use client";

import React from "react";
import { ArrowUpDown, ChevronDown, type LucideIcon } from "lucide-react";
import { Transaction } from "@/lib/transactions";
import { formatMoney } from "@/lib/dashboard";
import { OmniEmpty, OmniOffline, OmniPanelSkeleton } from "./OmniCardState";
import { DashboardStatus } from "@/hooks/useDashboardData";

const tableHeaders: { label: string; icon: LucideIcon }[] = [
  { label: "Name/Business", icon: ArrowUpDown },
  { label: "Date", icon: ChevronDown },
  { label: "Reference", icon: ChevronDown },
  { label: "Amount", icon: ChevronDown },
  { label: "Status", icon: ChevronDown },
];

const TableHeaderMaker = ({
  label,
  icon: Icon,
}: {
  label: string;
  icon: LucideIcon;
}) => (
  <div className="py-2 flex items-center gap-2">
    <span className="text-sm font-bold text-omni-pitch-black">{label}</span>
    <Icon className="size-5 text-omni-pitch-black cursor-pointer" />
  </div>
);

const STATUS_LABELS: Record<string, string> = {
  completed: "Success",
  pending: "Pending",
  failed: "Failed",
  reversed: "Reversed",
  cancelled: "Cancelled",
};

const statusClasses = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-omni-green/10 text-omni-green";
    case "pending":
      return "bg-omni-blue/10 text-omni-blue";
    default:
      return "bg-omni-red/10 text-omni-red";
  }
};

interface OmniTransactionsTableProps {
  transactions: Transaction[];
  state?: DashboardStatus;
  onRetry?: () => void;
}

export function OmniTransactionsTable({
  transactions,
  state = "ready",
  onRetry,
}: OmniTransactionsTableProps) {
  if (state === "loading") {
    return <OmniPanelSkeleton rows={6} />;
  }
  if (state === "error") {
    return (
      <div className="h-64">
        <OmniOffline onRetry={onRetry} />
      </div>
    );
  }
  if (transactions.length === 0) {
    return (
      <div className="h-64">
        <OmniEmpty
          title="No transactions found"
          hint="Payments and transfers will show up here"
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-y-auto">
      <table className="min-w-full">
        <thead className="border-b">
          <tr>
            {tableHeaders.map((header, index) => (
              <TableHeader key={index}>
                <TableHeaderMaker label={header.label} icon={header.icon} />
              </TableHeader>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-omni-background-grey">
          {transactions.map((tx) => {
            const created = new Date(tx.createdAt);
            const isCredit = tx.transactionCategory === "credit";
            const name =
              (tx.metadata?.merchantName as string) ||
              tx.description ||
              tx.transactionType.replace(/_/g, " ");
            return (
              <tr key={tx.id} className="hover:bg-omni-background-grey">
                <TableCell>
                  <div className="flex items-center">
                    <div className="size-12 flex-shrink-0 rounded-xl bg-omni-background-grey flex items-center justify-center font-bold text-omni-text-grey uppercase">
                      {name.charAt(0)}
                    </div>
                    <div className="ml-4 cursor-default">
                      <div className="font-bold text-omni-pitch-black text-base">
                        {name}
                      </div>
                      <div className="text-omni-text-grey text-sm capitalize">
                        {tx.transactionType.replace(/_/g, " ")}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="uppercase">
                    {created.toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-gray-500 cursor-default uppercase">
                    At{" "}
                    {created.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-omni-pitch-black cursor-default">
                    {tx.reference}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-bold cursor-default tabular-nums ${
                      isCredit ? "text-omni-green" : "text-omni-pitch-black"
                    }`}
                  >
                    {isCredit ? "+" : "−"}
                    {formatMoney(tx.amount, tx.currency)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-lg cursor-default ${statusClasses(
                      tx.status
                    )}`}
                  >
                    {STATUS_LABELS[tx.status] ?? tx.status}
                  </span>
                </TableCell>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 whitespace-nowrap">{children}</td>;
}
