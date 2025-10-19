"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  Search,
  History,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FraudTransaction, TransactionStatus } from "@/types/transaction";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TableHeaderMakerProps = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
};

const TableHeaderMaker = ({
  label,
  icon: Icon,
  onClick,
}: TableHeaderMakerProps) => {
  return (
    <div
      className="py-2 flex items-center gap-2 cursor-pointer"
      onClick={onClick}
    >
      <span className="text-sm font-bold text-omni-pitch-black">{label}</span>
      {Icon && <Icon className="size-5 text-omni-pitch-black" />}
    </div>
  );
};

interface FraudTransactionsTableProps {
  transactions: FraudTransaction[];
  newTransactionIds: Set<string>;
}

export function FraudTransactionsTable({
  transactions,
  newTransactionIds,
}: FraudTransactionsTableProps) {
  const [statusFilters, setStatusFilters] = useState<Set<TransactionStatus>>(
    new Set(["Approved", "Fraud", "Pending"])
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof FraudTransaction | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchingHistory, setIsSearchingHistory] = useState(false);
  const [historicalResults, setHistoricalResults] = useState<
    FraudTransaction[]
  >([]);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const toggleStatusFilter = (status: TransactionStatus) => {
    setStatusFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(status)) {
        newFilters.delete(status);
      } else {
        newFilters.add(status);
      }
      return newFilters;
    });
  };

  const handleSort = (key: keyof FraudTransaction) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Search all history function
  const searchAllHistory = async () => {
    if (!debouncedSearchTerm) return;

    setIsSearchingHistory(true);
    try {
      const statusParam = Array.from(statusFilters).join(",");
      const response = await fetch(
        `/api/transactions/search?q=${encodeURIComponent(
          debouncedSearchTerm
        )}&status=${statusParam}`
      );
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setHistoricalResults(data.transactions);
      setShowHistoryDialog(true);
    } catch (error) {
      console.error("Historical search error:", error);
    } finally {
      setIsSearchingHistory(false);
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions.filter((txn) => statusFilters.has(txn.status));

    // Apply client-side search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (txn) =>
          txn.name.toLowerCase().includes(searchLower) ||
          txn.invoiceId.toLowerCase().includes(searchLower) ||
          txn.type.toLowerCase().includes(searchLower) ||
          txn.amountFormatted.includes(searchLower) ||
          txn.location?.toLowerCase().includes(searchLower) ||
          txn.cardLast4?.includes(searchLower)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [transactions, statusFilters, sortConfig, debouncedSearchTerm]);

  const tableHeaders = [
    { label: "Name/Business", key: "name" as const, icon: ArrowUpDown },
    { label: "Date", key: "timestamp" as const, icon: ChevronDown },
    { label: "Invoice ID", key: "invoiceId" as const, icon: ChevronDown },
    { label: "Amount", key: "amount" as const, icon: ChevronDown },
    { label: "Status", key: "status" as const, icon: null },
    { label: "Risk Score", key: "riskScore" as const, icon: ChevronDown },
    { label: "Actions", key: null, icon: null },
  ];

  return (
    <div className="rounded-lg">
      <div className="mb-4 flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-omni-pitch-black">
          Recent Transactions ({filteredAndSortedTransactions.length})
        </h2>
        <div className="flex items-center gap-2 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search transactions (name, invoice, amount, location...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-omni-background-grey border-omni-background-grey rounded-lg"
            />
          </div>
          <Button
            variant="outline"
            className="bg-omni-background-grey border-omni-background-grey rounded-lg font-semibold whitespace-nowrap"
            onClick={searchAllHistory}
            disabled={!debouncedSearchTerm || isSearchingHistory}
          >
            <History className="size-4 mr-2" />
            {isSearchingHistory ? "Searching..." : "Search All History"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-omni-background-grey border-omni-background-grey rounded-lg font-semibold"
              >
                <Filter className="size-4 mr-2" />
                Filter Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilters.has("Approved")}
                onCheckedChange={() => toggleStatusFilter("Approved")}
              >
                Approved
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilters.has("Fraud")}
                onCheckedChange={() => toggleStatusFilter("Fraud")}
              >
                Fraud
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilters.has("Pending")}
                onCheckedChange={() => toggleStatusFilter("Pending")}
              >
                Pending
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[600px]">
        <table className="min-w-full">
          <thead className="border-b sticky top-0 bg-white z-10">
            <tr>
              {tableHeaders.map((header, index) => (
                <TableHeader key={index}>
                  <TableHeaderMaker
                    label={header.label}
                    icon={header.icon || undefined}
                    onClick={
                      header.key ? () => handleSort(header.key!) : undefined
                    }
                  />
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-omni-background-grey">
            {filteredAndSortedTransactions.map((transaction) => {
              const isNew = newTransactionIds.has(transaction.id);
              return (
                <tr
                  key={transaction.id}
                  className={`hover:bg-omni-background-grey transition-all  ${
                    isNew ? "animate-pop-in bg-blue-50" : ""
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center">
                      <div className="size-12 flex-shrink-0 rounded-xl bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {transaction.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4 cursor-default">
                        <div className="font-bold text-omni-pitch-black text-base">
                          {transaction.name}
                        </div>
                        <div className="text-omni-text-grey text-sm">
                          {transaction.type}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.date}</div>
                    <div className="text-gray-500 text-sm cursor-default">
                      {transaction.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-omni-pitch-black cursor-default">
                      {transaction.invoiceId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-omni-pitch-black cursor-default">
                      {transaction.amountFormatted}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-lg cursor-default ${
                        transaction.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : transaction.status === "Pending"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`font-bold ${
                          transaction.riskScore >= 70
                            ? "text-red-600"
                            : transaction.riskScore >= 30
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {transaction.riskScore}
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            transaction.riskScore >= 70
                              ? "bg-red-600"
                              : transaction.riskScore >= 30
                              ? "bg-yellow-500"
                              : "bg-green-600"
                          }`}
                          style={{ width: `${transaction.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button className="border-2 hover:text-white hover:bg-omni-blue hover:border-omni-blue transition-colors ease-in-out text-sm px-4">
                      Details
                    </Button>
                  </TableCell>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredAndSortedTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions match the selected filters
          </div>
        )}
      </div>

      {/* Historical Search Results Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Historical Search Results
            </DialogTitle>
            <DialogDescription>
              Found {historicalResults.length} results for &quot;
              {debouncedSearchTerm}&quot; in transaction history
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="min-w-full">
              <thead className="border-b sticky top-0 bg-white z-10">
                <tr>
                  {tableHeaders.map((header, index) => (
                    <TableHeader key={index}>
                      <TableHeaderMaker
                        label={header.label}
                        icon={header.icon || undefined}
                      />
                    </TableHeader>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-omni-background-grey">
                {historicalResults.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-omni-background-grey transition-all"
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <div className="size-12 flex-shrink-0 rounded-xl bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">
                            {transaction.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4 cursor-default">
                          <div className="font-bold text-omni-pitch-black text-base">
                            {transaction.name}
                          </div>
                          <div className="text-omni-text-grey text-sm">
                            {transaction.type}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.date}</div>
                      <div className="text-gray-500 text-sm cursor-default">
                        {transaction.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-omni-pitch-black cursor-default">
                        {transaction.invoiceId}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-omni-pitch-black cursor-default">
                        {transaction.amountFormatted}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-lg cursor-default ${
                          transaction.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : transaction.status === "Pending"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`font-bold ${
                            transaction.riskScore >= 70
                              ? "text-red-600"
                              : transaction.riskScore >= 30
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {transaction.riskScore}
                        </div>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              transaction.riskScore >= 70
                                ? "bg-red-600"
                                : transaction.riskScore >= 30
                                ? "bg-yellow-500"
                                : "bg-green-600"
                            }`}
                            style={{ width: `${transaction.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button className="border-2 hover:text-white hover:bg-omni-blue hover:border-omni-blue transition-colors ease-in-out text-sm px-4">
                        Details
                      </Button>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
            {historicalResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No historical transactions found
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
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
