export async function getListWallets(
  userId: string | undefined
): Promise<OmniWalletData[]> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await fetch(
      `http://localhost/api/wallets/list/${userId}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return []; // Return empty array or handle error as needed
  }
}

export async function getWallets(
  userId: string | undefined
): Promise<OmniWalletData[]> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await fetch(`http://localhost/api/wallets/${userId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return []; // Return empty array or handle error as needed
  }
}
