import { apiFetch } from "@/lib/api";

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
  return apiFetch<TransferResponse>("/api/transactions/transfer", {
    method: "POST",
    body: {
      ...data,
      idempotencyKey:
        data.idempotencyKey || `transfer-${Date.now()}-${Math.random()}`,
    },
  });
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

  return apiFetch<Transaction[]>(
    `/api/transactions/account/${accountId}?${queryParams}`
  );
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

  return apiFetch<Transaction[]>(
    `/api/transactions/wallet/${walletId}?${queryParams}`
  );
}

export async function getTransaction(transactionId: string): Promise<Transaction> {
  return apiFetch<Transaction>(`/api/transactions/${transactionId}`);
}
