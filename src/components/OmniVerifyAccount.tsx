"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BadgeCheck,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { getProfile, submitKycConsent, UserProfile } from "@/lib/settings";
import { useToast } from "@/hooks/use-toast";
import { OmniOffline } from "./OmniCardState";

interface OmniVerifyAccountProps {
  trigger: ReactNode;
  /** Called after a successful verification (session user already refreshed) */
  onVerified?: () => void;
}

const maskGovId = (govId: string) =>
  govId.length > 2 ? `••••••${govId.slice(-2)}` : "••••";

const InfoRow: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2 border-b border-omni-background-grey last:border-0">
    <span className="text-sm text-omni-text-grey">{label}</span>
    <span className="text-sm font-semibold text-omni-dark-blue text-right">
      {value || "—"}
    </span>
  </div>
);

/**
 * Identity verification: the user reviews the information they gave at
 * registration and signs a consent confirming it's accurate. For now that's
 * the whole check — document upload and manual review come later.
 */
const OmniVerifyAccount: FC<OmniVerifyAccountProps> = ({
  trigger,
  onVerified,
}) => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);

  const loadProfile = async () => {
    if (!user?.id) return;
    setLoadFailed(false);
    try {
      setProfile(await getProfile(user.id));
    } catch (error) {
      console.error("Failed to load profile for verification:", error);
      setLoadFailed(true);
    }
  };

  useEffect(() => {
    if (open && !profile) {
      loadProfile();
    }
    if (!open) {
      setConsent(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.id]);

  // Refreshing the session user flips kycStatus everywhere, which unmounts
  // whatever hosts this dialog (tracker card, pending alert) — so hold the
  // refresh until the user leaves the success screen.
  const finishVerification = async () => {
    setOpen(false);
    await refreshUser();
    onVerified?.();
  };

  const handleApprove = async () => {
    if (!user?.id || !consent) return;
    setSubmitting(true);
    try {
      await submitKycConsent(user.id);
      setVerified(true);
    } catch (error) {
      console.error("Verification failed:", error);
      toast({
        title: "Verification failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && verified) {
          finishVerification();
        } else {
          setOpen(value);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl bg-white">
        {verified ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="rounded-full bg-omni-green/10 p-5 text-omni-green">
              <BadgeCheck className="size-10" />
            </div>
            <div className="space-y-1">
              <h2 className="font-poppins font-semibold text-xl text-omni-dark-blue text-balance">
                You&apos;re verified!
              </h2>
              <p className="text-sm text-omni-text-grey text-pretty">
                Your account is approved — sending money, cards and every
                other feature are now unlocked.
              </p>
            </div>
            <Button
              onClick={finishVerification}
              className="rounded-full bg-omni-green hover:bg-omni-green/80 text-white font-semibold px-8 transition-[background-color,scale] active:scale-[0.96]"
            >
              Start using Omni
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-poppins text-omni-dark-blue">
                <ShieldCheck className="size-5 text-omni-blue" />
                Verify your identity
              </DialogTitle>
              <DialogDescription className="text-pretty">
                Review the information from your registration. If everything
                is correct, sign below to activate your account.
              </DialogDescription>
            </DialogHeader>

            {loadFailed ? (
              <div className="py-4">
                <OmniOffline onRetry={loadProfile} />
              </div>
            ) : !profile ? (
              <div className="space-y-2 py-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton
                    key={i}
                    className="h-8 w-full rounded-lg bg-omni-text-grey/25"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="rounded-2xl border-2 border-omni-background-grey p-4">
                  <InfoRow
                    label="Legal name"
                    value={`${profile.firstName} ${profile.lastName}`}
                  />
                  <InfoRow label="Date of birth" value={profile.dob} />
                  <InfoRow
                    label="Address"
                    value={[
                      profile.address,
                      profile.city,
                      profile.country,
                      profile.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  />
                  <InfoRow label="Phone" value={profile.phone} />
                  <InfoRow
                    label="Government ID"
                    value={maskGovId(profile.govId)}
                  />
                </div>
                <p className="text-xs text-omni-text-grey text-pretty">
                  Something wrong? Update it in{" "}
                  <a href="/settings" className="text-omni-blue font-semibold">
                    Settings
                  </a>{" "}
                  before signing.
                </p>

                <label className="flex items-start gap-3 rounded-2xl bg-omni-background-grey p-4 cursor-pointer">
                  <Checkbox
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked === true)}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-omni-dark-blue text-pretty">
                    I confirm this information is accurate and authorize Omni
                    to process it to verify my identity.
                  </span>
                </label>

                <Button
                  onClick={handleApprove}
                  disabled={!consent || submitting}
                  className="w-full rounded-full bg-omni-blue hover:bg-omni-dark-blue text-white font-semibold transition-[background-color,scale] active:scale-[0.96] disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "Approve my account"
                  )}
                </Button>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OmniVerifyAccount;
