"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "chrome", visitors: 45, fill: "#EF476F" },
  { browser: "safari", visitors: 67, fill: "#EF476F" },
  { browser: "firefox", visitors: 52, fill: "#EF476F" },
  { browser: "edge", visitors: 38, fill: "#EF476F" },
  { browser: "other", visitors: 71, fill: "#EF476F" },
];

const chartConfig = {
  visitors: {
    label: "Fraud Blocked",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const OmniFraudBlockedGraph = () => {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              className="bg-omni-background-grey p-2"
            />
          }
        />
        <Bar
          dataKey="visitors"
          strokeWidth={2}
          radius={6}
          activeIndex={2}
          activeBar={({ ...props }) => {
            return (
              <Rectangle
                {...props}
                fill="#EF476F"
                strokeDasharray={0}
                strokeDashoffset={4}
              />
            );
          }}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default OmniFraudBlockedGraph;
