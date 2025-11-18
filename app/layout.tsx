import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthSessionProvider from "@/components/providers/session-provider";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Moha Micro Insurance",
  description: "Protecting what matters most with affordable insurance solutions",
  icons: {
        icon: "/moha-logo.svg",           // favicon
        shortcut: "/moha-logo.svg",       // optional, for older browsers
        apple: "/moha-logo.svg",          // optional, for iOS devices
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}