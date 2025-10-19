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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogPortal } from "@radix-ui/react-dialog";
import {
  ArrowRightLeft,
  BotMessageSquare,
  ChevronLeft,
  ChevronRight,
  Contact,
  DiamondPlusIcon,
  LucideIcon,
  PiggyBank,
  Search,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import SearchInput from "./SearchInput";
import { quickNavItems } from "@/lib/utils";

const OmniSearch = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Search className="size-9 p-2 " />
      </DialogTrigger>

      <DialogOverlay className="bg-omni-pitch-black/80" />

      <DialogContent className="sm:max-w-[425px] bg-omni-background-grey">
        <DialogHeader>
          <DialogTitle className="w-full flex items-center justify-center text-lg font-manrope text-omni-dark-blue font-bold mb-4">
            SEARCH
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
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div> */}
        <div>
          <Input className="w-full h-12 rounded-lg px-6 text-lg" />
        </div>
        {/* <SearchInput type={"desktop"} /> */}
        <DialogFooter>
          <Button
            type="submit"
            className="w-full h-fit bg-omni-blue text-white hover:text-omni-pitch-black hover:bg-white border-2 hover:border-omni-blue mt-2"
          >
            <span className="font-semibold">Search</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OmniSearch;
