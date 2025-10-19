import { Ban, Eye } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { FC } from "react";

interface OmniWalletCardProps {
  balance: number | string;
  cardNumber: number | string;
  currency: "JMD" | "USD" | "JPY" | "GBP"; // TODO: Add more currency
  date: Date | string;
}

const OmniWalletCard: FC<OmniWalletCardProps> = ({
  balance,
  cardNumber,
  currency,
  date,
}) => {
  return (
    <div className="w-full h-48 rounded-2xl bg-omni-pitch-black mt-2 aspect-square">
      {/* <WalletCard businessName={"sda"} /> */}
      <div className="size-full flex flex-col">
        <div className="h-full flex flex-col justify-between">
          <div className="flex justify-between px-6 py-4 ">
            <Button variant={"ghost"} className="cursor-pointer -p-2">
              <Eye className="text-white" />
            </Button>
            <Image
              src={"/icons/mastercard.svg"}
              width={50}
              height={50}
              alt={"Wallet Card"}
              className="-mr-2"
            />
          </div>
          <div className="text-white w-full px-6 flex h-full justify-between items-center ">
            <span>{cardNumber}</span>
            <span className="text-omni-text-grey">{date.toString()}</span>
          </div>
        </div>
        <div className="bg-omni-green w-full h-20 rounded-b-2xl px-6 font-bold text-xl text-omni-dark-blue flex justify-between items-center">
          {currency === "GBP" ? "£" : "$"}
          {balance}
          <Ban
            strokeWidth={3}
            className="hover:text-omni-red transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default OmniWalletCard;
