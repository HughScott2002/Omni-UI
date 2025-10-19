"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TransactionRateDataPoint } from "@/types/fraud-detection";

interface OmniRateOfTransactionsDiagramProps {
  data: TransactionRateDataPoint[];
  currentRate: number;
  trend: "up" | "down" | "stable";
  change: number;
}

const OmniRateOfTransactionsDiagram = ({
  data,
  currentRate,
  trend,
  change,
}: OmniRateOfTransactionsDiagramProps) => {
  const getTrendIcon = () => {
    if (trend === "up") {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    } else if (trend === "down") {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-500";
    if (trend === "down") return "text-red-500";
    return "text-gray-500";
  };

  return (
    <Card className="w-full rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <h2 className="font-bold text-lg">Transaction Rate</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold">{currentRate}</span>
            <span className="text-sm text-gray-500">transactions/min</span>
            {getTrendIcon()}
            <span className={`text-sm font-semibold ${getTrendColor()}`}>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-4 rounded-full bg-omni-blue" />
          <span className="text-sm font-semibold">Live Rate</span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            rate: {
              label: "Transaction Rate",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[300px] w-full transition-all"
        >
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid vertical={false} stroke="#EDF2F7" />
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#000000",
              }}
              dy={20}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: "0.92431rem", fontWeight: 600 }}
              dx={-40}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent className="bg-omni-background-grey" />
              }
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#118AB2"
              fill="#118AB2"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default OmniRateOfTransactionsDiagram;
