"use client";

import { FC, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Transaction } from "@/lib/transactions";
import {
  MoneyFlowRange,
  formatMoney,
  moneyFlowRangeLabel,
  moneyFlowSeries,
} from "@/lib/dashboard";
import {
  OmniEmpty,
  OmniOffline,
  OmniPanelSkeleton,
} from "./OmniCardState";
import { DashboardStatus } from "@/hooks/useDashboardData";

const RANGES: MoneyFlowRange[] = ["1D", "5D", "1M", "3M", "6M", "1Y"];

interface OmniMoneyFlowDiagramProps {
  transactions: Transaction[];
  state?: DashboardStatus;
  onRetry?: () => void;
}

const OmniMoneyFlowDiagram: FC<OmniMoneyFlowDiagramProps> = ({
  transactions,
  state = "ready",
  onRetry,
}) => {
  const [range, setRange] = useState<MoneyFlowRange>("1M");

  const data = useMemo(
    () => moneyFlowSeries(transactions, range),
    [transactions, range]
  );
  const hasActivity = data.some((point) => point.value > 0);

  return (
    <Card className="w-full rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <h2 className="font-bold text-lg">Money Flow</h2>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="h-2 w-4 rounded-full bg-omni-pitch-black" />
            <span className="text-sm font-semibold">Expenses</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-lg text-xs h-8 bg-omni-background-grey font-semibold border-2 border-omni-background-grey tabular-nums"
              >
                {range} · {moneyFlowRangeLabel(range)}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-omni-background-grey" align="end">
              {RANGES.map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => setRange(r)}
                  className={
                    r === range ? "font-bold text-omni-blue" : "font-medium"
                  }
                >
                  {r === "1D"
                    ? "Today"
                    : r === "5D"
                    ? "Last 5 days"
                    : r === "1M"
                    ? "Last month"
                    : r === "3M"
                    ? "Last 3 months"
                    : r === "6M"
                    ? "Last 6 months"
                    : "Last year"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {state === "loading" ? (
          <div className="h-[300px]">
            <OmniPanelSkeleton rows={4} />
          </div>
        ) : state === "error" ? (
          <div className="h-[300px]">
            <OmniOffline onRetry={onRetry} />
          </div>
        ) : !hasActivity ? (
          <div className="h-[300px]">
            <OmniEmpty
              title="No spending in this period"
              hint="Transactions you make will show up here"
            />
          </div>
        ) : (
          <ChartContainer
            config={{
              value: { label: "Expenses", color: "hsl(var(--primary))" },
            }}
            className="h-[300px] w-full transition-all"
          >
            <LineChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid vertical={false} stroke="#EDF2F7" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: "0.92431rem", fontWeight: 600 }}
                dy={20}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: "0.92431rem", fontWeight: 600 }}
                width={80}
                tickFormatter={(value) =>
                  formatMoney(Number(value)).replace(/\.00$/, "")
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="bg-omni-background-grey tabular-nums"
                    formatter={(value) => formatMoney(Number(value))}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#000000"
                fill="#000000"
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default OmniMoneyFlowDiagram;
