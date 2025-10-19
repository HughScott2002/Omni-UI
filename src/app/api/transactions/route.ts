import { NextResponse } from "next/server";
import { FraudTransaction, TransactionsResponse } from "@/types/transaction";

// Dummy merchant names for generating realistic transactions
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

// Store transactions in memory (simulates a database)
let transactionStore: FraudTransaction[] = [];
let transactionCounter = 1000;

// Initialize with some transactions
function initializeTransactions() {
  if (transactionStore.length === 0) {
    const now = Date.now();
    for (let i = 0; i < 15; i++) {
      transactionStore.push(generateTransaction(now - (15 - i) * 5000));
    }
  }
}

// Generate a random transaction
function generateTransaction(timestamp?: number): FraudTransaction {
  const now = timestamp || Date.now();
  const date = new Date(now);
  const amount = Math.random() * 2000 + 10;
  const isFraud = Math.random() > 0.85; // 15% chance of fraud
  const isPending = Math.random() > 0.9; // 10% chance of pending

  let status: "Approved" | "Fraud" | "Pending";
  let riskScore: number;

  if (isPending && !isFraud) {
    status = "Pending";
    riskScore = Math.random() * 40 + 30; // 30-70 risk score
  } else if (isFraud) {
    status = "Fraud";
    riskScore = Math.random() * 30 + 70; // 70-100 risk score
  } else {
    status = "Approved";
    riskScore = Math.random() * 30; // 0-30 risk score
  }

  const merchant = merchants[Math.floor(Math.random() * merchants.length)];
  const category =
    merchantCategories[Math.floor(Math.random() * merchantCategories.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];

  transactionCounter++;

  return {
    id: `TXN${transactionCounter}`,
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
    invoiceId: `INV${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    amount,
    amountFormatted: `${Math.random() > 0.5 ? "+" : "-"}$${amount.toFixed(2)}`,
    status,
    riskScore: Number(riskScore.toFixed(1)),
    merchantCategory: category,
    location,
    cardLast4: Math.floor(1000 + Math.random() * 9000).toString(),
  };
}

// Add new transaction to the store periodically
function maybeAddNewTransaction() {
  // 70% chance to add a new transaction on each call
  if (Math.random() > 0.83) {
    const newTransaction = generateTransaction();
    transactionStore.unshift(newTransaction); // Add to the beginning

    // Keep only the last 50 transactions
    if (transactionStore.length > 50) {
      transactionStore = transactionStore.slice(0, 50);
    }

    return newTransaction;
  }
  return null;
}

export async function GET(request: Request) {
  initializeTransactions();

  const { searchParams } = new URL(request.url);
  const pollParam = searchParams.get("poll");
  const isPoll = pollParam === "true";

  if (isPoll) {
    // When polling, maybe return a new transaction
    const newTransaction = maybeAddNewTransaction();

    if (newTransaction) {
      const response: TransactionsResponse = {
        transactions: [newTransaction],
        hasMore: false,
        lastUpdated: new Date().toISOString(),
      };
      return NextResponse.json(response);
    } else {
      // No new transactions
      const response: TransactionsResponse = {
        transactions: [],
        hasMore: false,
        lastUpdated: new Date().toISOString(),
      };
      return NextResponse.json(response);
    }
  }

  // Initial load - return all transactions
  const response: TransactionsResponse = {
    transactions: transactionStore,
    hasMore: false,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
