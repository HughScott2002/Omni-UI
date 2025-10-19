export type CardType = "debit" | "credit";
export type CardBrand = "visa" | "mastercard";
export type Currency = "USD" | "EUR" | "GBP" | "JMD";
export type CardStatus = "active" | "inactive" | "pending" | "blocked" | "expired";
export type BlockReason = "lost" | "stolen" | "suspicious_activity" | "customer_request";

export interface VirtualCard {
  id: string;
  walletId: string;
  cardType: CardType;
  cardBrand: CardBrand;
  currency: Currency;
  cardStatus: CardStatus;
  dailyLimit: number;
  monthlyLimit: number;
  nameOnCard: string;
  cardNumber: string; // Masked: **** **** **** 1234
  expiryDate: string;
  isActive: boolean;
  availableBalance: number;
  totalToppedUp: number;
  totalSpendToday: number;
  totalSpentThisMonth: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVirtualCardInput {
  walletId: string;
  cardType: CardType;
  cardBrand: CardBrand;
  currency: Currency;
  dailyLimit: number;
  monthlyLimit: number;
  nameOnCard: string;
}

export interface CreateVirtualCardResponse {
  message: string;
  card: VirtualCard;
  cvv: string; // Only returned on creation
  maskedCardNumber: string;
  lastFourDigits: string;
}

export interface UpdateVirtualCardInput {
  dailyLimit?: number;
  monthlyLimit?: number;
  isActive?: boolean;
}

export interface BlockVirtualCardInput {
  blockReason: BlockReason;
  blockReasonDescription: string;
}

export interface TopUpVirtualCardInput {
  accountNumber: string;
  amount: number;
  description: string;
}

export interface TopUpVirtualCardResponse {
  status: "success";
  message: string;
  data: {
    newBalance: number;
    amount: number;
  };
}

export interface RequestPhysicalCardInput {
  deliveryAddress: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface GetVirtualCardsResponse {
  cards: VirtualCard[];
  count: number;
}
