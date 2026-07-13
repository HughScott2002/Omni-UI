import { CircleDollarSign } from "lucide-react";
import { FC, ReactNode } from "react";
import { OmniOffline, OmniStatCardSkeleton } from "./OmniCardState";
import { DashboardStatus } from "@/hooks/useDashboardData";

interface TopDashComponentsProps {
  ChartContainer: ReactNode;
  label: string;
  title: string;
  /** Data state — loading shows a skeleton, error a branded offline fallback */
  state?: DashboardStatus;
  onRetry?: () => void;
}

const OmniTopDashComponent: FC<TopDashComponentsProps> = ({
  ChartContainer,
  label,
  title,
  state = "ready",
  onRetry,
}) => {
  return (
    <div className="h-[11rem] p-4 rounded-2xl border-2 border-omni-background-grey transition-all">
      {state === "loading" ? (
        <OmniStatCardSkeleton />
      ) : state === "error" ? (
        <OmniOffline variant="compact" onRetry={onRetry} />
      ) : (
        <div className="size-full flex flex-col justify-between">
          <div className="w-full h-fit flex justify-between items-center">
            <div className="w-full">
              <div className="font-medium text-omni-dark-blue text-sm">
                {label}
              </div>
              <div className="font-bold font-poppins text-xl text-omni-pitch-black tabular-nums">
                {title}
              </div>
            </div>
            <CircleDollarSign className="p-2 border-2 border-omni-background-grey size-10 rounded-lg shrink-0" />
          </div>
          <div className="w-full h-full min-h-0">{ChartContainer}</div>
        </div>
      )}
    </div>
  );
};

export default OmniTopDashComponent;
