"use client";

import OmniAccountAlerts from "@/components/OmniAccountAlerts";
import OmniTotalTransactionsGraph from "@/components/OmniTotalTransactionsGraph";
import OmniFraudBlockedGraph from "@/components/OmniFraudBlockedGraph";
import OmniMoneySavedGraph from "@/components/OmniMoneySavedGraph";
import OmniProtectionRateGraph from "@/components/OmniProtectionRateGraph";
import OmniRateOfTransactionsDiagram from "@/components/OmniRateOfTransactionsDiagram";
import OmniTopDashComponent from "@/components/OmniTopDashComponent";
import SearchInput from "@/components/SearchInput";
import { FraudTransactionsTable } from "@/components/OmniFraudTransactionsTable";
import { Button } from "@/components/ui/button";
import { Download, Settings2, ShieldCheck } from "lucide-react";
import { useFraudDetection } from "@/hooks/useFraudDetection";
import { useTransactions } from "@/hooks/useTransactions";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

const Fraud_Detection = () => {
  const { data, loading, error } = useFraudDetection(3000);
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    newTransactionIds,
  } = useTransactions(2000);

  if ((loading && !data) || transactionsLoading) {
    return (
      <section className="flex flex-col size-full items-center justify-center">
        <div className="text-lg font-semibold">
          Loading fraud detection data...
        </div>
      </section>
    );
  }

  if (error || transactionsError) {
    return (
      <section className="flex flex-col size-full items-center justify-center">
        <div className="text-lg font-semibold text-red-500">
          Error: {error || transactionsError}
        </div>
      </section>
    );
  }

  const dashboardItems = data
    ? [
        {
          chartContainer: <OmniTotalTransactionsGraph />,
          label: "Total Transactions",
          value: data.metrics.totalTransactions,
          animate: true,
        },
        {
          chartContainer: <OmniFraudBlockedGraph />,
          label: "Fraud Blocked",
          value: data.metrics.fraudBlocked,
          animate: true,
        },
        {
          chartContainer: <OmniMoneySavedGraph />,
          label: "Money Saved",
          value: data.metrics.moneySaved,
          animate: true,
          prefix: "$",
          decimals: 2,
        },
        {
          chartContainer: <OmniProtectionRateGraph />,
          label: "Protection Rate %",
          value: data.metrics.protectionRate,
          animate: true,
          suffix: "%",
          decimals: 1,
        },
      ]
    : [];

  return (
    <section className="flex flex-col size-full ">
      <div className="w-full  mx-auto flex flex-col p-2 gap-2">
        <OmniAccountAlerts />
        {/* Container to limit width and center */}
        <div className="grid grid-cols-[repeat(auto-fit,13rem)] gap-4 3xl:justify-center justify-center ">
          {dashboardItems.map((item, index) => (
            <OmniTopDashComponent
              ChartContainer={item.chartContainer}
              key={index}
              label={item.label}
              title={String(item.value)}
            />
          ))}
        </div>

        {data && (
          <OmniRateOfTransactionsDiagram
            data={data.transactionRateHistory}
            currentRate={data.metrics.transactionRate.current}
            trend={data.metrics.transactionRate.trend}
            change={data.metrics.transactionRate.change}
          />
        )}
        <div className="mt-6">
          <FraudTransactionsTable
            transactions={transactions}
            newTransactionIds={newTransactionIds}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 sm:p-4 rounded-3xl transition-all ease-in-out "></div>
      {/* <OmniTransactionsTable /> */}
    </section>
  );
};

export default Fraud_Detection;

