import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navigation } from "@/components/layout/Navigation";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Umeko - Japanese Learning Platform",
  description: "Master Japanese with our intelligent learning system featuring kanji, vocabulary, and spaced repetition.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <main>
          <Providers>
            <Navigation />
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
