import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ReactNode } from "react";

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
        <DialogDescription className="text-center text-base font-poppins text-omni-text-grey py-6">
          Currency exchange is not available in this release.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default OmniFX;
