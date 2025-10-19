import Image from "next/image";
import React from "react";
import OmniLicence from "./OmniLicence";

const OmniAuthRightSide = () => {
  return (
    <div className="bg-omni-blue hidden lg:flex items-center justify-center w-full h-screen">
      <div className="bg-auth-right-bg bg-no-repeat bg-center bg-contain w-full h-full flex flex-col items-center justify-center">
        <div className=" h-fit w-4/5">
          <div className=" flex justify-center items-center align-middle w-full">
            <Image
              alt="Financial interface showing balance and transactions"
              className="object-contain"
              height={600}
              src="/auth/Hey.png"
              width={600}
            />
          </div>
          <div className="text-white text-center ">
            <h2 className="text-white text-4xl my-4 flex-1 font-extrabold font-manrope text-nowrap w-full px-auto ">
              Getting out of the way.
            </h2>
            <p className="text-white font-medium text-sm text-opacity-75 font-manrope w-full text-pretty ">
              Omni helps you send money person to person instally across the
              carribbean. It's always alive, always ready to serve, always safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OmniAuthRightSide;
