"use client";

import {
  ChevronDown,
  CircleHelp,
  ArrowUpDown,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getListWallets } from "@/lib/fetch";

//TODO: Add Cacheing

const fauxData: OmniWalletData[] = [
  {
    walletId: "9ce02711-57f2-461e-afbb-f10734e61240",
    accountId: "65f72280-56f2-4ba6-923d-e868b6a3e30e",
    type: "PRIMARY",
    balance: 2332.09,
    currency: "USD",
    status: "inactive",
    isDefault: true,
    dailyLimit: 5000,
    monthlyLimit: 20000,
    lastActivity: null,
    createdAt: "2025-01-12T19:12:51.585934173Z",
    updatedAt: "2025-01-12T19:12:51.585937454Z",
  },
  {
    walletId: "9ce02711-57f2-461e-afbb-f10734e61240",
    accountId: "65f72280-56f2-4ba6-923d-e868b6a3e30e",
    type: "PRIMARY",
    balance: 234234,
    currency: "USD",
    status: "active",
    isDefault: false,
    dailyLimit: 5000,
    monthlyLimit: 20000,
    lastActivity: null,
    createdAt: "2025-01-12T19:12:51.585934173Z",
    updatedAt: "2025-01-12T19:12:51.585937454Z",
  },
];

const tableHeaders = [
  { label: "Type", icon: ArrowUpDown },
  { label: "Balance", icon: ChevronDown },
  { label: "Status", icon: ChevronDown },
];

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 whitespace-nowrap">{children}</td>;
}

type TableHeaderMakerProps = {
  label: string;
  icon: typeof ArrowUpDown | typeof ChevronDown;
};

const TableHeaderMaker = ({ label, icon: Icon }: TableHeaderMakerProps) => {
  return (
    <div className="py-2 flex items-center gap-2">
      <span className="text-sm font-bold text-omni-pitch-black">{label}</span>
      <Icon className="size-5 text-omni-pitch-black cursor-pointer" />
    </div>
  );
};

export default function WalletsPage() {
  const [wallets, setListWallets] = useState<OmniWalletData[]>(fauxData);
  const { user } = useAuth();
  const router = useRouter();

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  useEffect(() => {
    async function fetchWallets() {
      const data = await getListWallets(user?.id);
      if (data.length > 0) {
        setListWallets(data);
      }
    }

    fetchWallets();
  }, [user?.id]);

  return (
    <section className="w-full h-full flex justify-center ">
      <div className="max-w-4xl w-full rounded-2xl py-20 ">
        <div>
          <div className="mb-10 w-full flex justify-between items-center ">
            <div>
              <div className="flex gap-2 items-center pl-1">
                <span className="text-sm">Available</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleHelp className="text-omni-text-grey size-4" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-omni-blue">
                      <span className="text-xs text-white">
                        The balance of all your Wallets
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-3xl font-semibold text-omni-pitch-black flex gap-1">
                <span>{formatCurrency(totalBalance, "USD")}</span>
                <div className="flex items-start">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <ShieldCheck className="bg-omni-green/40 rounded-full size-6 p-1 fill-omni-green" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-omni-blue">
                        <span className="text-xs text-white">
                          Your money is in the Vault
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            <div className="flex gap-4 h-full items-center">
              <Button className="bg-omni-background-grey rounded-lg flex gap-1 text-omni-blue font-semibold">
                <Plus className="size-4" />
                <span>New account</span>
              </Button>
            </div>
          </div>

          <div className="rounded-lg overflow-y-auto cursor-pointer">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  {tableHeaders.map((header, index) => (
                    <TableHeader key={index}>
                      <TableHeaderMaker
                        label={header.label}
                        icon={header.icon}
                      />
                    </TableHeader>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-omni-background-grey">
                {wallets.map((wallet, index) => (
                  <tr
                    className="hover:bg-omni-background-grey cursor-pointer transition-colors"
                    onClick={() => {
                      router.push(`/my-wallets/${wallet.walletId}`);
                    }}
                    key={index}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <div className="size-12 flex-shrink-0 rounded-xl bg-gray-200" />
                        <div className="ml-4">
                          <div className="font-bold text-omni-pitch-black text-base">
                            {wallet.type}
                          </div>
                          <div className="text-omni-text-grey text-sm">
                            {wallet.currency}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-omni-pitch-black">
                        {formatCurrency(wallet.balance, wallet.currency)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-lg cursor-default capitalize ${
                          wallet.status.toLocaleLowerCase() === "active"
                            ? "bg-omni-green/10 text-omni-green"
                            : "bg-omni-red/10 text-omni-red"
                        }`}
                      >
                        {wallet.status}
                      </span>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
