import {
  VirtualCard,
  CreateVirtualCardInput,
  CreateVirtualCardResponse,
  UpdateVirtualCardInput,
  BlockVirtualCardInput,
  TopUpVirtualCardInput,
  TopUpVirtualCardResponse,
  RequestPhysicalCardInput,
  GetVirtualCardsResponse,
} from "@/types/virtualCard";

const API_BASE_URL = "http://localhost/api/wallets/cards";

/**
 * Create a new virtual card
 */
export async function createVirtualCard(
  input: CreateVirtualCardInput
): Promise<CreateVirtualCardResponse> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Get a virtual card by ID
 */
export async function getVirtualCard(cardId: string): Promise<VirtualCard> {
  const response = await fetch(`${API_BASE_URL}/${cardId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Get all virtual cards for an account
 */
export async function getVirtualCardsByAccount(
  accountId: string
): Promise<GetVirtualCardsResponse> {
  const response = await fetch(`${API_BASE_URL}/account/${accountId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Get the default virtual card for an account
 * Returns the first active card or null if none found
 */
export async function getDefaultVirtualCard(
  accountId: string
): Promise<VirtualCard | null> {
  try {
    const response = await getVirtualCardsByAccount(accountId);

    // Find the first active card
    const defaultCard = response.cards.find(
      (card) => card.isActive && card.cardStatus === "active"
    );

    return (
      defaultCard || (response.cards.length > 0 ? response.cards[0] : null)
    );
  } catch (error) {
    console.error("Error fetching default virtual card:", error);
    return null;
  }
}

/**
 * Update a virtual card
 */
export async function updateVirtualCard(
  cardId: string,
  input: UpdateVirtualCardInput
): Promise<{ message: string; card: VirtualCard }> {
  const response = await fetch(`${API_BASE_URL}/${cardId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Delete a virtual card
 */
export async function deleteVirtualCard(
  cardId: string
): Promise<{ message: string; deletedAt: string }> {
  const response = await fetch(`${API_BASE_URL}/${cardId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Block a virtual card
 */
export async function blockVirtualCard(
  cardId: string,
  input: BlockVirtualCardInput
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/${cardId}/block`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Top up a virtual card
 */
export async function topUpVirtualCard(
  cardId: string,
  input: TopUpVirtualCardInput
): Promise<TopUpVirtualCardResponse> {
  const response = await fetch(`${API_BASE_URL}/${cardId}/topup`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Request a physical card
 */
export async function requestPhysicalCard(
  cardId: string,
  input: RequestPhysicalCardInput
): Promise<{ message: string; status: string }> {
  const response = await fetch(`${API_BASE_URL}/${cardId}/request-physical`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
