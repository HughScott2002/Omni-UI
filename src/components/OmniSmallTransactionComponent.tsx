import Image from "next/image";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface SmallTransactionComponentProps {
  transationLabel: string;
  type: string;
  date: Date | string;
  Time: string | Date;
  href: string;
  photo?: string;
  icon?: ReactNode;
  amount?: string;
  amountClass?: string;
}

const OmniSmallTransactionComponent: FC<SmallTransactionComponentProps> = ({
  transationLabel,
  type,
  date,
  Time,
  href,
  photo,
  icon,
  amount,
  amountClass,
}) => {
  return (
    <Link
      href={href}
      className="w-full h-fit flex items-center gap-4 py-2 hover:bg-omni-background-grey border-2 border-white hover:border-omni-background-grey transition-[background-color,border-color,padding] rounded-lg hover:px-2"
    >
      {/* Icons and Images */}
      {icon ? (
        <div className="size-12 flex items-center justify-center rounded-xl shrink-0">
          {icon}
        </div>
      ) : photo ? (
        <div className="size-12 flex items-center justify-center rounded-xl shrink-0">
          <Image
            width={500}
            height={500}
            src={photo}
            alt={"Dashboard Transaction Icon"}
            className="rounded-xl"
          />
        </div>
      ) : (
        <div className="size-14 flex items-center justify-center rounded-xl shrink-0">
          {type}
        </div>
      )}
      {/* Name and Types */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-base font-medium truncate">
          {transationLabel}
        </span>
        <span className="text-xs font-medium text-omni-text-grey">{type}</span>
      </div>

      {/* Amount or Dates */}
      <div className="flex flex-col items-end shrink-0">
        {amount ? (
          <span
            className={`text-base font-semibold tabular-nums ${
              amountClass ?? "text-omni-pitch-black"
            }`}
          >
            {amount}
          </span>
        ) : (
          <span className="text-base font-semibold uppercase text-omni-pitch-black">
            {date.toString()}
          </span>
        )}
        <span className="text-omni-text-grey text-sm">
          {amount ? `${date} · ${Time}` : `At ${Time}`}
        </span>
      </div>
    </Link>
  );
};

export default OmniSmallTransactionComponent;
