"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import {
  KeyRound,
  LogIn,
  LogOut,
  LucideIcon,
  Mail,
  Smartphone,
  TriangleAlert,
  X,
} from "lucide-react";
import { AccountActivityEvent, SessionInfo } from "@/lib/settings";

const iconMap: Record<string, LucideIcon> = {
  alert: TriangleAlert,
  login: LogIn,
  key: KeyRound,
  logout: LogOut,
  smartphone: Smartphone,
  mail: Mail,
};

export const ActiveSessionsTable = ({
  sessions,
  onLogout,
}: {
  sessions: SessionInfo[];
  onLogout: (sessionId: string) => void;
}) => (
  <Table>
    <TableHeader>
      <TableRow className="font-bold text-sm">
        <TableHead>Browser</TableHead>
        <TableHead>Country</TableHead>
        <TableHead>Most recent activity</TableHead>
        <TableHead>IP address</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {sessions.map((session) => (
        <TableRow key={session.id}>
          <TableCell className="font-medium">
            {session.browser}
            {session.isCurrentDevice && (
              <span className="ml-2 rounded-full bg-omni-green/10 text-omni-green text-xs font-semibold px-2 py-0.5">
                This device
              </span>
            )}
          </TableCell>
          <TableCell>{session.country}</TableCell>
          <TableCell>{session.lastLoginAt}</TableCell>
          <TableCell>{session.ipAddress}</TableCell>
          <TableCell>
            {!session.isCurrentDevice && (
              <Button
                variant="ghost"
                className="p-0 min-h-10 min-w-10 hover:text-omni-red transition-colors"
                onClick={() => onLogout(session.id)}
                aria-label="Log out this session"
              >
                <X className="size-4" />
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const ActivityHistoryTable = ({
  events,
}: {
  events: AccountActivityEvent[];
}) => (
  <Table>
    <TableHeader>
      <TableRow className="font-bold text-sm">
        <TableHead>Event</TableHead>
        <TableHead>Source</TableHead>
        <TableHead>IP address</TableHead>
        <TableHead>Date and time</TableHead>
        <TableHead>Country</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody className="text-ellipsis">
      {events.map((event, index) => {
        const Icon = iconMap[event.icon] ?? LogIn;
        return (
          <TableRow key={index}>
            <TableCell className="flex items-center gap-4">
              <Icon
                className={`h-4 w-4 ${
                  event.isError ? "text-red-500" : "text-omni-blue"
                }`}
              />
              {event.event}
            </TableCell>
            <TableCell>{event.source}</TableCell>
            <TableCell>{event.ipAddress}</TableCell>
            <TableCell>{event.dateTime}</TableCell>
            <TableCell>{event.country}</TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);
