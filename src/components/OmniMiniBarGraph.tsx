"use client";

import { FC } from "react";
import { Bar, BarChart, Rectangle } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SeriesPoint, formatMoney } from "@/lib/dashboard";

interface OmniMiniBarGraphProps {
  data: SeriesPoint[];
  currency?: string;
}

const chartConfig = {
  value: { label: "Amount" },
} satisfies ChartConfig;

/**
 * Compact bar chart for the top stat cards. Grey bars with the most recent
 * period highlighted in brand blue.
 */
const OmniMiniBarGraph: FC<OmniMiniBarGraphProps> = ({ data, currency }) => {
  if (data.length === 0) {
    return (
      <div className="size-full flex items-center justify-center">
        <span className="text-xs text-omni-text-grey">No activity yet</span>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              className="bg-omni-background-grey p-2 tabular-nums"
              formatter={(value) => formatMoney(Number(value), currency)}
            />
          }
        />
        <Bar
          dataKey="value"
          fill="#718096"
          strokeWidth={2}
          radius={6}
          activeIndex={data.length - 1}
          activeBar={(props: object) => (
            <Rectangle {...props} fill="#118AB2" strokeDasharray={0} />
          )}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default OmniMiniBarGraph;
