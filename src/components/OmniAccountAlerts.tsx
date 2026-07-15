"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, X } from "lucide-react";
import { useAuth } from "./AuthContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import OmniVerifyAccount from "./OmniVerifyAccount";

const activationAckKey = (accountId: string) =>
  `omni-activation-ack-${accountId}`;

export default function OmniAccountAlerts() {
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();
  const status: string = user?.kycStatus || "";

  // The congratulations alert appears exactly once, right after activation —
  // remember per account that it has been shown.
  const [activationAcked] = useState(() => {
    if (typeof window === "undefined" || !user?.id) return false;
    return localStorage.getItem(activationAckKey(user.id)) !== null;
  });

  useEffect(() => {
    if (status === "approved" && user?.id) {
      localStorage.setItem(activationAckKey(user.id), new Date().toISOString());
    }
  }, [status, user?.id]);

  if (status === "approved" && activationAcked) return null;
  if (!isVisible && status !== "rejected") return null;

  const alertContent: Record<
    string,
    {
      title: string;
      description: string;
      className: string;
      icon: React.ReactNode;
    }
  > = {
    pending: {
      title: "Verify your account",
      description:
        "You can look around, but sending money and cards stay locked until you verify. It takes less than a minute — just review your details and sign.",
      className: "border-yellow-500 bg-yellow-50 text-yellow-900",
      icon: <ShieldAlert className="h-6 w-6 text-yellow-600" />,
    },
    approved: {
      title: "Account Activated",
      description:
        "Congratulations! Your account has been successfully activated. You now have full access to all our features. Enjoy using our platform!",
      className: "border-green-500 bg-green-50 text-green-900",
      icon: (
        <div className="h-full w-fit flex justify-center items-center ">
          <svg
            className="animate-pulse h-8 w-8 "
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      ),
    },
    rejected: {
      title: "Account Not Activated",
      description:
        "We're sorry, but your account could not be activated at this time. If you believe this is a mistake, please contact our support team for assistance.",
      className: "border-red-500 bg-red-50 text-red-900",
      icon: (
        <svg
          className="h-6 w-6 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  if (!alertContent[status]) return null;

  const { title, description, className, icon } = alertContent[status];

  return (
    <Alert
      variant="default"
      className={`fixed top-4 right-4 w-80 sm:w-[70%] lg:w-[30%] md:w-[50%] z-50 p-4 ${className}`}
    >
      <div className="flex items-start space-x-4 ">
        <div className="flex-shrink-0 mt-0.5 h-full">{icon}</div>
        <div className="flex-grow">
          <AlertTitle className="text-lg font-semibold">{title}</AlertTitle>
          <AlertDescription className="mt-2">
            {description}
            {status === "rejected" && (
              <Link
                href="mailto:support@mail.com"
                className="underline font-medium hover:text-red-700 transition-colors"
              >
                Contact support
              </Link>
            )}
          </AlertDescription>
          {status === "pending" && (
            <OmniVerifyAccount
              trigger={
                <Button className="mt-3 rounded-full bg-omni-blue hover:bg-omni-dark-blue text-white font-semibold px-5 h-8 transition-[background-color,scale] active:scale-[0.96]">
                  Verify account
                </Button>
              }
            />
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className={cn(
            "flex-shrink-0  transition-colors",
            status === "approved"
              ? "text-green-700 hover:text-green-900"
              : "text-yellow-700 hover:text-yellow-900"
          )}
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </Alert>
  );
}
