import React from "react";
import { ArrowUpDown, ChevronDown, type LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

// Define the transaction type
type Transaction = {
  name: string;
  type: string;
  date: string;
  time: string;
  invoiceId: string;
  amount: string;
  status: "Pending" | "Success" | "Failed";
};

// Define the data array
const transactions: Transaction[] = [
  {
    name: "Gym",
    type: "Payment",
    date: "JUL 29, 2022",
    time: "AT 08:00 PM",
    invoiceId: "PMX09812",
    amount: "+$300.00",
    status: "Pending",
  },
  {
    name: "AI-Bank",
    type: "Deposit",
    date: "JUL 27, 2022",
    time: "AT 09:00 PM",
    invoiceId: "PMX0979",
    amount: "-$890.15",
    status: "Success",
  },
  {
    name: "McDonald",
    type: "Payment",
    date: "JUL 25, 2022",
    time: "AT 05:00 PM",
    invoiceId: "OVF19244",
    amount: "-$600.00",
    status: "Success",
  },
  {
    name: "Amazon",
    type: "Payment",
    date: "JUL 22, 2022",
    time: "AT 08:00 AM",
    invoiceId: "AMX09871",
    amount: "+1,243.00",
    status: "Pending",
  },
  {
    name: "Facebook Ads",
    type: "Payment",
    date: "JUL 19, 2022",
    time: "AT 11:00 PM",
    invoiceId: "PMX09873",
    amount: "-$123.00",
    status: "Failed",
  },
  {
    name: "Gym",
    type: "Payment",
    date: "JUL 29, 2022",
    time: "AT 08:00 PM",
    invoiceId: "PMX09812",
    amount: "+$300.00",
    status: "Pending",
  },
  {
    name: "AI-Bank",
    type: "Deposit",
    date: "JUL 27, 2022",
    time: "AT 09:00 PM",
    invoiceId: "PMX0979",
    amount: "-$890.15",
    status: "Success",
  },
  {
    name: "McDonald",
    type: "Payment",
    date: "JUL 25, 2022",
    time: "AT 05:00 PM",
    invoiceId: "OVF19244",
    amount: "-$600.00",
    status: "Success",
  },
  {
    name: "Amazon",
    type: "Payment",
    date: "JUL 22, 2022",
    time: "AT 08:00 AM",
    invoiceId: "AMX09871",
    amount: "+1,243.00",
    status: "Pending",
  },
  {
    name: "Facebook Ads",
    type: "Payment",
    date: "JUL 19, 2022",
    time: "AT 11:00 PM",
    invoiceId: "PMX09873",
    amount: "-$123.00",
    status: "Failed",
  },
  {
    name: "Gym",
    type: "Payment",
    date: "JUL 29, 2022",
    time: "AT 08:00 PM",
    invoiceId: "PMX09812",
    amount: "+$300.00",
    status: "Pending",
  },
  {
    name: "AI-Bank",
    type: "Deposit",
    date: "JUL 27, 2022",
    time: "AT 09:00 PM",
    invoiceId: "PMX0979",
    amount: "-$890.15",
    status: "Success",
  },
  {
    name: "McDonald",
    type: "Payment",
    date: "JUL 25, 2022",
    time: "AT 05:00 PM",
    invoiceId: "OVF19244",
    amount: "-$600.00",
    status: "Success",
  },
  {
    name: "Amazon",
    type: "Payment",
    date: "JUL 22, 2022",
    time: "AT 08:00 AM",
    invoiceId: "AMX09871",
    amount: "+1,243.00",
    status: "Pending",
  },
  {
    name: "Facebook Ads",
    type: "Payment",
    date: "JUL 19, 2022",
    time: "AT 11:00 PM",
    invoiceId: "PMX09873",
    amount: "-$123.00",
    status: "Failed",
  },
  {
    name: "Gym",
    type: "Payment",
    date: "JUL 29, 2022",
    time: "AT 08:00 PM",
    invoiceId: "PMX09812",
    amount: "+$300.00",
    status: "Pending",
  },
  {
    name: "AI-Bank",
    type: "Deposit",
    date: "JUL 27, 2022",
    time: "AT 09:00 PM",
    invoiceId: "PMX0979",
    amount: "-$890.15",
    status: "Success",
  },
  {
    name: "McDonald",
    type: "Payment",
    date: "JUL 25, 2022",
    time: "AT 05:00 PM",
    invoiceId: "OVF19244",
    amount: "-$600.00",
    status: "Success",
  },
  {
    name: "Amazon",
    type: "Payment",
    date: "JUL 22, 2022",
    time: "AT 08:00 AM",
    invoiceId: "AMX09871",
    amount: "+1,243.00",
    status: "Pending",
  },
  {
    name: "Facebook Ads",
    type: "Payment",
    date: "JUL 19, 2022",
    time: "AT 11:00 PM",
    invoiceId: "PMX09873",
    amount: "-$123.00",
    status: "Failed",
  },
];

// Define the table header data
const tableHeaders: { label: string; icon: LucideIcon }[] = [
  { label: "Name/Business", icon: ArrowUpDown },
  { label: "Date", icon: ChevronDown },
  { label: "Invoice ID", icon: ChevronDown },
  { label: "Amount", icon: ChevronDown },
  { label: "Status", icon: ChevronDown },
  { label: "Actions", icon: ChevronDown },
];

type TableHeaderMakerProps = {
  label: string;
  icon: LucideIcon;
};

const TableHeaderMaker = ({ label, icon: Icon }: TableHeaderMakerProps) => {
  return (
    <div className="py-2 flex items-center gap-2">
      <span className="text-sm font-bold text-omni-pitch-black">{label}</span>
      <Icon className="size-5 text-omni-pitch-black cursor-pointer" />
    </div>
  );
};

export function OmniTransactionsTable() {
  return (
    <div className="rounded-lg overflow-y-auto scroll-">
      <table className="min-w-full">
        <thead className="border-b">
          <tr className="">
            {tableHeaders.map((header, index) => (
              <TableHeader key={index}>
                <TableHeaderMaker label={header.label} icon={header.icon} />
              </TableHeader>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-omni-background-grey">
          {transactions.map((transaction, index) => (
            <tr key={index} className="hover:bg-omni-background-grey">
              <TableCell>
                <div className="flex items-center">
                  <div className="size-12 flex-shrink-0 rounded-xl bg-gray-200"></div>
                  <div className="ml-4  cursor-default">
                    <div className="font-bold text-omni-pitch-black text-base">
                      {transaction.name}
                    </div>
                    <div className="text-omni-text-grey text-sm">
                      {transaction.type}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>{transaction.date}</div>
                <div className="text-gray-500 cursor-default">
                  {transaction.time}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-bold text-omni-pitch-black cursor-default">
                  {transaction.invoiceId}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-bold text-omni-pitch-black cursor-default">
                  {transaction.amount}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-lg cursor-default ${
                    transaction.status === "Success"
                      ? "bg-omni-green/10 text-omni-green"
                      : transaction.status === "Pending"
                      ? "bg-omni-blue/10 text-omni-blue"
                      : "bg-omni-red/10 text-omni-red"
                  }`}
                >
                  {transaction.status}
                </span>
              </TableCell>
              <TableCell>
                <Button className="border-2 hover:text-white hover:bg-omni-blue hover:border-omni-blue transition-colors ease-in-out">
                  Details
                </Button>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
