"use client";

import { FC, ReactNode } from "react";
import { CloudOff, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

/**
 * Shared dashboard card states: loading skeleton, offline fallback and empty
 * state. Every dashboard section renders one of these instead of stale or
 * fabricated numbers when live data isn't available.
 */

interface OmniOfflineProps {
  onRetry?: () => void;
  /** compact fits the small stat cards; full fits the large panels */
  variant?: "compact" | "full";
  className?: string;
}

export const OmniOffline: FC<OmniOfflineProps> = ({
  onRetry,
  variant = "full",
  className,
}) => {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "size-full flex flex-col items-center justify-center gap-2 text-center",
          className
        )}
      >
        <div className="rounded-full bg-omni-blue/10 p-2.5 text-omni-blue">
          <CloudOff className="size-4" />
        </div>
        <p className="text-xs font-medium text-omni-text-grey">
          Live data unavailable
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="min-h-10 -mt-1 px-3 inline-flex items-center gap-1 text-xs font-semibold text-omni-blue rounded-full transition-[background-color,scale] hover:bg-omni-blue/10 active:scale-[0.96]"
          >
            <RefreshCw className="size-3" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "size-full flex flex-col items-center justify-center gap-3 py-8 text-center",
        className
      )}
    >
      <div className="rounded-full bg-omni-blue/10 p-4 text-omni-blue">
        <CloudOff className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="font-poppins font-semibold text-omni-dark-blue text-balance">
          Live data unavailable
        </p>
        <p className="text-sm text-omni-text-grey text-pretty">
          We couldn&apos;t reach Omni right now — your money is safe.
        </p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="rounded-full bg-omni-blue hover:bg-omni-dark-blue text-white font-semibold px-5 transition-[background-color,scale] active:scale-[0.96]"
        >
          <RefreshCw className="size-4 mr-1.5" />
          Try again
        </Button>
      )}
    </div>
  );
};

interface OmniEmptyProps {
  title: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}

export const OmniEmpty: FC<OmniEmptyProps> = ({
  title,
  hint,
  icon,
  className,
}) => (
  <div
    className={cn(
      "size-full flex flex-col items-center justify-center gap-2 py-6 text-center",
      className
    )}
  >
    <div className="rounded-full bg-omni-green/10 p-3 text-omni-green">
      {icon ?? <Sparkles className="size-5" />}
    </div>
    <p className="text-sm font-semibold font-poppins text-omni-dark-blue text-balance">
      {title}
    </p>
    {hint && <p className="text-xs text-omni-text-grey text-pretty">{hint}</p>}
  </div>
);

export const OmniStatCardSkeleton: FC = () => (
  <div className="size-full flex flex-col justify-between gap-3">
    <div className="space-y-2">
      <Skeleton className="h-3 w-16 rounded-full bg-omni-text-grey/25" />
      <Skeleton className="h-6 w-24 rounded-lg bg-omni-text-grey/25" />
    </div>
    <Skeleton className="h-14 w-full rounded-lg bg-omni-text-grey/25" />
  </div>
);

export const OmniPanelSkeleton: FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="size-full flex flex-col gap-3 py-2">
    {Array.from({ length: rows }, (_, i) => (
      <Skeleton key={i} className="h-12 w-full rounded-xl bg-omni-text-grey/25" />
    ))}
  </div>
);
