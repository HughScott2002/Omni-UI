import { NextResponse } from "next/server";
import { FraudTransaction, TransactionStatus } from "@/types/transaction";

// This simulates a historical database of transactions
// In production, this would query your actual database
const historicalTransactions: FraudTransaction[] = [];

// Initialize historical data on first load
function initializeHistoricalData() {
  if (historicalTransactions.length === 0) {
    const merchants = [
      "Amazon",
      "Walmart",
      "Target",
      "Starbucks",
      "McDonald's",
      "Apple Store",
      "Best Buy",
      "Costco",
      "Netflix",
      "Spotify",
      "Uber",
      "Airbnb",
      "Gas Station",
      "Grocery Store",
      "Restaurant",
      "Coffee Shop",
      "Gym Membership",
      "Online Store",
      "Hotel Booking",
      "Airlines",
    ];

    const merchantCategories = [
      "Retail",
      "Food & Dining",
      "Entertainment",
      "Transportation",
      "Travel",
      "Subscription",
      "Groceries",
      "Shopping",
      "Services",
    ];

    const locations = [
      "New York, NY",
      "Los Angeles, CA",
      "Chicago, IL",
      "Houston, TX",
      "Phoenix, AZ",
      "Philadelphia, PA",
      "San Antonio, TX",
      "San Diego, CA",
      "Dallas, TX",
      "San Jose, CA",
    ];

    // Generate 200 historical transactions
    const now = Date.now();
    for (let i = 0; i < 200; i++) {
      const timestamp = now - i * 3600000; // 1 hour apart
      const date = new Date(timestamp);
      const amount = Math.random() * 2000 + 10;
      const isFraud = Math.random() > 0.85;
      const isPending = Math.random() > 0.9;

      let status: TransactionStatus;
      let riskScore: number;

      if (isPending && !isFraud) {
        status = "Pending";
        riskScore = Math.random() * 40 + 30;
      } else if (isFraud) {
        status = "Fraud";
        riskScore = Math.random() * 30 + 70;
      } else {
        status = "Approved";
        riskScore = Math.random() * 30;
      }

      const merchant = merchants[Math.floor(Math.random() * merchants.length)];
      const category = merchantCategories[Math.floor(Math.random() * merchantCategories.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      historicalTransactions.push({
        id: `TXN${1000 + i}`,
        name: merchant,
        type: category,
        date: date
          .toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
          .toUpperCase(),
        time: date
          .toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .toUpperCase(),
        timestamp: date.toISOString(),
        invoiceId: `INV${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        amount,
        amountFormatted: `${Math.random() > 0.5 ? "+" : "-"}$${amount.toFixed(2)}`,
        status,
        riskScore: Number(riskScore.toFixed(1)),
        merchantCategory: category,
        location,
        cardLast4: Math.floor(1000 + Math.random() * 9000).toString(),
      });
    }
  }
}

export async function GET(request: Request) {
  initializeHistoricalData();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const statusFilter = searchParams.get("status");

  let results = historicalTransactions;

  // Apply search filter
  if (query) {
    results = results.filter((txn) => {
      return (
        txn.name.toLowerCase().includes(query) ||
        txn.invoiceId.toLowerCase().includes(query) ||
        txn.type.toLowerCase().includes(query) ||
        txn.amountFormatted.includes(query) ||
        txn.location?.toLowerCase().includes(query) ||
        txn.cardLast4?.includes(query)
      );
    });
  }

  // Apply status filter if provided
  if (statusFilter) {
    const statuses = statusFilter.split(",") as TransactionStatus[];
    results = results.filter((txn) => statuses.includes(txn.status));
  }

  // Sort by timestamp descending (newest first)
  results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Limit to first 100 results
  results = results.slice(0, 100);

  return NextResponse.json({
    transactions: results,
    total: results.length,
    query,
  });
}
