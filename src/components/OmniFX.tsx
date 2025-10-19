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

import { ReactNode } from "react";
import OmniDialogRecentContacts from "./OmniDialogRecentContacts";
import OmniDialogSendMoney from "./OmniDialogSendMoney";

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

type OmniFXProps = {
  trigger: ReactNode;
};

const OmniFX = ({ trigger }: OmniFXProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Icon/> */}
        {trigger}
      </DialogTrigger>

      <DialogOverlay className="bg-omni-pitch-black/80" />

      <DialogContent className="sm:max-w-[425px] bg-omni-background-grey">
        <DialogHeader>
          <DialogTitle className="w-full flex items-center justify-center text-lg font-manrope text-omni-dark-blue font-bold mb-4">
            Exchange Currency
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <OmniDialogRecentContacts data={recentContacts} />
          <OmniDialogSendMoney />
        </DialogDescription>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full h-fit bg-omni-blue text-white hover:text-omni-pitch-black hover:bg-white border-2 hover:border-omni-blue mt-2"
          >
            <span className="font-semibold">Continue</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OmniFX;
