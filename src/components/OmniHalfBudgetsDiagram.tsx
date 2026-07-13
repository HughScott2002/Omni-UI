"use client";

import { ChevronRight, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label, Pie, PieChart } from "recharts";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import Link from "next/link";
import { BudgetSlice, formatMoney } from "@/lib/dashboard";
import { OmniEmpty, OmniOffline, OmniPanelSkeleton } from "./OmniCardState";
import { DashboardStatus } from "@/hooks/useDashboardData";

interface OmniHalfBudgetsDiagramProps {
  slices: BudgetSlice[];
  totalExpenses: number;
  currency?: string;
  state?: DashboardStatus;
  onRetry?: () => void;
}

// Brand palette for pie slices + matching legend dot classes.
const SLICE_COLORS = ["#073B4C", "#06D6A0", "#FFD166", "#118AB2", "#EF476F"];
const DOT_CLASSES = [
  "text-omni-dark-blue",
  "text-omni-green",
  "text-omni-yellow",
  "text-omni-blue",
  "text-omni-red",
];

const chartConfig = {
  amount: { label: "Spent" },
} satisfies ChartConfig;

const PieItem: FC<{ amount: string; label: string; dotClass: string }> = ({
  amount,
  label,
  dotClass,
}) => (
  <div className="flex justify-start items-center h-fit w-full">
    <Dot className={cn("p-0 m-0 shrink-0", dotClass)} size={30} />
    <div className="flex flex-col justify-start gap-1">
      <span className="text-sm font-extrabold font-manrope tabular-nums">
        {amount}
      </span>
      <span className="text-[0.625rem] text-omni-text-grey">{label}</span>
    </div>
  </div>
);

const OmniHalfBudgetsDiagram: FC<OmniHalfBudgetsDiagramProps> = ({
  slices,
  totalExpenses,
  currency = "USD",
  state = "ready",
  onRetry,
}) => {
  const chartData = slices.map((slice, i) => ({
    category: slice.label,
    amount: slice.amount,
    fill: SLICE_COLORS[i % SLICE_COLORS.length],
  }));

  return (
    <Card className="my-4 w-full h-[18rem] rounded-3xl border-2 border-omni-background-grey transition-all p-6">
      <CardHeader className="flex flex-row items-center justify-between h-fit w-full p-0 mb-3">
        <h2 className="font-bold text-lg">Budget</h2>
        <Link href={"/transactions"}>
          <Button
            variant="outline"
            className="rounded-lg text-xs h-8 bg-omni-background-grey font-semibold border-2 border-omni-background-grey transition-[background-color,scale] active:scale-[0.96]"
          >
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent
        className={cn(
          "rounded-xl h-[80%] overflow-y-auto gap-2 px-2 p-2 m-0 flex",
          state === "ready" && slices.length > 0 && "bg-omni-background-grey"
        )}
      >
        {state === "loading" ? (
          <OmniPanelSkeleton rows={3} />
        ) : state === "error" ? (
          <OmniOffline onRetry={onRetry} />
        ) : slices.length === 0 ? (
          <OmniEmpty
            title="Nothing spent this month"
            hint="Your spending breakdown will appear here"
          />
        ) : (
          <>
            <div className="size-full">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-full"
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={50}
                    strokeWidth={8}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-lg font-bold tabular-nums"
                              >
                                {formatMoney(totalExpenses, currency).replace(
                                  /\.\d+$/,
                                  ""
                                )}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-xs"
                              >
                                Spent this month
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
            <div className="h-full grid w-[70%]">
              <div className="flex flex-col justify-center items-start gap-2 p-2 overflow-y-auto">
                {slices.map((slice, i) => (
                  <PieItem
                    key={slice.label}
                    amount={formatMoney(slice.amount, currency)}
                    label={slice.label}
                    dotClass={DOT_CLASSES[i % DOT_CLASSES.length]}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OmniHalfBudgetsDiagram;
