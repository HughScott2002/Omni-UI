import * as SecureStore from "expo-secure-store";

const API_BASE = __DEV__
  ? "http://10.0.2.2:80" // Android emulator → host machine
  : "https://your-production-url.com";

// Use your local network IP when testing on a physical device.
// Override this in .env or change it here during development.
const API_URL = process.env.EXPO_PUBLIC_API_URL || API_BASE;

async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync("access_token");
}

async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync("refresh_token");
}

export async function storeTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  await SecureStore.setItemAsync("access_token", accessToken);
  await SecureStore.setItemAsync("refresh_token", refreshToken);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync("access_token");
  await SecureStore.deleteItemAsync("refresh_token");
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/api/users/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.tokens) {
      await storeTokens(data.tokens.accessToken, data.tokens.refreshToken);
      return data.tokens.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = await getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // If 401, try refreshing the token once
  if (res.status === 401 && accessToken) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${path}`, { ...options, headers });
    }
  }

  return res;
}

// Auth-specific API calls (no token needed for these)
export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/users/auth/account/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }

  const data = await res.json();
  await storeTokens(data.tokens.accessToken, data.tokens.refreshToken);
  return data;
}

export async function apiRegister(userData: Record<string, string>) {
  const res = await fetch(`${API_URL}/api/users/auth/account/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Registration failed");
  }

  const data = await res.json();
  await storeTokens(data.tokens.accessToken, data.tokens.refreshToken);
  return data;
}

export async function apiLogout(): Promise<void> {
  try {
    await apiFetch("/api/users/auth/account/logout", { method: "POST" });
  } finally {
    await clearTokens();
  }
}

export async function apiCheckSession() {
  const res = await apiFetch("/api/users/auth/check-session");
  if (!res.ok) return null;
  return res.json();
}
