export interface FraudDetectionMetrics {
  totalTransactions: number;
  fraudBlocked: number;
  moneySaved: number;
  protectionRate: number;
  transactionRate: {
    current: number;
    trend: "up" | "down" | "stable";
    change: number;
  };
}

export interface TransactionRateDataPoint {
  timestamp: string;
  rate: number;
}

export interface FraudDetectionResponse {
  metrics: FraudDetectionMetrics;
  transactionRateHistory: TransactionRateDataPoint[];
  lastUpdated: string;
}
