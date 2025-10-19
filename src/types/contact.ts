// Contact Types

export interface Contact {
  contactId: string;
  omniTag: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  addedAt: string;
  lastActivity?: string;
}

export interface ContactRequest {
  contactId: string;
  omniTag: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  requestedAt: string;
  status: 'pending' | 'sent';
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
