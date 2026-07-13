import { apiFetch } from "@/lib/api";

export async function getListWallets(
  userId: string | undefined
): Promise<OmniWalletData[]> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return await apiFetch<OmniWalletData[]>(`/api/wallets/list/${userId}`);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return [];
  }
}

export async function getWallet(
  walletId: string
): Promise<OmniWalletData | null> {
  try {
    return await apiFetch<OmniWalletData>(`/api/wallets/${walletId}`);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return null;
  }
}

export async function getWallets(
  userId: string | undefined
): Promise<OmniWalletData[]> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return await apiFetch<OmniWalletData[]>(`/api/wallets/${userId}`);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return [];
  }
}
