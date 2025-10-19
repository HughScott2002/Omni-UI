"use client";

import { Button } from "@/components/ui/button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  BellDot,
  CheckCheck,
  Settings,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "./AuthContext";
import { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";

const OmniNotification = () => {
  const { user } = useAuth();
  const accountId = user?.id; // Using user.id as account_id

  const {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(accountId);

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState("16rem");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMaxHeight = () => {
      if (contentRef.current) {
        const windowHeight = window.innerHeight;
        const contentRect = contentRef.current.getBoundingClientRect();
        const maxAvailableHeight = windowHeight - contentRect.top - 20; // 20px buffer
        setMaxHeight(
          isExpanded
            ? `${maxAvailableHeight - (20 / 100) * maxAvailableHeight}px`
            : "16rem"
        );
      }
    };
    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);
    return () => window.removeEventListener("resize", updateMaxHeight);
  }, [isExpanded]);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already
    if (!notification.is_read) {
      await markAsRead(notification.notification_id);
    }

    // Navigate to action URL if provided
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="relative" aria-label="Notifications">
          <BellDot className="size-9 p-2" />

          {/* Unread Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-omni-red rounded-full min-w-[18px]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}

          {/* Connection Status Indicator */}
          <span
            className={cn(
              "absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white",
              isConnected ? "bg-omni-green" : "bg-omni-text-grey"
            )}
            title={isConnected ? "Connected" : "Disconnected"}
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-80 bg-omni-background-grey rounded-md shadow-md"
          ref={contentRef}
        >
          {/* Header */}
          <div className="flex justify-between items-center w-full text-sm font-semibold px-4 py-2">
            <div className="flex items-center gap-2">
              <span>Notifications</span>
              {/* Connection indicator */}
              <div title={isConnected ? "Real-time connected" : "Disconnected"}>
                {isConnected ? (
                  <Wifi className="size-4 text-omni-green" />
                ) : (
                  <WifiOff className="size-4 text-omni-text-grey" />
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                className="flex gap-1 -p-2 text-omni-blue"
                variant="ghost"
                size="sm"
              >
                <CheckCheck className="size-5" />
                <span className="font-semibold">Mark all as read</span>
              </Button>
            )}
          </div>

          <hr className="text-omni-pitch-black bg-omni-text-grey" />

          {/* Notifications List */}
          <div
            className={cn(
              "overflow-y-auto transition-all duration-300 ease-in-out px-4"
            )}
            style={{ maxHeight }}
          >
            {isLoading && notifications.length === 0 ? (
              <div className="p-8 text-center text-omni-text-grey">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-omni-text-grey">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenu.Item key={notification.notification_id} asChild>
                  <div>
                    <NotificationItem
                      notification={notification}
                      onClick={() => handleNotificationClick(notification)}
                      onDelete={() =>
                        deleteNotification(notification.notification_id)
                      }
                    />
                  </div>
                </DropdownMenu.Item>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between w-full text-xs font-semibold px-2 py-2 border-t border-omni-text-grey/20">
            <Button
              className="text-omni-dark-blue"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "See all notifications"}
            </Button>
            <Link href={"/settings/notifications"}>
              <Settings className="size-5 mr-1" />
            </Link>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default OmniNotification;

// Notification Item Component
interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  onDelete: () => void;
}

function NotificationItem({
  notification,
  onClick,
  onDelete,
}: NotificationItemProps) {
  const source = notification.icon || "https://github.com/shadcn.png";

  // Format date
  let formattedDate = "Just now";
  try {
    formattedDate = formatDistanceToNow(new Date(notification.date), {
      addSuffix: true,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
  }

  // Get priority styling
  const getPriorityStyle = () => {
    if (notification.priority === "high") {
      return "border-l-4 border-omni-red";
    }
    return "";
  };

  // Get type styling
  const getTypeStyle = () => {
    switch (notification.type) {
      case "success":
        return "bg-omni-green/10";
      case "warning":
        return "bg-yellow-500/10";
      case "action":
        return "bg-omni-blue/10";
      case "info":
      default:
        return notification.is_read ? "" : "bg-omni-blue/5";
    }
  };

  return (
    <div
      className={cn(
        "flex gap-2 w-full py-3 cursor-pointer hover:bg-white/50 transition-colors rounded-md px-2",
        getPriorityStyle(),
        getTypeStyle()
      )}
      onClick={onClick}
    >
      <Avatar className="my-auto flex-shrink-0">
        <AvatarImage src={source} alt="notification icon" />
        <AvatarFallback>{notification.label[0]}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col w-full gap-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-omni-dark-blue font-bold capitalize text-sm flex-1">
            {notification.label}
          </span>

          {!notification.is_read && (
            <span className="w-2 h-2 bg-omni-blue rounded-full flex-shrink-0 mt-1" />
          )}
        </div>

        <p className="text-sm font-medium text-omni-pitch-black line-clamp-2">
          {notification.content}
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-semibold text-omni-text-grey">
            {formattedDate}
          </span>

          {notification.category && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-omni-blue/20 text-omni-dark-blue">
              {notification.category}
            </span>
          )}
        </div>

        {notification.type === "action" && notification.action_url && (
          <Button
            className="bg-omni-blue text-white px-4 mt-2 w-full"
            size="sm"
          >
            Take Action →
          </Button>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1 rounded hover:bg-omni-red/10 flex-shrink-0 self-start"
        aria-label="Delete notification"
      >
        <Trash2 className="size-4 text-omni-text-grey hover:text-omni-red" />
      </button>
    </div>
  );
}
