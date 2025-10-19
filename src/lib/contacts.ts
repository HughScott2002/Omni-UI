import {
  Contact,
  ContactRequest,
  ContactsResponse,
  ContactRequestsResponse,
  SendContactRequestPayload,
  SendContactRequestResponse,
  ContactActionResponse,
} from "@/types/contact";

const BASE_URL = "http://localhost/api/users/auth";

// Send a contact request by OmniTag
export async function sendContactRequest(
  omniTag: string
): Promise<SendContactRequestResponse> {
  try {
    const response = await fetch(`${BASE_URL}/contacts/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ omniTag }),
    });

    if (!response.ok) {
      // Try to parse error message from response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const error = await response.json();
          throw new Error(
            error.message ||
              error.detail ||
              `HTTP error! status: ${response.status}`
          );
        } catch (jsonError) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const textError = await response.text();
        throw new Error(textError || `HTTP error! status: ${response.status}`);
      }
    }

    // Check if response has content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const text = await response.text();
      if (!text || text.trim() === "") {
        // Empty response - return a default success response
        return {
          message: "Contact request sent successfully",
          contactId: "",
          omniTag: omniTag,
        };
      }
      return JSON.parse(text);
    } else {
      // Non-JSON response - return default success
      return {
        message: "Contact request sent successfully",
        contactId: "",
        omniTag: omniTag,
      };
    }
  } catch (error: any) {
    console.error("Error sending contact request:", error);
    throw new Error(error.message || "Failed to send contact request");
  }
}

// Get all accepted contacts for a user
export async function getContacts(
  accountId: string
): Promise<ContactsResponse> {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${accountId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      contacts: data.contacts || [],
      count: data.count || 0,
    };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return { contacts: [], count: 0 };
  }
}

// Get pending contact requests (received)
export async function getPendingRequests(
  accountId: string
): Promise<ContactRequestsResponse> {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${accountId}/pending`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      requests: data.requests || [],
      count: data.count || 0,
    };
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return { requests: [], count: 0 };
  }
}

// Get sent contact requests
export async function getSentRequests(
  accountId: string
): Promise<ContactRequestsResponse> {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${accountId}/sent`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      requests: data.requests || [],
      count: data.count || 0,
    };
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    return { requests: [], count: 0 };
  }
}

// Accept a contact request
export async function acceptContactRequest(
  contactId: string
): Promise<ContactActionResponse> {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}/accept`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error accepting contact request:", error);
    throw error;
  }
}

// Reject a contact request
export async function rejectContactRequest(
  contactId: string
): Promise<ContactActionResponse> {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}/reject`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error rejecting contact request:", error);
    throw error;
  }
}

// Block a contact
export async function blockContact(
  contactId: string
): Promise<ContactActionResponse> {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}/block`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error blocking contact:", error);
    throw error;
  }
}

// Delete a contact
export async function deleteContact(
  contactId: string
): Promise<ContactActionResponse> {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
}