{
  /* <div className="my-wallets w-full">

  <TransactionsTable
    transactions={[
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shadcn",
        paymentChannel: "Bank of America",
        type: "Transfer",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 1000,
        pending: false,
        category: "Transfer",
        date: "2021-09-01",
        image: "https://github.com/shadcn.png",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shopify",
        paymentChannel: "Chase Bank",
        type: "Subscription",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 2309.29,
        pending: false,
        category: "Subscription",
        date: "2021-09-01",
        image:
          "https://banner2.cleanpng.com/20180511/ajq/kisspng-shopify-computer-icons-e-commerce-sales-inventory-5af5e03f12ee59.7893920915260631670776.jpg",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shadcn",
        paymentChannel: "Bank of America",
        type: "Transfer",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 1000,
        pending: false,
        category: "Transfer",
        date: "2021-09-01",
        image: "https://github.com/shadcn.png",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shopify",
        paymentChannel: "Chase Bank",
        type: "Subscription",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 2309.29,
        pending: false,
        category: "Subscription",
        date: "2021-09-01",
        image:
          "https://banner2.cleanpng.com/20180511/ajq/kisspng-shopify-computer-icons-e-commerce-sales-inventory-5af5e03f12ee59.7893920915260631670776.jpg",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shadcn",
        paymentChannel: "Bank of America",
        type: "Transfer",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 1000,
        pending: false,
        category: "Transfer",
        date: "2021-09-01",
        image: "https://github.com/shadcn.png",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shopify",
        paymentChannel: "Chase Bank",
        type: "Subscription",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 2309.29,
        pending: false,
        category: "Subscription",
        date: "2021-09-01",
        image:
          "https://banner2.cleanpng.com/20180511/ajq/kisspng-shopify-computer-icons-e-commerce-sales-inventory-5af5e03f12ee59.7893920915260631670776.jpg",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shadcn",
        paymentChannel: "Bank of America",
        type: "Transfer",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 1000,
        pending: false,
        category: "Transfer",
        date: "2021-09-01",
        image: "https://github.com/shadcn.png",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shopify",
        paymentChannel: "Chase Bank",
        type: "Subscription",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 2309.29,
        pending: false,
        category: "Subscription",
        date: "2021-09-01",
        image:
          "https://banner2.cleanpng.com/20180511/ajq/kisspng-shopify-computer-icons-e-commerce-sales-inventory-5af5e03f12ee59.7893920915260631670776.jpg",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shadcn",
        paymentChannel: "Bank of America",
        type: "Transfer",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 1000,
        pending: false,
        category: "Transfer",
        date: "2021-09-01",
        image: "https://github.com/shadcn.png",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shopify",
        paymentChannel: "Chase Bank",
        type: "Subscription",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 2309.29,
        pending: false,
        category: "Subscription",
        date: "2021-09-01",
        image:
          "https://banner2.cleanpng.com/20180511/ajq/kisspng-shopify-computer-icons-e-commerce-sales-inventory-5af5e03f12ee59.7893920915260631670776.jpg",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shadcn",
        paymentChannel: "Bank of America",
        type: "Transfer",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 1000,
        pending: false,
        category: "Transfer",
        date: "2021-09-01",
        image: "https://github.com/shadcn.png",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shopify",
        paymentChannel: "Chase Bank",
        type: "Subscription",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 2309.29,
        pending: false,
        category: "Subscription",
        date: "2021-09-01",
        image:
          "https://banner2.cleanpng.com/20180511/ajq/kisspng-shopify-computer-icons-e-commerce-sales-inventory-5af5e03f12ee59.7893920915260631670776.jpg",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shadcn",
        paymentChannel: "Bank of America",
        type: "Transfer",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 1000,
        pending: false,
        category: "Transfer",
        date: "2021-09-01",
        image: "https://github.com/shadcn.png",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
      {
        id: "6627f07b00348f242ea9",
        $id: "6627f07b00348f242ea9",
        name: "Shopify",
        paymentChannel: "Chase Bank",
        type: "Subscription",
        accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
        amount: 2309.29,
        pending: false,
        category: "Subscription",
        date: "2021-09-01",
        image:
          "https://banner2.cleanpng.com/20180511/ajq/kisspng-shopify-computer-icons-e-commerce-sales-inventory-5af5e03f12ee59.7893920915260631670776.jpg",
        $createdAt: "2021-09-01",
        channel: "Bank of America",
        senderBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
        receiverBankId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
      },
    ]}
  />
</div> */
}
