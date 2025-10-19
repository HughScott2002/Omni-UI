"use client";

import {
  ArrowRightLeft,
  AudioWaveform,
  CircleHelp,
  Command,
  Contact,
  GalleryVerticalEnd,
  PiggyBank,
  House,
  LogOut,
  LucideIcon,
  Settings,
  Wallet,
  BadgePoundSterling,
  BotMessageSquare,
  Ghost,
  ShieldX,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { useAuth } from "./AuthContext";

// This is sample data.
//TODO: FIX THE WALLET ITEMS

export const sideBarData = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    // {
    //   title: "Dashboard",
    //   url: "/",
    //   icon: House,
    // },
    {
      title: "My Wallets", // For the sake of time wallet will have transactions
      url: "/my-wallets",
      icon: Wallet,
      // items: [
      //   {
      //     title: "Primary",
      //     amount: "$6084.50",
      //     url: "/my-wallets/eedAefe",
      //   },
      //   {
      //     title: "Savings",
      //     amount: "$6084.50",

      //     url: "/my-wallets/dwdBfe",
      //   },
      //   {
      //     title: "Savings",
      //     amount: "$6084.50",
      //     url: "/my-wallets/efefC",
      //   },
      // ],
    },
    // {
    //   title: "Transactions",
    //   url: "/transactions",
    //   icon: ArrowRightLeft,
    // },
    {
      title: "Contacts",
      url: "/contacts",
      icon: Contact,
    },
    {
      title: "Fraud Detection",
      url: "/fraud-detection",
      icon: ShieldX,
    },
    // {
    //   title: "FX Exchange",
    //   url: "/fx",
    //   icon: BadgePoundSterling,
    // },
    // {
    //   title: "Savings",
    //   url: "/savings",
    //   icon: PiggyBank,
    // },
    // {
    //   title: "AI",
    //   url: "/ai",
    //   icon: BotMessageSquare,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="bg-omni-background-grey" {...props}>
      <div className="px-4 py-2  w-full h-full flex flex-col">
        <Link href={"/"}>
          <SidebarHeader className="">
            <TeamSwitcher teams={sideBarData.teams} />
          </SidebarHeader>
        </Link>
        <hr />
        <hr />
        <hr className="text-omni-pitch-black" />
        <SidebarContent className="">
          <NavMain items={sideBarData.navMain} />
          {/* <NavProjects projects={sideBarData.projects} /> */}
        </SidebarContent>
        <OmniSidebarFooter />
        <SidebarRail />
      </div>
    </Sidebar>
  );
}

function OmniSidebarFooter(): ReactNode {
  const { logout } = useAuth();
  function handleLogout() {
    logout();
  }
  return (
    <footer className="flex flex-col items-center gap-1 ">
      <OmniFooterItem label="Toggle Sidebar" Icon={SidebarTrigger} />
      <Link href="/help" className="w-full h-full">
        <OmniFooterItem label="Help" Icon={CircleHelp} />
      </Link>
      <Link href="/settings" className="w-full h-full">
        <OmniFooterItem label="Settings" Icon={Settings} />
      </Link>
      <Button
        onClick={handleLogout}
        className="p-0 m-0 w-full"
        variant={"ghost"}
      >
        <OmniFooterItem
          label="Logout"
          className="text-omni-red"
          Icon={LogOut}
        />
      </Button>
    </footer>
  );
}

function OmniFooterItem({
  label,
  className,
  href,
  Icon,
}: {
  label: string;
  className?: string;
  href?: string;
  Icon: LucideIcon | FC;
}): ReactNode {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const button = (
    <SidebarMenuButton
      className={`flex items-center justify-start px-4 py-6 ${
        isCollapsed ? "w-full " : "w-full"
      } ${className}`}
    >
      {<Icon className="size-5"></Icon>}
      {!isCollapsed && (
        <span className="ml-2 font-manrope font-semibold text-base">
          {label}
        </span>
      )}
    </SidebarMenuButton>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{button}</div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          className={cn(
            "bg-omni-background-grey p-4 text-sm font-bold ",
            label.toLowerCase() === "logout"
              ? "text-omni-red"
              : "text-omni-text-grey"
          )}
        >
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

function OmniChartSVG({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={`lucide lucide-chart-candlestick ${className}`}
    >
      <path d="M9 5v4" />
      <rect width="4" height="6" x="7" y="9" rx="1" />
      <path d="M9 15v2" />
      <path d="M17 3v2" />
      <rect width="4" height="8" x="15" y="5" rx="1" />
      <path d="M17 13v3" />
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    </svg>
  );
}
