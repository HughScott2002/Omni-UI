import { apiFetch } from "@/lib/api";

/**
 * Account settings API: profile, verification (KYC), sessions, activity and
 * password — all backed by the user-service through the gateway.
 */

export interface UserProfile {
  accountId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  currency: string;
  postalCode: string;
  dob: string;
  govId: string;
  kycStatus: "pending" | "approved" | "rejected";
  omniTag: string;
  dataAuthorization: boolean;
}

export type ProfileUpdate = Pick<
  UserProfile,
  | "firstName"
  | "lastName"
  | "phone"
  | "address"
  | "city"
  | "state"
  | "country"
  | "currency"
  | "postalCode"
  | "dob"
  | "govId"
>;

export interface SessionInfo {
  id: string;
  browser: string;
  country: string;
  lastLoginAt: string;
  ipAddress: string;
  deviceInfo: string;
  isCurrentDevice: boolean;
}

export interface AccountActivityEvent {
  event: string;
  icon: string;
  source: string;
  ipAddress: string;
  country: string;
  dateTime: string;
  isError?: boolean;
}

export function getProfile(accountId: string): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/api/users/auth/account/${accountId}`);
}

export function updateProfile(
  accountId: string,
  fields: ProfileUpdate
): Promise<{ message: string; user: Partial<UserProfile> }> {
  return apiFetch(`/api/users/auth/account/${accountId}`, {
    method: "PUT",
    body: fields,
  });
}

/** Submit identity verification: registration info + signed consent. */
export function submitKycConsent(
  accountId: string
): Promise<{ message: string; accountId: string; kycStatus: string }> {
  return apiFetch(`/api/users/auth/kyc/${accountId}/submit`, {
    method: "POST",
    body: { consent: true },
  });
}

export async function listSessions(email: string): Promise<SessionInfo[]> {
  const data = await apiFetch<{ activeSessions: SessionInfo[] }>(
    "/api/users/auth/security/sessions",
    { method: "POST", body: { email } }
  );
  return data.activeSessions ?? [];
}

export function logoutOtherSessions(): Promise<{ message: string }> {
  return apiFetch("/api/users/auth/security/sessions/logout-others", {
    method: "POST",
  });
}

export function logoutSession(sessionId: string): Promise<{ message: string }> {
  return apiFetch(`/api/users/auth/security/sessions/logout/${sessionId}`, {
    method: "POST",
  });
}

export async function getAccountActivity(
  email: string
): Promise<AccountActivityEvent[]> {
  const data = await apiFetch<{ activity: AccountActivityEvent[] }>(
    "/api/users/auth/security/activity",
    { method: "POST", body: { email } }
  );
  return data.activity ?? [];
}

export function changePassword(params: {
  accountId: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): Promise<{ message: string }> {
  // The backend uses hyphenated JSON keys for this endpoint.
  return apiFetch("/api/users/auth/account/change-password", {
    method: "POST",
    body: {
      "account-id": params.accountId,
      email: params.email,
      "current-password": params.currentPassword,
      "new-password": params.newPassword,
      "confirm-new-password": params.confirmNewPassword,
    },
  });
}
