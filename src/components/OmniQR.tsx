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
import { quickNavItems } from "@/lib/utils";
import { Copy, QrCodeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

//TODO: QR and Links need to be fetched from the backend

const OmniQR = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <QrCodeIcon className="size-9 p-2 " />
      </DialogTrigger>

      <DialogOverlay className="bg-omni-pitch-black/80" />

      <DialogContent className="sm:max-w-[425px] bg-omni-background-grey">
        <DialogHeader>
          <DialogTitle className="w-full flex items-center justify-center text-lg font-manrope text-omni-dark-blue font-bold mb-4">
            Q.R. CODE & LINK
          </DialogTitle>
          <DialogDescription>
            <div className="text-base font-bold text-omni-pitch-black font-manrope flex">
              <span className="flex-1">QUICK NAVIGATE</span>
              {/* <div className="flex gap-2 items-center justify-center">
            <ChevronLeft className="size-4" />
            <ChevronRight className="size-4" />
          </div> */}
            </div>
            <div className="flex justify-between my-4 ">
              {quickNavItems.map(({ icon: Icon, label, href }) => (
                <Link key={href} href={href}>
                  <div className="flex flex-col justify-center items-center gap-2 transition-all ease-in-out hover:text-omni-blue ">
                    <Icon className="size-12 p-4 bg-[#D9D9D9] rounded-full hover:bg-omni-blue hover:text-white" />
                    <span className="font-medium text-xm">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          {/* <Input className="w-full h-12 rounded-lg px-6 text-lg" /> */}
          <Image
            src={"/placeholder/qr.png"}
            alt="QR"
            width={300}
            height={300}
          />
        </div>
        {/* <SearchInput type={"desktop"} /> */}
        <DialogFooter>
          <Button
            type="submit"
            className="flex justify-center gap-2 w-full h-fit bg-omni-blue text-white hover:text-omni-pitch-black hover:bg-white border-2 hover:border-omni-blue mt-2"
          >
            <span className="font-semibold">http://localhost:3000/</span>
            <Copy className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OmniQR;
