import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { inter } from './fonts'
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Ideas Portal",
  description: "A platform for sharing and managing ideas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} h-full`}>
          <div className="min-h-screen bg-gray-50">
            {children}
            <Toaster position="top-right" />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
