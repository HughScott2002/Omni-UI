"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  MoreVertical,
  UserPlus,
  UserCheck,
  UserX,
  Ban,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  getContacts,
  getPendingRequests,
  getSentRequests,
  acceptContactRequest,
  rejectContactRequest,
  blockContact,
  deleteContact,
} from "@/lib/contacts";
import { Contact, ContactRequest } from "@/types/contact";

// Define the table header data for contacts
const contactTableHeaders: { label: string; icon: any }[] = [
  { label: "Name/OmniTag", icon: ArrowUpDown },
  { label: "Added On", icon: ChevronDown },
  { label: "Last Activity", icon: ChevronDown },
  { label: "Actions", icon: ChevronDown },
];

// Define the table header data for requests
const requestTableHeaders: { label: string; icon: any }[] = [
  { label: "Name/OmniTag", icon: ArrowUpDown },
  { label: "Requested On", icon: ChevronDown },
  { label: "Actions", icon: ChevronDown },
];

type TableHeaderMakerProps = {
  label: string;
  icon: any;
};

const TableHeaderMaker = ({ label, icon: Icon }: TableHeaderMakerProps) => {
  return (
    <div className="py-2 flex items-center gap-2">
      <span className="text-sm font-bold text-omni-pitch-black">{label}</span>
      <Icon className="size-5 text-omni-pitch-black cursor-pointer" />
    </div>
  );
};

interface OmniContactTableProps {
  accountId: string;
  onRefresh?: () => void;
}

