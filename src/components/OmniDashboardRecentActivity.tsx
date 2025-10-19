import Link from "next/link";
import OmniSmallTransactionComponent from "./OmniSmallTransactionComponent";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

const OmniDashboardRecentActivity = () => {
  return (
    <div className=" min-h-fit w-full flex flex-col">
      <h2 className="flex w-full  my-4 justify-between items-center sticky top-0">
        <span className="w-full font-poppins font-semibold text-lg">
          Recent Activity
        </span>
        {/* <Link href={"/transactions"} className="h-fit w-fit flex text-nowrap">
          <span className="text-omni-text-grey hover:text-omni-blue hover:underline">
            View All
          </span>
        </Link> */}
        <Button className="bg-omni-background-grey rounded-full text-omni-blue font-semibold">
          View all <ChevronRight className="size-4" />
        </Button>
      </h2>

      <div className="flex-1 min-h-2 max-h-[50]  ">
        <div className="flex flex-col gap-2 overflow-y-auto">
          <OmniSmallTransactionComponent
            transationLabel={"Flexy Gym"}
            type={"Payment"}
            date={"Jan 29, 2024"}
            Time={"8:00 pm"}
            href={"/transactions"}
            photo={"https://github.com/shadcn.png"}
          />
          <OmniSmallTransactionComponent
            transationLabel={"Clapper"}
            type={"Payment"}
            date={"Jan 29, 2024"}
            Time={"10:00 pm"}
            href={"/transactions"}
            photo={"https://github.com/shadcn.png"}
          />
          <OmniSmallTransactionComponent
            transationLabel={"Clapper"}
            type={"Payment"}
            date={"Jan 29, 2024"}
            Time={"10:00 pm"}
            href={"/transactions"}
            photo={"https://github.com/shadcn.png"}
          />
          <OmniSmallTransactionComponent
            transationLabel={"Clapper"}
            type={"Payment"}
            date={"Jan 29, 2024"}
            Time={"10:00 pm"}
            href={"/transactions"}
            photo={"https://github.com/shadcn.png"}
          />

          {/* <OmniInactiveDevelopment /> */}
          {/* <OmniInactiveDevelopment /> */}
        </div>
      </div>
    </div>
  );
};

export default OmniDashboardRecentActivity;
