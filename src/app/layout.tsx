import type { Metadata } from "next";
import "./globals.css";
import { appName, appDescription } from "@/constants";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

// TODO: FIX THE AUTH
// TODO: 1) It doesn't keep the state on a reload
// TODO: 2) It sends too much data to the backend
// TODO: 3) It doesn't provide the global state to get the user and its attributes
// TODO: 4) I dont think it sends the token on each request
// TODO: 4) Token Updates should be silent
// TODO: 5) If your token is valid auto sign you in, quickly. If your token is valid and you try to login it should check for a valid token first then auto

// TODO: ADD POLYGLOT SUPPORT
// TODO: ADD DARK MODE AND MAKE IT LOOK GOOD
// TODO: FIX THE GODDAMN FONTS
// TODO: AFTER YOU LOGIN YOU SHOULD GO BACK TO WHERE YOU WHERE BEFORE

export const metadata: Metadata = {
  title: appName,
  description: appDescription,
  icons: {
    icon: "/icons/Omni-Logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
