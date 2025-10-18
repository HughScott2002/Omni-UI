import Image from "next/image";
import React, { ReactNode } from "react";
import { OmniAuthFooter } from "./OmniAuthFooter";

const OmniAuthLeftSide = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-2 sm:mx-14 py-2 sm:py-10 h-full flex flex-col">
      <div className="w-full h-fit">
        <Image
          src="/icons/Omni-Logo.svg"
          alt="Omni Logo"
          width={56}
          height={56}
          className="h-12 w-10"
        />
      </div>
      <div className="w-full flex-auto  flex flex-col gap-4 justify-center items-center">
        {children}
      </div>
      <OmniAuthFooter />
    </div>
  );
};

export default OmniAuthLeftSide;