export function OmniContactTable({
  accountId,
  onRefresh,
}: OmniContactTableProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ContactRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("contacts");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contactsData, pendingData, sentData] = await Promise.all([
        getContacts(accountId),
        getPendingRequests(accountId),
        getSentRequests(accountId),
      ]);

      // Debug logging
      console.log("Contacts data:", contactsData);
      console.log("Pending data:", pendingData);
      console.log("Sent data:", sentData);

      setContacts(contactsData.contacts || []);
      setPendingRequests(pendingData.requests || []);
      setSentRequests(sentData.requests || []);
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchData();
    }
  }, [accountId]);

  useEffect(() => {
    if (onRefresh) {
      fetchData();
    }
  }, [onRefresh]);

  const handleAcceptRequest = async (contactId: string) => {
    if (!contactId) {
      console.error("Cannot accept request: contactId is undefined");
      alert(
        "Error: Contact ID is missing. Please refresh the page and try again."
      );
      return;
    }

    console.log("Accepting contact request with ID:", contactId);

    try {
      await acceptContactRequest(contactId);
      await fetchData();
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept contact request. Please try again.");
    }
  };

  const handleRejectRequest = async (contactId: string) => {
    if (!contactId) {
      console.error("Cannot reject request: contactId is undefined");
      alert(
        "Error: Contact ID is missing. Please refresh the page and try again."
      );
      return;
    }

    console.log("Rejecting contact request with ID:", contactId);

    try {
      await rejectContactRequest(contactId);
      await fetchData();
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject contact request. Please try again.");
    }
  };

  const handleBlockContact = async (contactId: string) => {
    try {
      await blockContact(contactId);
      await fetchData();
    } catch (error) {
      console.error("Error blocking contact:", error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      await fetchData();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .toUpperCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-omni-text-grey">Loading contacts...</p>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
        <TabsTrigger value="pending">
          Pending ({pendingRequests.length})
        </TabsTrigger>
        <TabsTrigger value="sent">Sent ({sentRequests.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="contacts">
        <div className="rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                {contactTableHeaders.map((header, index) => (
                  <TableHeader key={index}>
                    <TableHeaderMaker label={header.label} icon={header.icon} />
                  </TableHeader>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-omni-background-grey">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <p className="text-omni-text-grey">
                      No contacts yet. Add your first contact!
                    </p>
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact.contactId}
                    className="hover:bg-omni-background-grey"
                  >
                    <TableCell>
                      <div className="flex items-center cursor-default">
                        <div className="size-12 flex-shrink-0 rounded-full bg-omni-blue flex items-center justify-center text-white font-bold">
                          {contact.omniTag
                            ? contact.omniTag.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <div className="ml-4">
                          <div className="font-bold text-omni-pitch-black text-base">
                            {contact.firstName && contact.lastName
                              ? `${contact.firstName} ${contact.lastName}`
                              : contact.omniTag || "Unknown"}
                          </div>
                          {contact.firstName &&
                            contact.lastName &&
                            contact.omniTag && (
                              <div className="text-omni-text-grey text-sm">
                                {contact.omniTag}
                              </div>
                            )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="cursor-default">
                        <div className="text-omni-pitch-black">
                          {formatDate(contact.addedAt)}
                        </div>
                        <div className="text-omni-text-grey">
                          {formatTime(contact.addedAt)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-omni-text-grey cursor-default">
                        {contact.lastActivity
                          ? formatDate(contact.lastActivity)
                          : "No recent activity"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleBlockContact(contact.contactId)
                            }
                            className="text-orange-600"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Block
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteContact(contact.contactId)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="pending">
        <div className="rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                {requestTableHeaders.map((header, index) => (
                  <TableHeader key={index}>
                    <TableHeaderMaker label={header.label} icon={header.icon} />
                  </TableHeader>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-omni-background-grey">
              {pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <p className="text-omni-text-grey">No pending requests</p>
                  </td>
                </tr>
              ) : (
                pendingRequests.map((request) => (
                  <tr
                    key={request.contactId}
                    className="hover:bg-omni-background-grey"
                  >
                    <TableCell>
                      <div className="flex items-center cursor-default">
                        <div className="size-12 flex-shrink-0 rounded-full bg-omni-blue flex items-center justify-center text-white font-bold">
                          {request.omniTag
                            ? request.omniTag.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <div className="ml-4">
                          <div className="font-bold text-omni-pitch-black text-base">
                            {request.firstName && request.lastName
                              ? `${request.firstName} ${request.lastName}`
                              : request.omniTag || "Unknown"}
                          </div>
                          {request.firstName &&
                            request.lastName &&
                            request.omniTag && (
                              <div className="text-omni-text-grey text-sm">
                                {request.omniTag}
                              </div>
                            )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="cursor-default">
                        <div className="text-omni-pitch-black">
                          {formatDate(request.requestedAt)}
                        </div>
                        <div className="text-omni-text-grey">
                          {formatTime(request.requestedAt)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            console.log(
                              "Accept button clicked, request data:",
                              request
                            );
                            handleAcceptRequest(request.contactId);
                          }}
                          className="bg-omni-blue text-white hover:bg-omni-blue/90"
                          disabled={!request.contactId}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => {
                            console.log(
                              "Reject button clicked, request data:",
                              request
                            );
                            handleRejectRequest(request.contactId);
                          }}
                          variant="outline"
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                          disabled={!request.contactId}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="sent">
        <div className="rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                {requestTableHeaders.map((header, index) => (
                  <TableHeader key={index}>
                    <TableHeaderMaker label={header.label} icon={header.icon} />
                  </TableHeader>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-omni-background-grey">
              {sentRequests.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <p className="text-omni-text-grey">No sent requests</p>
                  </td>
                </tr>
              ) : (
                sentRequests.map((request) => (
                  <tr
                    key={request.contactId}
                    className="hover:bg-omni-background-grey"
                  >
                    <TableCell>
                      <div className="flex items-center cursor-default">
                        <div className="size-12 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                          {request.omniTag
                            ? request.omniTag.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <div className="ml-4">
                          <div className="font-bold text-omni-pitch-black text-base">
                            {request.firstName && request.lastName
                              ? `${request.firstName} ${request.lastName}`
                              : request.omniTag || "Unknown"}
                          </div>
                          {request.firstName &&
                            request.lastName &&
                            request.omniTag && (
                              <div className="text-omni-text-grey text-sm">
                                {request.omniTag}
                              </div>
                            )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="cursor-default">
                        <div className="text-omni-pitch-black">
                          {formatDate(request.requestedAt)}
                        </div>
                        <div className="text-omni-text-grey">
                          {formatTime(request.requestedAt)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-omni-text-grey italic">
                        Pending response
                      </span>
                    </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 whitespace-nowrap">{children}</td>;
}
