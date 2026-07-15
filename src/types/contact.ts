// Contact types — these mirror the users service wire format
// (Omni-Server/1-users/src/models/contact.go). Keep them in sync.

export type ContactStatus = "pending" | "accepted" | "rejected" | "blocked";

// ContactInfo in Go: what GET /contacts/{accountid} returns per contact.
// Note: the contact relationship ID is NOT exposed here; only the peer's
// account details are. firstName/lastName/email appear after acceptance.
export interface Contact {
  accountId: string;
  omniTag: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status: ContactStatus;
  addedAt: string;
  isAccepted: boolean;
}

// UserBasic in Go: only omniTag is populated before acceptance.
export interface ContactPeer {
  accountId: string;
  omniTag: string;
  firstName?: string;
  lastName?: string;
}

// ContactRequest in Go: what the pending/sent endpoints return.
// The peer's details are nested under fromUser (who sent it) and
// toUser (who received it), not flattened onto the request.
export interface ContactRequest {
  contactId: string;
  fromUser: ContactPeer;
  toUser: ContactPeer;
  status: "pending" | "accepted" | "rejected";
  requestedAt: string;
}

export interface ContactsResponse {
  contacts: Contact[] | null;
  count: number;
}

export interface ContactRequestsResponse {
  requests: ContactRequest[] | null;
  count: number;
}

export interface SendContactRequestPayload {
  omniTag: string;
}

export interface SendContactRequestResponse {
  message: string;
  contactId: string;
  omniTag: string;
}

export interface ContactActionResponse {
  message: string;
}
