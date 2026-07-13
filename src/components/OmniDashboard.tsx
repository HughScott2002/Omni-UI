"use client";

import { FC, useMemo } from "react";
import OmniAccountAlerts from "@/components/OmniAccountAlerts";
import OmniDashboardWalletSection from "@/components/DashboardWalletSection";
import OmniDashboardRecentActivity from "@/components/OmniDashboardRecentActivity";
import OmniHalfBudgetsDiagram from "@/components/OmniHalfBudgetsDiagram";
import OmniHalfSavingsDiagram from "@/components/OmniHalfSavingsDiagram";
import OmniMoneyFlowDiagram from "@/components/OmniMoneyFlowDiagram";
import OmniTopDashComponent from "@/components/OmniTopDashComponent";
import OmniMiniBarGraph from "@/components/OmniMiniBarGraph";
import { useAuth } from "@/components/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  balanceSeries,
  budgetBreakdown,
  formatMoney,
  monthlyTotals,
  recentActivity,
  weeklySeries,
} from "@/lib/dashboard";
import { OmniEmpty } from "@/components/OmniCardState";
import { Gauge } from "lucide-react";

/**
 * The dashboard's data comes from the Omni gateway (wallets + transaction
 * history); every figure on screen is derived from those responses. When the
 * backend can't be reached each section falls back to a branded offline
 * state — nothing here is hardcoded.
 */
const OmniDashboard: FC = () => {
  const { user } = useAuth();
  const {
    defaultWallet,
    savingsWallets,
    transactions,
    status,
    refetch,
  } = useDashboardData(user?.id);

  const accountId = user?.id ?? "";
  const currency = defaultWallet?.currency ?? "USD";

  const derived = useMemo(() => {
    const { income, expenses } = monthlyTotals(transactions, accountId);
    return {
      income,
      expenses,
      incomeSeries: weeklySeries(transactions, accountId, "income"),
      expensesSeries: weeklySeries(transactions, accountId, "expenses"),
      balancePoints: defaultWallet
        ? balanceSeries(transactions, defaultWallet.walletId)
        : [],
      budget: budgetBreakdown(transactions),
      recent: recentActivity(transactions),
    };
  }, [transactions, accountId, defaultWallet]);

  return (
    <section className="w-full h-full">
      <div className="flex size-full md:gap-2 lg:gap-4 xl:gap-6 transition-all">
        <div className="size-full flex items-start">
          <div className="flex flex-1 flex-col gap-4 sm:p-4 rounded-3xl transition-all ease-in-out">
            <div className="w-full xl:max-w-[56rem] mx-auto flex flex-col p-2 gap-2">
              <OmniAccountAlerts />

              <div className="grid grid-cols-[repeat(auto-fit,13rem)] gap-4 3xl:justify-center justify-start">
                <OmniTopDashComponent
                  label="Balance"
                  title={
                    defaultWallet
                      ? formatMoney(defaultWallet.balance, currency)
                      : "—"
                  }
                  state={status}
                  onRetry={refetch}
                  ChartContainer={
                    <OmniMiniBarGraph
                      data={derived.balancePoints}
                      currency={currency}
                    />
                  }
                />
                <OmniTopDashComponent
                  label="Income"
                  title={formatMoney(derived.income, currency)}
                  state={status}
                  onRetry={refetch}
                  ChartContainer={
                    <OmniMiniBarGraph
                      data={derived.incomeSeries}
                      currency={currency}
                    />
                  }
                />
                <OmniTopDashComponent
                  label="Expenses"
                  title={formatMoney(derived.expenses, currency)}
                  state={status}
                  onRetry={refetch}
                  ChartContainer={
                    <OmniMiniBarGraph
                      data={derived.expensesSeries}
                      currency={currency}
                    />
                  }
                />
                {/* Credit score has no backend yet — honest branded state
                    instead of a made-up number. */}
                <OmniTopDashComponent
                  label="Credit Score"
                  title=""
                  state="ready"
                  ChartContainer={
                    <OmniEmpty
                      title="Coming soon"
                      hint="Credit insights are on the way"
                      icon={<Gauge className="size-5" />}
                    />
                  }
                />
              </div>

              <OmniMoneyFlowDiagram
                transactions={transactions}
                state={status}
                onRetry={refetch}
              />

              <div className="grid grid-cols-[repeat(auto-fit,26rem)] justify-between">
                <OmniHalfSavingsDiagram
                  savingsWallets={savingsWallets}
                  transactions={transactions}
                  state={status}
                  onRetry={refetch}
                />
                <OmniHalfBudgetsDiagram
                  slices={derived.budget}
                  totalExpenses={derived.expenses}
                  currency={currency}
                  state={status}
                  onRetry={refetch}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-fit transition-all h-full max-lg:hidden flex flex-col gap-6">
          <OmniDashboardWalletSection />
          <OmniDashboardRecentActivity
            transactions={derived.recent}
            accountId={accountId}
            state={status}
            onRetry={refetch}
          />
        </div>
      </div>
    </section>
  );
};

export default OmniDashboard;
