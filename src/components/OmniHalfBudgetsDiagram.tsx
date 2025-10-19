"use client";

import { ChevronDown, ChevronRight, Dot, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import * as Progress from "@radix-ui/react-progress";
import { FC, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";
interface PieItemProps {
  amount: number;
  label: string;
  color: string;
}

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];
const chartConfig = {
  visitors: {
    label: "Visitors",
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

const PieItem: FC<PieItemProps> = ({
  amount = 0.0,
  label = "Label",
  color = "text-omni-pitch-black",
}) => {
  return (
    <div className="flex justify-start items-center  h-fit w-full">
      <Dot className={cn("p-0 m-0", color)} size={30} />
      <div className="flex flex-col justify-start gap-1">
        <span className="text-sm font-extrabold font-manrope">${amount}</span>
        <span className="text-[0.625rem] text-omni-text-grey">{label}</span>
      </div>
    </div>
  );
};


const OmniHalfBudgetsDiagram = () => {
  return (
    <Card className="my-4 w-full h-[18rem] rounded-3xl border-2 border-omni-background-grey transition-all p-6">
      <CardHeader className="flex flex-row items-center justify-between h-fit w-full p-0 mb-3">
        <h2 className="font-bold text-lg">Budget</h2>
        <Link href={"/savings"}>
          <Button
            variant="outline"
            className="rounded-lg text-xs h-8 bg-omni-background-grey font-semibold border-2 border-omni-background-grey"
          >
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="bg-omni-background-grey rounded-xl h-[80%] overflow-y-auto gap-2 px-2 p-2 m-0 flex">
        <div className="size-full ">
          <PieChartComponent />
        </div>
        <div className="h-full grid  w-[70%] ">
          <div className="flex flex-col justify-center items-start gap-2 p-2 overflow-y-auto">
            <PieItem
              amount={754.99}
              label={"Shopping"}
              color={"text-omni-black"}
            />
            <PieItem
              amount={2350.0}
              label={"Rent"}
              color={"text-omni-green"}
            />
            <PieItem
              amount={710.0}
              label={"Savings"}
              color={"text-omni-yellow"}
            />
            <PieItem
              amount={1000}
              label={"Rent"}
              color={"text-omni-pitech-black/60"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OmniHalfBudgetsDiagram;

const PieChartComponent = () => {
  // const totalVisitors = useMemo(() => {
  //   return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  // }, []);
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-full"
    >
      <PieChart>
        {/* <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel className="bg-white" />}
        /> */}
        <Pie
          data={chartData}
          dataKey="visitors"
          nameKey="browser"
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
                      className="fill-foreground text-2xl font-bold"
                    >
                      {/* {totalVisitors.toLocaleString()}
                       */}
                      OK
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Status
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
