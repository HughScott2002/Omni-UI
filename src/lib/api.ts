/**
 * Unified API client for the Omni backend.
 *
 * All services are reached through the nginx gateway at API_BASE_URL
 * (path-routed: /api/users, /api/wallets, /api/transactions,
 * /api/notifications, /api/fraud-detection). Auth is cookie-based, so every
 * request is sent with credentials included.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost";

export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_API_WS_URL ??
  API_BASE_URL.replace(/^http/, "ws");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/**
 * Fetch a JSON endpoint on the gateway. Throws ApiError on non-2xx responses
 * and TypeError when the backend is unreachable — callers decide how to
 * degrade (the dashboard shows branded fallbacks instead of crashing).
 */
export async function apiFetch<T>(
  path: string,
  { body, headers, ...init }: ApiFetchOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      // Non-JSON error body — keep the status message.
    }
    throw new ApiError(message, response.status, path);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}
