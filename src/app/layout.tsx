
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navigation } from "@/components/layout/Navigation";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });
import { Metadata } from "next";
// import { useAuthStore } from "@/store/useAuthStore";
// import { useEffect } from "react";
export const metadata: Metadata = {
  title: "Umeko - Learn Japanese Vocabulary & Kanji with Spaced Repetition",
  description: "Master Japanese vocabulary and Kanji (JLPT N5-N1) with Umeko. Personalized flashcards and spaced repetition algorithms to boost your learning efficiency.",
  keywords: "Japanese learning, JLPT N5, JLPT N4, JLPT N3, JLPT N2, JLPT N1, Kanji, vocabulary, spaced repetition, flashcards",
  openGraph: {
    title: "Umeko - Japanese Vocabulary & Kanji Learning",
    description: "Effective Japanese learning with flashcards and spaced repetition for JLPT levels N5 to N1.",
    url: "https://your-umeko-domain.com", // Replace with your actual domain
    siteName: "Umeko",
    images: [
      {
        url: "https://your-umeko-domain.com/og-image.jpg", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "Umeko - Learn Japanese Vocabulary and Kanji",
      },
    ],
    locale: "en_US", // Adjust based on your target audience
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Umeko - Learn Japanese Vocabulary & Kanji",
    description: "Study JLPT N5-N1 with Umeko’s flashcards and spaced repetition system.",
  },
  alternates: {
    canonical: "https://your-umeko-domain.com", // Replace with your actual domain
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}


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
            <Toaster richColors />
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
