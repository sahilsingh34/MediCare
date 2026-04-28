import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MediCare | Premium Doctor Appointments",
  description: "Book appointments with trusted doctors, manage your schedule, and get the best care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-background text-text-dark selection:bg-primary/20">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
