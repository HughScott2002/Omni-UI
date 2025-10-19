import { Plus } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import OmniWalletCard from "./OmniWalletCard";

type OmniCardItemProps = {
  src: string;
  title: string;
  subtitle: string;
};

export const paymentMethods: OmniCardItemProps[] = [
  {
    src: "/placeholder/Visa.png",
    title: "Visa",
    subtitle: "$74,787.78",
  },
  {
    src: "/placeholder/Mastercard.png",
    title: "Mastercard",
    subtitle: "$12,345.67",
  },
  {
    src: "/placeholder/Discover.png",
    title: "Discover",
    subtitle: "$98,765.43",
  },
];

const OmniCardItem = ({
  src,
  title,
  subtitle,
  onClick,
  selected = false,
  className = "",
}: OmniCardItemProps & {
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={`h-fit w-full border-2 p-2 flex items-center  rounded-2xl gap-2 cursor-pointer transition-all
            ${
              selected
                ? "border-omni-blue"
                : "border-gray-200 hover:border-omni-blue/50"
            }
            ${className}`}
    >
      <Image src={src} width={40} height={40} alt={title} />
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <span className="font-bold text-sm">{title}</span>
          <span className="text-xs">{subtitle}</span>
        </div>
        <Image
          src={"/icons/omni-check.svg"}
          width={20}
          height={20}
          alt="check"
        />
      </div>
    </div>
  );
};
const OmniDialogSendMoney = () => {
  return (
    <>
      <div className="text-base font-bold text-omni-pitch-black font-manrope flex my-4">
        <span className="flex-1">CHOOSE METHOD</span>
        <div className="flex gap-1 items-center justify-center rounded-full px-2 hover:text-omni-blue text-omni-text-grey cursor-pointer transition-all ease-in-out">
          <span className="font-medium text-sm">Add</span>
          <Plus className="size-4" />
          {/* <ChevronLeft className="size-4" />
    <ChevronRight className="size-4 text-omni-blue" /> */}
        </div>
      </div>
      <div className="flex flex-col h-fit w-full gap-2">
        <div className="flex flex-col gap-2">
          {paymentMethods.map((method) => (
            <OmniCardItem
              key={method.title}
              {...method}
              // onClick={() => {}}
              selected={false}
            />
          ))}
        </div>
        {/* <div className="flex flex-col gap-4  px-2 justify-center items-center">
          <OmniWalletCard
            balance={""}
            cardNumber={""}
            currency={"JMD"}
            date={""}
          />
        </div> */}
        <Input
          type="number"
          className="w-full h-14 text-omni-pitch-black rounded-xl col-span-2"
          placeholder="Enter Amount"
        />
      </div>
    </>
  );
};

export default OmniDialogSendMoney;
