import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Navigation } from "@/components/navigation";
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
  title: "Indorunners Purwakarta - Event Management",
  description: "Sistem manajemen event lari untuk komunitas Indorunners Purwakarta",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-secondary-50`}
      >
        <SessionProvider>
          <div className="min-h-screen bg-secondary-50">
            <Navigation />
            <main>
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
