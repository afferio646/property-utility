import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Property Management Utility",
  description: "App for property owners, project managers, and contractors to manage the flow of trade work done on a property.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { DemoProvider } from "@/contexts/DemoContext";
import SignUpModal from "./SignUpModal";
import ManageUsersModal from "./ManageUsersModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b101e]`}
      >
        <DemoProvider>
          <main>
            {children}
          </main>
          <SignUpModal />
          <ManageUsersModal />
        </DemoProvider>
      </body>
    </html>
  );
}
