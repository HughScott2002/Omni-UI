import OmniAccountAlerts from "@/components/OmniAccountAlerts";
import OmniDashboardWalletSection from "@/components/DashboardWalletSection";
import OmniBalanceGraph from "@/components/OmniBalanceGraph";
import OmniDashboardRecentActivity from "@/components/OmniDashboardRecentActivity";
import OmniExpensesGraph from "@/components/OmniExpensesGraph";
import OmniHalfBudgetsDiagram from "@/components/OmniHalfBudgetsDiagram";
import OmniHalfSavingsDiagram from "@/components/OmniHalfSavingsDiagram";
import OmniIncomeGraph from "@/components/OmniIncomeGraph";
import OmniMoneyFlowDiagram from "@/components/OmniMoneyFlowDiagram";
import OmniScoreGraph from "@/components/OmniScoreGraph";
import OmniTopDashComponent from "@/components/OmniTopDashComponent";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { FC } from "react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

/**
 * Array of dashboard items matching TopDashComponentsProps interface
 */
const dashboardItems = [
  {
    chartContainer: <OmniBalanceGraph />,
    label: "Balance",
    title: "$24,098.00",
  },
  {
    chartContainer: <OmniIncomeGraph />,
    label: "Income",
    title: "$2,456.84",
  },
  {
    chartContainer: <OmniExpensesGraph />,
    label: "Expenses",
    title: "$1,980.00",
  },
  {
    chartContainer: <OmniScoreGraph />,
    label: "Credit Score",
    title: "800",
  },
];

const Dashboard: FC = () => {
  return (
    <section className="w-full h-full ">
      <div className="flex size-full md:gap-2 lg:gap-4 xl:gap-6 transition-all">
        <div className="size-full flex items-start ">
          <div className="flex flex-1 flex-col gap-4 sm:p-4 rounded-3xl transition-all ease-in-out">
            <div className="w-full xl:max-w-[56rem] mx-auto flex flex-col p-2 gap-2">
              <OmniAccountAlerts />
              {/* Container to limit width and center */}
              <div className="grid grid-cols-[repeat(auto-fit,13rem)] gap-4 3xl:justify-center justify-start ">
                {dashboardItems.map((item, index) => (
                  <OmniTopDashComponent
                    ChartContainer={item.chartContainer}
                    key={index}
                    label={item.label}
                    title={item.title}
                  />
                ))}
              </div>

              <OmniMoneyFlowDiagram />

              <div className="grid grid-cols-[repeat(auto-fit,26rem)] justify-between ">
                <OmniHalfSavingsDiagram />
                <OmniHalfBudgetsDiagram />
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-fit transition-all  h-full max-lg:hidden flex flex-col gap-6">
          <OmniDashboardWalletSection />
          <OmniDashboardRecentActivity />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
