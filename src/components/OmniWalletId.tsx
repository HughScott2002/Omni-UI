import React from "react";
import { Skeleton } from "./ui/skeleton";
import { ArrowLeftRight, ChevronRight, Copy, Info, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { OmniTransactionsTable } from "@/components/test-transactions-table";
import OmniLogo from "./OmniLogo";

interface OmniWalletIdProps {
  wallet: OmniWalletData | null;
  formatCurrency: (amount: number, includeSign?: boolean) => string;
}
const OmniWalletId = ({ wallet, formatCurrency }: OmniWalletIdProps) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className=" flex justify-between w-full px-2 gap-2 text-2xl font-semibold">
          <span className="text-omni-blue font-bold">{wallet?.type}</span>
          <OmniLogo size={8} />
        </h1>
      </div>
      <div className="md:flex size-full gap-6 justify-between">
        {/* Left Column */}
        <div className="space-y-6 border rounded-lg md:w-[70%] ">
          <div className="pt-6 px-6 space-y-6">
            <div className="flex justify-between">
              <div>
                <div className="flex gap-2 items-center text-muted-foreground">
                  <span>Available Balance</span>
                  <Info className="h-4 w-4" />
                </div>
                <h2 className="text-3xl font-semibold">
                  {formatCurrency(wallet?.balance ?? 0.0, false)}
                </h2>
              </div>
              <div className="flex gap-4">
                {/* <Button variant="outline">+ Deposit</Button>
                <Button variant="outline">Transfer</Button> */}
                <Button className="bg-omni-blue rounded-full text-white font-semibold flex justify-between gap-1 hover:bg-omni-blue/60">
                  <Plus className="size-4" />
                  Deposit
                </Button>
                <Button className="bg-omni-green rounded-full text-white font-semibold flex justify-between gap-1 hover:bg-omni-green/60">
                  <ArrowLeftRight className="size-4" /> <span>Transfer</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div>
                      <div className="text-xs text-omni-pitch-black font-bold">
                        Type
                      </div>
                      <div className="text-base">{wallet?.type}</div>
                    </div>
                    {/* <Skeleton className="h-4 w-24 mb-2 bg-omni-text-grey animate-pulse" />
                    <Skeleton className="h-6 w-32 bg-omni-text-grey animate-pulse" /> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Bottom Left Holder */}
          <div className="flex border-t justify-between px-6 pt-6">
            <div className="flex items-center gap-2 text-green-600">
              <div className="h-2 w-2 bg-green-600 rounded-full" />
              Restore to {formatCurrency(2000000)}
            </div>
            <div className="text-muted-foreground">Next transfer: Jan 15</div>
          </div>
        </div>
        {/* Right Column */}
        <div className="rounded-lg border p-6 space-y-6 md:w-[30%]">
          <div className="space-y-4 ">
            {[1].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="text-sm font-bold">Routing number</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">132456789</span>
                  <Copy className="h-4 w-4 cursor-pointer text-omni-blue" />
                </div>
                {/* <Skeleton className="h-4 w-24 bg-omni-text-grey animate-pulse" /> */}
                {/* <Skeleton className="h-4 w-32 bg-omni-text-grey animate-pulse" /> */}
              </div>
            ))}
            <div className="flex justify-between items-center">
              <div className="text-sm font-bold">Account number</div>
              <div className="flex items-center gap-2">
                <span className="text-sm">• • • • • 1038</span>
                <Copy className="h-4 w-4 cursor-pointer text-omni-blue" />
              </div>
            </div>
            <div className="space-y-1 text-xs flex w-full justify-between">
              <div className="text-sm font-bold">Bank</div>
              <div className="h-full text-sm">
                <div>Choice Financial Group</div>
                <div>4501 23rd Avenue S</div>
                <div>Fargo, ND 58104</div>
              </div>
            </div>
            {/* <div className="space-y-2">
              <Skeleton className="h-4 w-16 bg-omni-text-grey animate-pulse" />
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-4 w-48 bg-omni-text-grey animate-pulse"
                />
              ))}
            </div> */}
            <div className="flex items-center justify-between">
              <Button
                variant="link"
                className="text-primary p-0  text-omni-blue"
              >
                View Statements
              </Button>
              {/* <Button variant="link" className="text-primary p-0">
                More
              </Button> */}
              <Button className="bg-omni-background-grey rounded-full text-omni-blue font-semibold">
                More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg ">Recent transactions</h3>
          <Button className="bg-omni-background-grey rounded-full text-omni-blue font-semibold">
            View all <ChevronRight className="size-4" />
          </Button>
        </div>
        <OmniTransactionsTable />

        {/* <Skeleton className="h-[200px] w-full bg-omni-text-grey animate-pulse" /> */}
      </div>
    </div>
  );
};

export default OmniWalletId;
