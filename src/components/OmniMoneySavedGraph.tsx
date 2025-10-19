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
  { browser: "chrome", visitors: 120, fill: "#06D6A0" },
  { browser: "safari", visitors: 240, fill: "#06D6A0" },
  { browser: "firefox", visitors: 190, fill: "#06D6A0" },
  { browser: "edge", visitors: 145, fill: "#06D6A0" },
  { browser: "other", visitors: 80, fill: "#06D6A0" },
];

const chartConfig = {
  visitors: {
    label: "Money Saved",
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

const OmniMoneySavedGraph = () => {
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
                fill="#06D6A0"
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

export default OmniMoneySavedGraph;
