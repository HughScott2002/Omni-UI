"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ReactNode, useState, useEffect } from "react";
import OmniDialogRecentContacts from "./OmniDialogRecentContacts";
import OmniDialogSendMoney from "./OmniDialogSendMoney";
import { getContacts } from "@/lib/contacts";
import { getWallets } from "@/lib/fetch";
import { transferMoney } from "@/lib/transactions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type recentContactsItems = {
  image: string;
  label: string;
  href: string;
};

export const recentContacts: recentContactsItems[] = [
  {
    image: "/placeholder/Ian.png",
    label: "Ian",
    href: "/contacts",
  },
  {
    image: "/placeholder/Cyndy.png",
    label: "Cyndy",
    href: "/my-wallets",
  },
  {
    image: "/placeholder/Roselle.png",
    label: "Roselle",
    href: "/savings",
  },
  {
    image: "/placeholder/TannerS.png",
    label: "Tanner. S",
    href: "/settings",
  },
  //   {
  //     icon: Plus,
  //     label: "Add",
  //     href: "/transactions",
  //   },
];

type OmniSendMoneyPros = {
  trigger: ReactNode;
  accountId?: string;
  onSuccess?: () => void;
};

const OmniSendMoney = ({ trigger, accountId, onSuccess }: OmniSendMoneyPros) => {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [wallets, setWallets] = useState<OmniWalletData[]>([]);
  const [selectedContact, setSelectedContact] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && accountId) {
      loadData();
    }
  }, [open, accountId]);

  const loadData = async () => {
    if (!accountId) return;

    try {
      const [contactsData, walletsData] = await Promise.all([
        getContacts(accountId),
        getWallets(accountId),
      ]);

      setContacts(contactsData || []);
      setWallets(Array.isArray(walletsData) ? walletsData : []);

      if (Array.isArray(walletsData) && walletsData.length > 0) {
        setSelectedWallet(walletsData[0].id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleTransfer = async () => {
    if (!selectedContact || !selectedWallet || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill all fields correctly",
        variant: "destructive",
      });
      return;
    }

    const contact = contacts.find(c => c.contactId === selectedContact);
    if (!contact) return;

    setLoading(true);
    try {
      await transferMoney({
        senderWalletId: selectedWallet,
        receiverOmniTag: contact.omniTag,
        amount: parseFloat(amount),
        description: description || `Transfer to ${contact.omniTag}`,
      });

      toast({
        title: "Transfer Successful",
        description: `Sent $${amount} to ${contact.omniTag}`,
      });

      setOpen(false);
      setAmount("");
      setDescription("");
      setSelectedContact("");
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to complete transfer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const recentContactsFormatted = contacts.slice(0, 3).map(c => ({
    image: "/placeholder/Ian.png",
    label: c.omniTag || "Contact",
    href: "#",
    contactId: c.contactId,
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogOverlay className="bg-omni-pitch-black/80" />

      <DialogContent className="sm:max-w-[425px] bg-omni-background-grey">
        <DialogHeader>
          <DialogTitle className="w-full flex items-center justify-center text-lg font-manrope text-omni-dark-blue font-bold mb-4">
            SEND MONEY
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <OmniDialogRecentContacts
            data={recentContactsFormatted}
            onSelect={setSelectedContact}
            selected={selectedContact}
          />
          <OmniDialogSendMoney
            wallets={wallets}
            contacts={contacts}
            selectedWallet={selectedWallet}
            selectedContact={selectedContact}
            amount={amount}
            description={description}
            onWalletChange={setSelectedWallet}
            onContactChange={setSelectedContact}
            onAmountChange={setAmount}
            onDescriptionChange={setDescription}
          />
        </DialogDescription>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleTransfer}
            disabled={loading || !selectedContact || !amount}
            className="w-full h-fit bg-omni-blue text-white hover:text-omni-pitch-black hover:bg-white border-2 hover:border-omni-blue mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <span className="font-semibold">Send Money</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OmniSendMoney;
