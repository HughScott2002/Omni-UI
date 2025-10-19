"use client";

import { useState, useEffect, useCallback } from "react";
import { OmniContactTable } from "@/components/OmniContactTable";
import { AddContactDialog } from "@/components/AddContactDialog";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Plus, Settings2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";

const ContactsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth();
  const { notifications } = useNotifications(user?.id);

  const handleContactAdded = () => {
    // Trigger a refresh of the contact table
    setRefreshKey((prev) => prev + 1);
  };

  // Listen for contact-related notifications and refresh the table
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];

      // Check if the notification is contact-related
      if (latestNotification.category === "contact") {
        // Refresh the contact table when receiving contact notifications
        // Add a small delay to ensure backend has processed the change
        const refreshTimer = setTimeout(() => {
          setRefreshKey((prev) => prev + 1);
        }, 500);

        return () => clearTimeout(refreshTimer);
      }
    }
  }, [notifications]);

  if (!user) {
    return (
      <section className="flex flex-col w-full items-center justify-center h-64">
        <p className="text-omni-text-grey">Loading...</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col w-full">
      <header className="w-full h-10 grid grid-cols-2 mb-6">
        <div className="w-full">
          <SearchInput type={"desktop"} />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            className="bg-omni-blue rounded-lg flex gap-1 text-omni-background-grey font-semibold"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="size-4" />
            Add New
          </Button>
          <Button className="bg-omni-background-grey rounded-lg flex gap-1 text-omni-blue font-semibold">
            <Settings2 className="size-4" />
            Filters
          </Button>
        </div>
      </header>
      <OmniContactTable accountId={user.id} key={refreshKey} />
      <AddContactDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleContactAdded}
      />
    </section>
  );
};

export default ContactsPage;
