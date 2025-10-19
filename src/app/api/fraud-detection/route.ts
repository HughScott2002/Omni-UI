import { NextResponse } from "next/server";
import { FraudDetectionResponse } from "@/types/fraud-detection";

// Simulate a real-time data store
let metrics = {
  totalTransactions: 12547,
  fraudBlocked: 273,
  moneySaved: 8945.0,
  protectionRate: 97.8,
};

let transactionRate = 42;

// Simulate real-time changes to the data
function updateMetrics() {
  // Randomly update total transactions (usually increases)
  const transactionChange = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : -Math.floor(Math.random() * 2);
  metrics.totalTransactions += transactionChange;

  // Randomly update fraud blocked (occasionally increases)
  if (Math.random() > 0.7) {
    const fraudChange = Math.floor(Math.random() * 3);
    metrics.fraudBlocked += fraudChange;
    // Money saved increases when fraud is blocked (average $500-$2000 per fraud)
    metrics.moneySaved += fraudChange * (500 + Math.random() * 1500);
  }

  // Recalculate protection rate
  const totalAttempts = metrics.totalTransactions + metrics.fraudBlocked;
  metrics.protectionRate = Number(((metrics.totalTransactions / totalAttempts) * 100).toFixed(1));

  // Update transaction rate (transactions per minute)
  transactionRate = Math.max(20, Math.min(80, transactionRate + (Math.random() - 0.5) * 10));
}

export async function GET() {
  // Update metrics to simulate real-time changes
  updateMetrics();

  const previousRate = transactionRate;
  const currentRate = Math.max(20, Math.min(80, transactionRate + (Math.random() - 0.5) * 10));
  const change = Number(((currentRate - previousRate) / previousRate * 100).toFixed(1));

  let trend: "up" | "down" | "stable" = "stable";
  if (change > 2) trend = "up";
  else if (change < -2) trend = "down";

  // Generate transaction rate history for the chart (last 10 data points)
  const transactionRateHistory = Array.from({ length: 10 }, (_, i) => {
    const timestamp = new Date(Date.now() - (9 - i) * 10000).toISOString(); // 10-second intervals
    const rate = Math.max(20, Math.min(80, currentRate + (Math.random() - 0.5) * 15));
    return { timestamp, rate: Number(rate.toFixed(1)) };
  });

  const response: FraudDetectionResponse = {
    metrics: {
      totalTransactions: metrics.totalTransactions,
      fraudBlocked: metrics.fraudBlocked,
      moneySaved: Number(metrics.moneySaved.toFixed(2)),
      protectionRate: metrics.protectionRate,
      transactionRate: {
        current: Number(currentRate.toFixed(1)),
        trend,
        change,
      },
    },
    transactionRateHistory,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
