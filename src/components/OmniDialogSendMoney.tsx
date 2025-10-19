import { Plus } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

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
interface OmniDialogSendMoneyProps {
  wallets: OmniWalletData[];
  contacts: any[];
  selectedWallet: string;
  selectedContact: string;
  amount: string;
  description: string;
  onWalletChange: (walletId: string) => void;
  onContactChange: (contactId: string) => void;
  onAmountChange: (amount: string) => void;
  onDescriptionChange: (description: string) => void;
}

const OmniDialogSendMoney = ({
  wallets,
  contacts,
  selectedWallet,
  selectedContact,
  amount,
  description,
  onWalletChange,
  onContactChange,
  onAmountChange,
  onDescriptionChange,
}: OmniDialogSendMoneyProps) => {
  return (
    <>
      <div className="text-base font-bold text-omni-pitch-black font-manrope flex my-4">
        <span className="flex-1">TRANSFER DETAILS</span>
      </div>
      <div className="flex flex-col h-fit w-full gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="wallet">From Wallet</Label>
          <Select value={selectedWallet} onValueChange={onWalletChange}>
            <SelectTrigger id="wallet" className="w-full">
              <SelectValue placeholder="Select wallet" />
            </SelectTrigger>
            <SelectContent>
              {wallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id}>
                  {wallet.type} - ${wallet.balance.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact">To Contact</Label>
          <Select value={selectedContact} onValueChange={onContactChange}>
            <SelectTrigger id="contact" className="w-full">
              <SelectValue placeholder="Select contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((contact) => (
                <SelectItem key={contact.contactId} value={contact.contactId}>
                  {contact.omniTag} - {contact.firstName} {contact.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="w-full h-12 text-omni-pitch-black rounded-xl"
            placeholder="0.00"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full text-omni-pitch-black rounded-xl resize-none"
            placeholder="What's this for?"
            rows={2}
          />
        </div>
      </div>
    </>
  );
};

export default OmniDialogSendMoney;
