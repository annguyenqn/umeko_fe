
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navigation } from "@/components/layout/Navigation";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });
import { InitAuth } from "@/components/auth/InitAuth";
import { Metadata } from "next";
import Script from 'next/script';
import { GoogleOAuthProvider } from '@react-oauth/google';

// import { useAuthStore } from "@/store/useAuthStore";
// import { useEffect } from "react";
export const metadata: Metadata = {
  title: "Umeko - Learn Japanese Vocabulary & Kanji with Spaced Repetition",
  description: "Master Japanese vocabulary and Kanji (JLPT N5-N1) with Umeko. Personalized flashcards and spaced repetition algorithms to boost your learning efficiency.",
  keywords: "Japanese learning, JLPT N5, JLPT N4, JLPT N3, JLPT N2, JLPT N1, Kanji, vocabulary, spaced repetition, flashcards",
  openGraph: {
    title: "Umeko - Japanese Vocabulary & Kanji Learning",
    description: "Effective Japanese learning with flashcards and spaced repetition for JLPT levels N5 to N1.",
    url: "https://umeko.io.vn", // Replace with your actual domain
    siteName: "Umeko",
    images: [
      {
        url: "https://your-umeko-domain.com/og-image.jpg", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "Umeko - Learn Japanese Vocabulary and Kanji",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Umeko - Learn Japanese Vocabulary & Kanji",
    description: "Study JLPT N5-N1 with Umeko’s flashcards and spaced repetition system.",
  },
  alternates: {
    canonical: "https://umeko.io.vn",
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
      <head>
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZF5LVEF05L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZF5LVEF05L');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <main>
          <Providers>
            <Navigation />
            <Toaster richColors />
            <InitAuth />
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
              {children}
            </GoogleOAuthProvider>
          </Providers>
        </main>
      </body>
    </html>
  );
}