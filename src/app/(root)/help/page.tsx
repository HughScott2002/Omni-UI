"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  LucideIcon,
  User,
  WalletIcon,
} from "lucide-react";
import { useState } from "react";

type HelpIconProps = {
  icon: LucideIcon;
  label: string;
  sublabel: string;
  active?: boolean;
  onClick?: () => void;
};

type ContentItem = {
  label: string;
  sublabel: string;
};

// Define content for each section
const contentData = {
  "Sending Money": [
    {
      label: "How do I send money?",
      sublabel: "Learn the simple steps to send money to anyone, anywhere.",
    },
    {
      label: "What are the transfer fees?",
      sublabel:
        "Understand our transparent fee structure for different types of transfers.",
    },
    {
      label: "How long do transfers take?",
      sublabel: "Get information about transfer times and processing periods.",
    },
  ],
  "Managing Your Account": [
    {
      label: "How do I verify my account?",
      sublabel:
        "Follow our step-by-step guide to complete account verification.",
    },
    {
      label: "How do I change my password?",
      sublabel: "Learn how to update your security credentials safely.",
    },
    {
      label: "What documents do I need?",
      sublabel: "See the list of required documents for account verification.",
    },
  ],
  "Holding Money": [
    {
      label: "Why can't I open balance?",
      sublabel:
        "We'd like to offer balances to everyone. But there are a few countries and US states where you can't open any balances just yet.",
    },
    {
      label: "How do I set up Direct Debits?",
      sublabel:
        "When you set up a Direct Debit, you give a company permission to take regular payments from your account.",
    },
    {
      label: "How do I open a balance?",
      sublabel:
        "Add money to your balances whenever you like. Just choose which currency you'd like to add to.",
    },
  ],
  "Overpay Business": [
    {
      label: "How do I set up a business account?",
      sublabel:
        "Learn about the requirements and process for business account setup.",
    },
    {
      label: "What are the API features?",
      sublabel: "Explore our API capabilities for business integration.",
    },
    {
      label: "How do I add team members?",
      sublabel: "Manage your business team access and permissions.",
    },
  ],
};

const HelpOptionsData: (HelpIconProps & { id: string })[] = [
  {
    id: "sending-money",
    icon: WalletIcon,
    label: "Sending Money",
    sublabel: "Setting up, paying for, editing, and canceling transfers",
  },
  {
    id: "managing-account",
    icon: User,
    label: "Managing Your Account",
    sublabel: "Setting up your account and getting verified",
  },
  {
    id: "holding-money",
    icon: CircleDollarSign,
    label: "Holding Money",
    sublabel: "Holding balances, setting up cards debits, and using assets",
  },
  {
    id: "business",
    icon: BriefcaseBusiness,
    label: "Overpay Business",
    sublabel: "Multi-users access, accounting, and using our API",
  },
];
const BadgeGrid = () => {
  const badges = [
    "Send Money",
    "Transfers",
    "Dev",
    // "Account Setup",
    // "Security",
    // "Payments",
    // "Support",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((text, index) => (
        <Badge
          key={index}
          className="bg-omni-blue text-white text-center w-fit text-sm hover:bg-omni-blue/90 transition-colors cursor-pointer"
        >
          {text}
        </Badge>
      ))}
    </div>
  );
};
const HelpSearchComponent = () => {
  return (
    <div className="bg-omni-background-grey h-fit w-full p-10 flex flex-col gap-4 rounded-xl xl:max-w-96">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-lg">Hey, need some help?</h1>
        <span className="text-omni-text-grey text-base">
          Type your question or search keyword
        </span>
      </div>
      <Input
        className="w-full h-12 rounded-xl text-base"
        placeholder="Search"
      />
      <div className="flex flex-col gap-2">
        <span className="text-omni-text-grey text-base">Popular search:</span>
        <BadgeGrid />
      </div>
    </div>
  );
};

const HelpIconComponent = ({
  icon: Icon,
  label,
  sublabel,
  active = false,
  onClick,
}: HelpIconProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer flex w-full  max-h-72 rounded-xl border-2 transition-all ease-in-out px-4 justify-between items-center gap-2 xl:max-w-[90%]",
        active ? "border-omni-blue" : "hover:border-omni-blue"
      )}
    >
      <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
        <Icon
          className={cn(
            "size-10 rounded-full p-2  bg-omni-red",
            active ? "bg-omni-blue text-white" : "bg-omni-text-grey/10"
          )}
        />
        <div className="py-4 flex flex-col">
          <h3 className="font-bold text-base">{label}</h3>
          <span className="text-sm text-omni-text-grey font-normal text-wrap">
            {sublabel}
          </span>
        </div>
      </div>
      <ChevronRight className="size-10 text-omni-text-grey" />
    </div>
  );
};

const RightSideComponent = ({ label, sublabel }: ContentItem) => {
  return (
    <div className="rounded-xl h-fit border-2 p-6 flex flex-col gap-2">
      <h3 className="font-semibold text-base">{label}</h3>
      <span className="font-light text-omni-text-grey text-sm text-balance">
        {sublabel}
      </span>
    </div>
  );
};

const Page = () => {
  const [activeOption, setActiveOption] = useState(HelpOptionsData[0]);

  return (
    <section className="w-full h-full overflow-clip">
      <div className="md:flex justify-center size-full">
        <div className="relative md:px-2 md:w-[40%] lg:px-6 xl:px-10 flex flex-col items-center gap-8 border-r-2">
          <HelpSearchComponent />
          <div className="flex flex-col gap-6 size-full items-center overflow-y-auto">
            {HelpOptionsData.map((item) => (
              <HelpIconComponent
                key={item.id}
                icon={item.icon}
                label={item.label}
                sublabel={item.sublabel}
                active={item.label === activeOption.label}
                onClick={() => setActiveOption(item)}
              />
            ))}
          </div>
        </div>
        <div className="relative w-[60%] px-8">
          <div className="flex flex-col gap-2 mb-10">
            <h3 className="text-xl font-bold">{activeOption.label}</h3>
            <span className="text-omni-text-grey">
              {activeOption.sublabel}
            </span>
          </div>
          <div className="flex flex-col gap-4 h-full overflow-y-auto">
            {contentData[activeOption.label as keyof typeof contentData].map(
              (item, index) => (
                <RightSideComponent
                  key={index}
                  label={item.label}
                  sublabel={item.sublabel}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
