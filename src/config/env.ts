/**
 * Environment Configuration
 *
 * This module validates and exports all environment variables used in the application.
 * It ensures that required variables are present and provides type-safe access.
 */

// Validate environment variables at startup
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `Please add it to your .env.local file.`
    );
  }

  return value;
}

// API Configuration
export const API_CONFIG = {
  // Base URL for all API requests
  BASE_URL: getEnvVar("NEXT_PUBLIC_API_BASE_URL", "http://localhost"),

  // Notification service
  NOTIFICATION_API: getEnvVar(
    "NEXT_PUBLIC_NOTIFICATION_API",
    "http://localhost"
  ),
  NOTIFICATION_WS: getEnvVar("NEXT_PUBLIC_NOTIFICATION_WS", "ws://localhost"),

  // Timeouts (in milliseconds)
  REQUEST_TIMEOUT: parseInt(
    getEnvVar("NEXT_PUBLIC_REQUEST_TIMEOUT", "30000"),
    10
  ),

  // Retry configuration
  MAX_RETRIES: parseInt(getEnvVar("NEXT_PUBLIC_MAX_RETRIES", "3"), 10),
  RETRY_DELAY: parseInt(getEnvVar("NEXT_PUBLIC_RETRY_DELAY", "1000"), 10),
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    CHECK_SESSION: `${API_CONFIG.BASE_URL}/api/users/auth/check-session`,
    REFRESH: `${API_CONFIG.BASE_URL}/api/users/auth/refresh`,
    LOGIN: `${API_CONFIG.BASE_URL}/api/users/auth/account/login`,
    LOGOUT: `${API_CONFIG.BASE_URL}/api/users/auth/account/logout`,
    REGISTER: `${API_CONFIG.BASE_URL}/api/users/auth/account/register`,
    DUMP: `${API_CONFIG.BASE_URL}/api/users/dump`,
  },

  // Wallet endpoints
  WALLETS: {
    GET: (walletId: string) => `${API_CONFIG.BASE_URL}/api/wallets/${walletId}`,
    LIST: (accountId: string) =>
      `${API_CONFIG.BASE_URL}/api/wallets/list/${accountId}`,
    BASE: `${API_CONFIG.BASE_URL}/api/wallets`,
  },

  // Virtual Card endpoints
  CARDS: {
    BASE: `${API_CONFIG.BASE_URL}/api/wallets/cards`,
    GET: (cardId: string) =>
      `${API_CONFIG.BASE_URL}/api/wallets/cards/${cardId}`,
    BY_ACCOUNT: (accountId: string) =>
      `${API_CONFIG.BASE_URL}/api/wallets/cards/account/${accountId}`,
    BLOCK: (cardId: string) =>
      `${API_CONFIG.BASE_URL}/api/wallets/cards/${cardId}/block`,
    TOPUP: (cardId: string) =>
      `${API_CONFIG.BASE_URL}/api/wallets/cards/${cardId}/topup`,
    REQUEST_PHYSICAL: (cardId: string) =>
      `${API_CONFIG.BASE_URL}/api/wallets/cards/${cardId}/request-physical`,
  },

  // Contact endpoints
  CONTACTS: {
    BASE: `${API_CONFIG.BASE_URL}/api/users/auth/contacts`,
    SEARCH: `${API_CONFIG.BASE_URL}/api/users/auth/contacts/search`,
  },
} as const;

// Feature Flags (for gradual rollout)
export const FEATURES = {
  ENABLE_VIRTUAL_CARDS:
    process.env.NEXT_PUBLIC_ENABLE_VIRTUAL_CARDS !== "false",
  ENABLE_NOTIFICATIONS:
    process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== "false",
  ENABLE_FRAUD_DETECTION:
    process.env.NEXT_PUBLIC_ENABLE_FRAUD_DETECTION !== "false",
} as const;

// Development mode check
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Validate all required environment variables on module load
export function validateEnvironment() {
  try {
    // This will throw if any required vars are missing
    const _validation = {
      baseUrl: API_CONFIG.BASE_URL,
      notificationApi: API_CONFIG.NOTIFICATION_API,
      notificationWs: API_CONFIG.NOTIFICATION_WS,
    };

    if (IS_PRODUCTION) {
      // Additional production-only checks
      if (API_CONFIG.BASE_URL.includes("localhost")) {
        console.warn("⚠️  WARNING: Using localhost URL in production mode!");
      }
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Environment validation failed:", error.message);
    }
    throw error;
  }
}

// Auto-validate on import (only in browser/client-side)
if (typeof window !== "undefined") {
  validateEnvironment();
}
