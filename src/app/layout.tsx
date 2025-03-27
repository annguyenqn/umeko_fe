'use client'
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navigation } from "@/components/layout/Navigation";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
// export const metadata: Metadata = {
//   title: "Umeko - Japanese Learning Platform",
//   description: "Master Japanese with our intelligent learning system featuring kanji, vocabulary, and spaced repetition.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const fetchUser = useAuthStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser() // ✅ tự fetch user từ token
  }, [fetchUser])
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <main>
          <Providers>
            <Navigation />
            <Toaster richColors />
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
