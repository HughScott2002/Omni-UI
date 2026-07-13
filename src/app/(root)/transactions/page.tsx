"use client";

import { useMemo, useState } from "react";
import SearchInput from "@/components/SearchInput";
import { OmniTransactionsTable } from "@/components/OmniTransactionsTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Settings2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useAccountTransactions } from "@/hooks/useAccountTransactions";
import { Transaction } from "@/lib/transactions";

const TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "deposit", label: "Deposits" },
  { value: "transfer", label: "Transfers" },
  { value: "card_purchase", label: "Card purchases" },
  { value: "fee_charged", label: "Fees" },
  { value: "interest_credited", label: "Interest" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "completed", label: "Success" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const PAGE_SIZE = 50;

function toCsv(transactions: Transaction[]): string {
  const header = [
    "date",
    "description",
    "type",
    "category",
    "status",
    "amount",
    "currency",
    "reference",
    "balanceAfter",
  ];
  const rows = transactions.map((tx) =>
    [
      tx.createdAt,
      `"${(tx.description ?? "").replace(/"/g, '""')}"`,
      tx.transactionType,
      tx.transactionCategory,
      tx.status,
      tx.amount,
      tx.currency,
      tx.reference,
      tx.balanceAfter,
    ].join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

const Transactions = () => {
  const { user } = useAuth();
  const { transactions, status, refetch } = useAccountTransactions(user?.id);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (typeFilter !== "all" && tx.transactionType !== typeFilter)
        return false;
      if (statusFilter !== "all" && tx.status !== statusFilter) return false;
      if (query) {
        const haystack = [
          tx.description,
          tx.metadata?.merchantName as string | undefined,
          tx.reference,
          tx.transactionType,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [transactions, search, typeFilter, statusFilter]);

  const visible = filtered.slice(0, visibleCount);
  const filtersActive = typeFilter !== "all" || statusFilter !== "all";

  const exportCsv = () => {
    const blob = new Blob([toCsv(filtered)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `omni-transactions-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="flex flex-col size-full">
      <header className="w-full h-14 grid grid-cols-2 mb-6">
        <div className="w-full">
          <SearchInput
            type={"desktop"}
            value={search}
            onChange={(value) => {
              setSearch(value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search by merchant, description or reference"
          />
        </div>
        <div className="flex justify-end gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-omni-background-grey rounded-lg flex gap-1 text-omni-blue font-semibold">
                <Settings2 className="size-4" />
                Filters
                {filtersActive && (
                  <span className="size-2 rounded-full bg-omni-blue" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-omni-background-grey w-52">
              <DropdownMenuLabel>Type</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                {TYPE_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={exportCsv}
            disabled={status !== "ready" || filtered.length === 0}
            className="bg-omni-background-grey rounded-lg flex gap-1 text-omni-blue font-semibold"
          >
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </header>

      <OmniTransactionsTable
        transactions={visible}
        state={status}
        onRetry={refetch}
      />

      {status === "ready" && filtered.length > visibleCount && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-full font-semibold text-omni-blue border-2 border-omni-background-grey transition-[background-color,scale] active:scale-[0.96]"
          >
            Show more ({filtered.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </section>
  );
};

export default Transactions;
