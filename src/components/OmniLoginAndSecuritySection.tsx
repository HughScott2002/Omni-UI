"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  ActiveSessionsTable,
  ActivityHistoryTable,
} from "./OmniLoginAndSecuritySectionTables";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  AccountActivityEvent,
  changePassword,
  getAccountActivity,
  listSessions,
  logoutOtherSessions,
  logoutSession,
  SessionInfo,
} from "@/lib/settings";
import { OmniEmpty, OmniOffline, OmniPanelSkeleton } from "./OmniCardState";
import { DashboardStatus } from "@/hooks/useDashboardData";

const OmniLoginAndSecuritySection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [activity, setActivity] = useState<AccountActivityEvent[]>([]);
  const [status, setStatus] = useState<DashboardStatus>("loading");

  const load = useCallback(async () => {
    if (!user?.email) return;
    setStatus("loading");
    try {
      const [sessionList, activityList] = await Promise.all([
        listSessions(user.email),
        getAccountActivity(user.email),
      ]);
      setSessions(sessionList);
      setActivity(activityList);
      setStatus("ready");
    } catch (error) {
      console.error("Failed to load security data:", error);
      setStatus("error");
    }
  }, [user?.email]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogoutOthers = async () => {
    try {
      await logoutOtherSessions();
      toast({
        title: "Signed out everywhere else",
        description: "All other sessions have been logged out.",
      });
      load();
    } catch (error) {
      toast({
        title: "Couldn't log out other sessions",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      await logoutSession(sessionId);
      toast({ title: "Session logged out" });
      load();
    } catch (error) {
      toast({
        title: "Couldn't log out that session",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="size-full flex flex-col gap-2 overflow-hidden">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Security</h2>
      </div>
      <ScrollArea className="h-full w-full  overflow-auto">
        <div className="pr-4">
          {/* Password Section */}
          <div className="w-full rounded-2xl mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold">Password</h4>
                <span className="text-omni-text-grey text-sm">
                  Set a unique password to protect your account
                </span>
              </div>
              <ChangePasswordComponent onChanged={load} />
            </div>
          </div>

          {/* Active Sessions Section */}
          <div className="w-full rounded-2xl mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-lg font-semibold">Active sessions</h4>
                <span className="text-omni-text-grey text-sm">
                  All sessions currently logged in with {user?.email}:
                </span>
              </div>
              <Button
                onClick={handleLogoutOthers}
                disabled={status !== "ready" || sessions.length <= 1}
                className="bg-omni-background-grey rounded-full text-omni-blue font-semibold transition-[background-color,scale] active:scale-[0.96] disabled:opacity-60"
              >
                Log Out Other Sessions
              </Button>
            </div>
            {status === "loading" ? (
              <OmniPanelSkeleton rows={2} />
            ) : status === "error" ? (
              <OmniOffline onRetry={load} />
            ) : sessions.length === 0 ? (
              <OmniEmpty title="No active sessions" />
            ) : (
              <ActiveSessionsTable
                sessions={sessions}
                onLogout={handleLogoutSession}
              />
            )}
          </div>

          {/* Activity History Section */}
          <div className="w-full rounded-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-lg font-semibold">Activity history</h4>
                <span className="text-omni-text-grey text-sm">
                  Recent sign-in activity on your account:
                </span>
              </div>
            </div>
            {status === "loading" ? (
              <OmniPanelSkeleton rows={3} />
            ) : status === "error" ? (
              <OmniOffline onRetry={load} />
            ) : activity.length === 0 ? (
              <OmniEmpty
                title="No recent activity"
                hint="Sign-ins and security events will appear here"
              />
            ) : (
              <ActivityHistoryTable events={activity} />
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

const ChangePasswordComponent = ({ onChanged }: { onChanged: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  const handleSave = async () => {
    if (!user) return;
    if (next !== confirm) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must be identical.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      await changePassword({
        accountId: user.id,
        email: user.email,
        currentPassword: current,
        newPassword: next,
        confirmNewPassword: confirm,
      });
      toast({
        title: "Password changed",
        description:
          "For your security, other devices have been signed out.",
      });
      setOpen(false);
      reset();
      onChanged();
    } catch (error) {
      toast({
        title: "Couldn't change password",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-omni-background-grey rounded-full text-omni-blue font-semibold transition-[background-color,scale] active:scale-[0.96]">
          Change Password
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-omni-background-grey">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and a new password to update your
            credentials.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="current">Current Password</Label>
            <Input
              id="current"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new">New Password</Label>
            <Input
              id="new"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Confirm New Password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            className="rounded-full bg-white"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !current || !next || !confirm}
            className="rounded-full bg-omni-blue text-white transition-[background-color,scale] active:scale-[0.96] disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OmniLoginAndSecuritySection;
