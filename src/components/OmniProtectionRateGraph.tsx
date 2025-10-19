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
  { browser: "chrome", visitors: 92, fill: "#FFD60A" },
  { browser: "safari", visitors: 95, fill: "#FFD60A" },
  { browser: "firefox", visitors: 94, fill: "#FFD60A" },
  { browser: "edge", visitors: 89, fill: "#FFD60A" },
  { browser: "other", visitors: 97, fill: "#FFD60A" },
];

const chartConfig = {
  visitors: {
    label: "Protection Rate",
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

const OmniProtectionRateGraph = () => {
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
                fill="#FFD60A"
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

export default OmniProtectionRateGraph;
