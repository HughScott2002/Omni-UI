import { API_BASE_URL } from "@/constants";

export interface TransferRequest {
  senderWalletId: string;
  receiverOmniTag: string;
  amount: number;
  description?: string;
  idempotencyKey?: string;
}

export interface Transaction {
  id: string;
  reference: string;
  senderAccountId?: string;
  receiverAccountId?: string;
  senderWalletId?: string;
  receiverWalletId?: string;
  cardId?: string;
  amount: number;
  currency: string;
  transactionType: string;
  transactionCategory: string;
  status: string;
  description?: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: Record<string, any>;
  createdAt: string;
  completedAt?: string;
  updatedAt?: string;
}

export interface TransferResponse {
  status: string;
  message: string;
  transactionId: string;
  reference: string;
  senderBalance: number;
  receiverBalance: number;
  transaction: Transaction;
}

export async function transferMoney(data: TransferRequest): Promise<TransferResponse> {
  const response = await fetch(`${API_BASE_URL}/api/transactions/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      idempotencyKey: data.idempotencyKey || `transfer-${Date.now()}-${Math.random()}`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Transfer failed");
  }

  return response.json();
}

export async function getAccountTransactions(
  accountId: string,
  params?: {
    limit?: number;
    offset?: number;
    type?: string;
    category?: string;
    status?: string;
  }
): Promise<Transaction[]> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.offset) queryParams.append("offset", params.offset.toString());
  if (params?.type) queryParams.append("type", params.type);
  if (params?.category) queryParams.append("category", params.category);
  if (params?.status) queryParams.append("status", params.status);

  const response = await fetch(
    `${API_BASE_URL}/api/transactions/account/${accountId}?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}

export async function getWalletTransactions(
  walletId: string,
  params?: {
    limit?: number;
    offset?: number;
    type?: string;
    category?: string;
    status?: string;
  }
): Promise<Transaction[]> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.offset) queryParams.append("offset", params.offset.toString());
  if (params?.type) queryParams.append("type", params.type);
  if (params?.category) queryParams.append("category", params.category);
  if (params?.status) queryParams.append("status", params.status);

  const response = await fetch(
    `${API_BASE_URL}/api/transactions/wallet/${walletId}?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}

export async function getTransaction(transactionId: string): Promise<Transaction> {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/${transactionId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transaction");
  }

  return response.json();
}
