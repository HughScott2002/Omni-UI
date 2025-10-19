export type TransactionStatus = "Approved" | "Fraud" | "Pending";

export interface FraudTransaction {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  timestamp: string;
  invoiceId: string;
  amount: number;
  amountFormatted: string;
  status: TransactionStatus;
  riskScore: number;
  merchantCategory: string;
  location?: string;
  cardLast4?: string;
}

export interface TransactionsResponse {
  transactions: FraudTransaction[];
  hasMore: boolean;
  lastUpdated: string;
}
