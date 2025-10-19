import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Ellipsis,
  LucideIcon,
} from "lucide-react";
import OmniWalletCard from "./OmniWalletCard";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import OmniRequestPayment from "./OmniRequestPayment";
import OmniSendMoney from "./OmniSendMoney";
import Link from "next/link";
import OmniFX from "./OmniFX";

interface IconComponent {
  className?: string;
}

interface DashboardWalletIconProps {
  Icon: LucideIcon | FC<IconComponent>;
  title: string;
  textColor: string;
  hoverColor: string;
}

const WidgetSVG: FC<IconComponent> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-grid-2x2-plus", className)}
    >
      <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" />
      <path d="M16 19h6" />
      <path d="M19 22v-6" />
    </svg>
  );
};

const DashboardWalletIcon: FC<DashboardWalletIconProps> = ({
  Icon,
  title,
  textColor,
  hoverColor,
}) => {
  return (
    <div className={`flex flex-col justify-center items-center gap-2 hun`}>
      <div
        className={`size-12 p-2 border-2 border-omni-background-grey rounded-xl cursor-pointer ${textColor} hover:${hoverColor} hover:text-white justify-center align-middle items-center`}
      >
        <Icon className="size-full" strokeWidth={2} />
      </div>
      <span className="font-semibold text-omni-text-grey font-poppins text-sm">
        {title}
      </span>
    </div>
  );
};

const triggerRequestPaymentButton = (
  <Button className="size-full p-0 m-0" variant={"ghost"}>
    <DashboardWalletIcon
      Icon={ArrowDownLeft}
      title="Request"
      textColor="text-omni-blue"
      hoverColor="bg-omni-blue"
    />
  </Button>
);

const triggerSendMoneyButton = (
  <Button className="size-full p-0 m-0" variant={"ghost"}>
    <DashboardWalletIcon
      Icon={ArrowUpRight}
      title="Send"
      textColor="text-omni-green"
      hoverColor=" hover:bg-omni-green"
    />
  </Button>
);

const triggerExchangeButton = (
  <DashboardWalletIcon
    Icon={ArrowRightLeft}
    title="Exchange"
    textColor="text-omni-yellow"
    hoverColor=" hover:bg-omni-yellow"
  />
);

const triggerMoreButton = (
  <DashboardWalletIcon
    Icon={WidgetSVG}
    title="More"
    textColor="text-omni-text-grey"
    hoverColor=" hover:bg-omni-text-grey"
  />
);
const OmniDashboardWalletSection = () => {
  return (
    <div className="min-h-[400px] max-h-[400px] border-2 border-omni-background-grey rounded-2xl h-[55%] w-full flex flex-col items-center px-6 py-6">
      <div className="flex w-full">
        <span className="w-full font-poppins font-semibold text-lg ">
          Wallet
        </span>
        <Ellipsis className="size-8" />
      </div>

      <OmniWalletCard
        balance={"13,543.32"}
        cardNumber={"**** **** **** 7854"}
        currency={"JMD"}
        date={"11/22"}
      />
      <Ellipsis className="my-2 size-8 text-omni-text-grey" />
      <div className="flex gap-6 w-full justify-center ">
        <OmniSendMoney trigger={triggerSendMoneyButton} />
        <OmniRequestPayment trigger={triggerRequestPaymentButton} />
        <OmniFX trigger={triggerExchangeButton} />

        {/* <Link href="/fx">{triggerExchangeButton}</Link> */}
        <Link href={"/my-wallets"}>{triggerMoreButton}</Link>
      </div>
    </div>
  );
};

export default OmniDashboardWalletSection;
