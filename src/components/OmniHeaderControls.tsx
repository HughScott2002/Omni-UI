import OmniNotification from "@/components/OmniNotification";

import { ArrowLeftRight, BellDot, ChevronDown, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import { map } from "zod";
import { ElementType, FC, ReactNode } from "react";
import OmniProfile from "./OmniProfile";
import OmniSearch from "./OmniSearch";
import { CommandShortcut } from "./ui/command";
import { Badge } from "./ui/badge";
import OmniQR from "./OmniQR";
import OmniSendMoney from "./OmniSendMoney";

const OmniMoveButton = () => {
  return (
    <OmniSendMoney
      trigger={
        <div className="p-2 flexitems-center">
          <ArrowLeftRight className="size-4" />
        </div>
      }
    />
  );
};

type Controls = { node: any };
type ControlsArray = Controls[];
const controls: ControlsArray = [
  {
    node: OmniSearch,
  },
  {
    node: OmniQR,
  },
  {
    node: OmniMoveButton,
  },

  {
    node: OmniNotification,
  },

  {
    node: SidebarTrigger,
  },

  {
    node: OmniProfile, //Change this and stuff
  },
];

const OmniHeaderControls = () => {
  return (
    <div className="flex justify-end items-center gap-4 ">
      <CommandShortcut className="px-2 rounded-full -mx-3 cursor-default">
        {/* Ctrl+K/  */}

        <Badge className="bg-omni-blue py-0 px-1 text-white text-center w-fit font-medium text-[0.6rem]">
          <span className="">⌘K</span>
        </Badge>
      </CommandShortcut>
      {controls.map((control: Controls, index) => (
        <div
          className="w-fit h-fit bg-omni-background-grey rounded-full hover:bg-omni-blue hover:text-white  transition-colors ease-in"
          key={index}
        >
          <control.node className="size-9 p-2" />
        </div>
      ))}
    </div>
  );
};

export default OmniHeaderControls;
