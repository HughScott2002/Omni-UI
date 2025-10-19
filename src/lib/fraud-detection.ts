import { API_BASE_URL } from "@/constants";

export interface FraudMetrics {
  totalTransactions: number;
  fraudBlocked: number;
  moneySaved: number;
  protectionRate: number;
}

export interface FraudDetectionData {
  metrics: FraudMetrics;
  recentAlerts: Array<{
    id: string;
    type: string;
    severity: string;
    description: string;
    timestamp: string;
  }>;
}

export async function getFraudDetectionData(): Promise<FraudDetectionData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fraud-detection`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch fraud detection data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching fraud detection data:", error);
    // Return mock data as fallback
    return {
      metrics: {
        totalTransactions: 0,
        fraudBlocked: 0,
        moneySaved: 0,
        protectionRate: 0,
      },
      recentAlerts: [],
    };
  }
}
